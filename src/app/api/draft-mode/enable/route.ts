import {defineEnableDraftMode} from 'next-sanity/draft-mode'
import {client} from '@/sanity/lib/client'

export const dynamic = 'force-dynamic'

const readToken = process.env.SANITY_API_READ_TOKEN || ''
const enableDraftMode = defineEnableDraftMode({
  client: client.withConfig({token: readToken}),
}).GET

export async function GET(request: Request) {
  if (!readToken) {
    return new Response(
      'BigHostX preview is not configured: SANITY_API_READ_TOKEN is missing in frontend/.env.local. Add a Sanity Viewer/read token, restart the Next.js server, then reload Presentation.',
      {status: 500, headers: {'content-type': 'text/plain; charset=utf-8'}},
    )
  }
  return enableDraftMode(request)
}
