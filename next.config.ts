import type {NextConfig} from 'next'

function safeOrigin(value: string | undefined, fallback: string) {
  try { return new URL(value || fallback).origin } catch { return fallback }
}

const studioOrigin = safeOrigin(process.env.NEXT_PUBLIC_SANITY_STUDIO_URL, 'http://localhost:3333')
const extraFrameAncestors = (process.env.SANITY_FRAME_ANCESTORS || '')
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean)

// Do not use X-Frame-Options:SAMEORIGIN: Studio and frontend are commonly on
// different origins. Prefer an explicit CSP allow-list for Presentation.
// The exact configured Studio is always allowed. Add extra trusted parent origins
// only when needed (for example https://sanity.io when using Sanity's managed UI).
const frameAncestors = Array.from(new Set([
  "'self'",
  studioOrigin,
  ...extraFrameAncestors,
])).join(' ')

const headers = [
  {key: 'X-Content-Type-Options', value: 'nosniff'},
  {key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin'},
  {key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()'},
  {key: 'Content-Security-Policy', value: `frame-ancestors ${frameAncestors};`},
]

if (process.env.ENABLE_HSTS === 'true') {
  headers.push({key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload'})
}

const nextConfig: NextConfig = {
  images: {remotePatterns: [{protocol: 'https', hostname: 'cdn.sanity.io'}]},
  async headers() { return [{source: '/(.*)', headers}] },
}

export default nextConfig
