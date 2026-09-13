'use client'

import Script from 'next/script'
import {FormEvent, useState, type ReactNode} from 'react'
import {stegaClean} from 'next-sanity'

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void
      execute: (key: string, opts: {action: string}) => Promise<string>
    }
  }
}

export default function DynamicForm({form}: {form: any}) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  if (!form?._id || form.enabled === false) return null

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('sending')
    setMessage('')
    const formElement = event.currentTarget
    const data = new FormData(formElement)
    data.set('formId', form._id)

    if (form.antiSpamMode === 'recaptcha') {
      if (!form.recaptchaSiteKey || !window.grecaptcha) {
        setStatus('error')
        setMessage('reCAPTCHA is not ready.')
        return
      }
      const token = await window.grecaptcha.execute(stegaClean(form.recaptchaSiteKey), {action: 'form_submit'})
      data.set('recaptchaToken', token)
    }

    try {
      const response = await fetch('/api/forms/submit', {method: 'POST', body: data})
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Submission failed')
      setStatus('success')
      setMessage(result.message || form.successMessage || 'Thank you.')
      if (form.resetAfterSubmit !== false) formElement.reset()
      if (result.redirectUrl) window.location.assign(result.redirectUrl)
    } catch (error) {
      setStatus('error')
      setMessage(error instanceof Error ? error.message : 'Submission failed')
    }
  }

  return (
    <section className={`form-shell form-${stegaClean(form.theme || 'light')} labels-${stegaClean(form.labelPosition || 'above')} button-${stegaClean(form.buttonAlignment || 'left')}`}>
      {form.antiSpamMode === 'recaptcha' && form.recaptchaSiteKey && (
        <Script src={`https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(stegaClean(form.recaptchaSiteKey))}`} strategy="afterInteractive" />
      )}
      {form.heading && <h2>{form.heading}</h2>}
      {form.description && <p>{form.description}</p>}
      <form onSubmit={submit} encType="multipart/form-data">
        <input className="honeypot" name="company_website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
        <div className={`form-grid columns-${stegaClean(form.columns || 1)}`}>
          {form.fields?.filter((field: any) => field.enabled !== false).map((field: any, index: number) => (
            <Field key={`${field.name || field.type}-${index}`} field={field} formLabelPosition={form.labelPosition} />
          ))}
        </div>
        <button className="button form-submit" type="submit" disabled={status === 'sending'}>{status === 'sending' ? 'Sending…' : form.buttonText || 'Submit'}</button>
        {message && <p className={`form-message ${status}`}>{message}</p>}
      </form>
    </section>
  )
}

function Field({field, formLabelPosition}: {field: any; formLabelPosition?: string}) {
  const name = stegaClean(field.name || '')
  const type = stegaClean(field.type || 'text')
  const width = stegaClean(field.width || 'full')
  const className = `field ${width} ${field.cssClass ? stegaClean(field.cssClass) : ''}`.trim()
  const hideLabel = Boolean(field.hideLabel) || formLabelPosition === 'hidden'
  const labelText = `${field.label || ''}${field.required ? ' *' : ''}`

  if (type === 'heading') return <div className={`${className} form-instruction`}><h3>{field.label}</h3>{field.content && <p>{field.content}</p>}</div>
  if (type === 'html') return <div className={`${className} form-note`}><strong>{field.label}</strong>{field.content && <p>{field.content}</p>}</div>
  if (type === 'divider') return <div className={`${className} form-divider`}><hr /></div>

  const common = {
    name,
    required: Boolean(field.required),
    defaultValue: field.defaultValue ? stegaClean(field.defaultValue) : undefined,
    autoComplete: field.autocomplete ? stegaClean(field.autocomplete) : undefined,
    minLength: field.minLength || undefined,
    maxLength: field.maxLength || undefined,
    pattern: field.pattern ? stegaClean(field.pattern) : undefined,
  }

  const Label = ({children}: {children: ReactNode}) => (
    <label className={className}>
      {!hideLabel && <span className="field-label">{labelText}</span>}
      {children}
      {field.helpText && <small>{field.helpText}</small>}
    </label>
  )

  if (type === 'hidden') return <input type="hidden" {...common} />
  if (type === 'textarea') return <Label><textarea {...common} placeholder={field.placeholder} rows={field.rows || 5} /></Label>
  if (type === 'select') return <Label><select {...common}><option value="">Select…</option>{field.options?.map((option: string) => <option key={option} value={option}>{option}</option>)}</select></Label>
  if (type === 'radio') return <fieldset className={className}><legend>{labelText}</legend>{field.options?.map((option: string) => <label className="choice" key={option}><input type="radio" name={name} value={option} required={Boolean(field.required)} /> {option}</label>)}</fieldset>
  if (type === 'checkbox') return <fieldset className={className}><legend>{labelText}</legend>{field.options?.map((option: string) => <label className="choice" key={option}><input type="checkbox" name={name} value={option} /> {option}</label>)}</fieldset>
  if (type === 'consent') return <label className={`${className} choice`}><input type="checkbox" name={name} value="yes" required={Boolean(field.required)} /> {field.label}</label>
  if (type === 'file') return <Label><input type="file" name={name} required={Boolean(field.required)} accept={stegaClean(field.acceptedFileTypes || '')} multiple={Boolean(field.multipleFiles)} /></Label>

  const inputType = ['email', 'tel', 'url', 'number', 'date', 'time', 'datetime-local'].includes(type) ? type : 'text'
  return <Label><input type={inputType} {...common} placeholder={field.placeholder} min={field.min ?? undefined} max={field.max ?? undefined} step={field.step ?? undefined} /></Label>
}
