import {defineLive} from 'next-sanity/live'
import {client} from './client'

// Sanity's current recommended Next.js App Router integration.
// The Viewer token remains server-side in normal browsing and is only shared with
// the browser while Draft Mode is active so Live Content subscriptions can work.
const readToken = process.env.SANITY_API_READ_TOKEN

export const {sanityFetch: liveSanityFetch, SanityLive} = defineLive({
  client,
  serverToken: readToken,
  browserToken: readToken,
})
