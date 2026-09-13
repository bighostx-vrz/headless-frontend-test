import {NextResponse} from 'next/server'
import {Resend} from 'resend'
import {client} from '@/sanity/lib/client'
import {checkRateLimit,isAllowedWebhook,safeSuccessUrl,validateUpload} from './formsSecurityV1'

const submissionFormProjection=`_id,title,enabled,successMessage,successAction,successUrl,resetAfterSubmit,deliveryMode,
  "recipientEmails":recipientEmails[0...20],"ccEmails":ccEmails[0...20],"bccEmails":bccEmails[0...20],replyToField,emailSubject,webhookUrl,logSubmissions,antiSpamMode,maxUploads,
  "fields":fields[0...100]{_key,enabled,name,label,type,required,minLength,maxLength,min,max,pattern,acceptedFileTypes,maxFileSizeMb,multipleFiles}`

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (char) => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'}[char] || char))
}

async function logSubmission(form: any, status: string, rows: any[], error = '') {
  if (!form.logSubmissions || !process.env.SANITY_API_WRITE_TOKEN) return
  try {
    await client.withConfig({token: process.env.SANITY_API_WRITE_TOKEN, useCdn: false}).create({
      _type: 'formSubmission', formTitle: form.title || 'Form', status, submittedAt: new Date().toISOString(), rows, error,
    })
  } catch (logError) {
    console.error('[form log failed]', logError)
  }
}

async function verifyRecaptcha(token: string) {
  if (!process.env.RECAPTCHA_SECRET_KEY) return false
  const body = new URLSearchParams({secret: process.env.RECAPTCHA_SECRET_KEY, response: token})
  const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST', headers: {'content-type': 'application/x-www-form-urlencoded'}, body, signal: AbortSignal.timeout(5000),
  })
  const json = await response.json()
  return Boolean(json.success) && Number(json.score ?? 1) >= 0.4
}


async function sendWebhook(form: any, rows: {label: string; value: string}[]) {
  if (!form.webhookUrl) return {ok: false, error: 'Webhook URL is not configured.'}
  if (!isAllowedWebhook(form.webhookUrl)) return {ok: false, error: 'Webhook host is not allow-listed.'}
  const response = await fetch(form.webhookUrl, {
    method: 'POST',
    headers: {'content-type': 'application/json'},
    body: JSON.stringify({form: form.title || 'Website form', submittedAt: new Date().toISOString(), fields: rows}),
    cache: 'no-store',
    redirect: 'error',
    signal: AbortSignal.timeout(5000),
  })
  return response.ok ? {ok: true} : {ok: false, error: `Webhook returned ${response.status}.`}
}

export async function POST(request: Request) {
  const rate=checkRateLimit(request)
  if(!rate.ok)return NextResponse.json({error:'Too many requests. Please try again later.'},{status:429,headers:{'retry-after':String(rate.retryAfter||60)}})
  const body = await request.formData()
  const formId = String(body.get('formId') || '')
  if (String(body.get('company_website') || '')) return NextResponse.json({message: 'Thank you.'})
  if (!formId) return NextResponse.json({error: 'Missing form definition.'}, {status: 400})

  const form = await client.fetch<any>(`*[_type=="formDefinition"&&_id==$id][0]{${submissionFormProjection}}`, {id: formId})
  if (!form || form.enabled === false) return NextResponse.json({error: 'Form is not available.'}, {status: 404})

  if (form.antiSpamMode === 'recaptcha') {
    const ok = await verifyRecaptcha(String(body.get('recaptchaToken') || ''))
    if (!ok) {
      await logSubmission(form, 'blocked', [], 'reCAPTCHA verification failed')
      return NextResponse.json({error: 'Security verification failed.'}, {status: 400})
    }
  }

  const rows: {label: string; value: string}[] = []
  const attachments: {filename: string; content: Buffer}[] = []
  const valueMap: Record<string, string> = {}
  const fields = (form.fields || []).filter((field: any) => field.enabled !== false && !['heading', 'html', 'divider'].includes(field.type))

  for (const field of fields) {
    const values = body.getAll(field.name)
    const nonEmpty = values.filter((value) => value instanceof File ? value.size > 0 : String(value).trim().length > 0)

    if (field.required && nonEmpty.length === 0) return NextResponse.json({error: `${field.label} is required.`}, {status: 400})

    if (field.type === 'file') {
      const maxFiles = Math.min(Number(form.maxUploads || 5), 10)
      if (attachments.length + nonEmpty.length > maxFiles) return NextResponse.json({error: 'Too many uploaded files.'}, {status: 400})
      if (field.multipleFiles !== true && nonEmpty.length > 1) return NextResponse.json({error: `${field.label} accepts only one file.`}, {status: 400})
      for (const value of nonEmpty) {
        if (!(value instanceof File)) continue
        const max = Math.min(Number(field.maxFileSizeMb || 5), 10) * 1024 * 1024
        if (value.size > max) return NextResponse.json({error: `${field.label} exceeds the allowed file size.`}, {status: 400})
        const uploadCheck=validateUpload(value,field.acceptedFileTypes)
        if(!uploadCheck.ok)return NextResponse.json({error:`${field.label}: ${uploadCheck.error}`},{status:400})
        attachments.push({filename: value.name, content: Buffer.from(await value.arrayBuffer())})
        rows.push({label: field.label, value: value.name})
      }
      continue
    }

    const stringValue = nonEmpty.map((value) => String(value).trim()).join(', ')
    if (stringValue.length > 5000) return NextResponse.json({error: `${field.label} is too long.`}, {status: 400})
    if (field.type === 'email' && stringValue && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(stringValue)) return NextResponse.json({error: 'Please enter a valid email address.'}, {status: 400})
    if (field.type === 'url' && stringValue) {
      try { new URL(stringValue) } catch { return NextResponse.json({error: `Please enter a valid URL for ${field.label}.`}, {status: 400}) }
    }
    if (typeof field.minLength === 'number' && stringValue.length < field.minLength) return NextResponse.json({error: `${field.label} is too short.`}, {status: 400})
    if (typeof field.maxLength === 'number' && stringValue.length > field.maxLength) return NextResponse.json({error: `${field.label} is too long.`}, {status: 400})
    if (field.pattern && stringValue) {
      try { if (!new RegExp(field.pattern).test(stringValue)) return NextResponse.json({error: `${field.label} is not in the expected format.`}, {status: 400}) } catch { /* invalid admin regex is ignored in the learning build */ }
    }
    if (field.type === 'number' && stringValue) {
      const number = Number(stringValue)
      if (!Number.isFinite(number)) return NextResponse.json({error: `${field.label} must be a number.`}, {status: 400})
      if (typeof field.min === 'number' && number < field.min) return NextResponse.json({error: `${field.label} is below the minimum.`}, {status: 400})
      if (typeof field.max === 'number' && number > field.max) return NextResponse.json({error: `${field.label} is above the maximum.`}, {status: 400})
    }

    if (stringValue) {
      rows.push({label: field.label, value: stringValue})
      valueMap[field.name] = stringValue
    }
  }

  const wantsEmail = ['email', 'emailWebhook'].includes(form.deliveryMode)
  const wantsWebhook = ['webhook', 'emailWebhook'].includes(form.deliveryMode)

  if (form.deliveryMode === 'demo' || !form.deliveryMode) {
    await logSubmission(form, 'demo', rows)
    return NextResponse.json({message: form.successMessage || 'Demo submission received.', redirectUrl: form.successAction !== 'message' ? safeSuccessUrl(form.successUrl,request) : undefined})
  }

  if (wantsEmail) {
    const to = (form.recipientEmails || []).filter(Boolean)
    if (!process.env.RESEND_API_KEY || !process.env.FORMS_FROM_EMAIL || to.length === 0) {
      await logSubmission(form, 'failed', rows, 'Email delivery not configured')
      return NextResponse.json({error: 'Email delivery is not configured for this learning environment.'}, {status: 503})
    }
    const resend = new Resend(process.env.RESEND_API_KEY)
    const html = `<h2>${escapeHtml(form.title || 'Website form')}</h2><table>${rows.map((row) => `<tr><td><strong>${escapeHtml(row.label)}</strong></td><td>${escapeHtml(row.value)}</td></tr>`).join('')}</table>`
    const {error} = await resend.emails.send({
      from: process.env.FORMS_FROM_EMAIL,
      to,
      cc: form.ccEmails || undefined,
      bcc: form.bccEmails || undefined,
      replyTo: form.replyToField ? valueMap[form.replyToField] || undefined : undefined,
      subject: form.emailSubject || `Website form: ${form.title}`,
      html,
      attachments,
    })
    if (error) {
      await logSubmission(form, 'failed', rows, String(error))
      return NextResponse.json({error: 'Email could not be sent.'}, {status: 502})
    }
  }

  if (wantsWebhook) {
    const webhook = await sendWebhook(form, rows)
    if (!webhook.ok) {
      await logSubmission(form, 'failed', rows, webhook.error || 'Webhook failed')
      return NextResponse.json({error: webhook.error || 'Webhook could not be sent.'}, {status: 502})
    }
  }

  await logSubmission(form, 'sent', rows)
  return NextResponse.json({message: form.successMessage || 'Thank you. Your form has been submitted.', redirectUrl: form.successAction !== 'message' ? safeSuccessUrl(form.successUrl,request) : undefined})
}
