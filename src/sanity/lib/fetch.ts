import type {QueryParams} from 'next-sanity'
import {draftMode} from 'next/headers'
import {client} from './client'
import {studioUrl} from '../env'
import {liveSanityFetch} from './live'

type FetchOptions = {
  stega?: boolean
  perspective?: 'published' | 'drafts' | string | string[]
}

/**
 * BigHostX compatibility wrapper around Sanity's recommended defineLive fetcher.
 * Existing routes keep the simple sanityFetch(query, params) signature.
 *
 * Primary path: Presentation / normal site -> defineLive handles perspective,
 * Content Source Maps, cache tags and real-time refresh.
 *
 * Compatibility path: SANITY_ALWAYS_PREVIEW_DRAFTS is retained only for an
 * explicitly protected dedicated preview deployment. It is not the preferred
 * stakeholder-sharing method; use Presentation -> Share when possible.
 */
export async function sanityFetch<T>(
  query: string,
  params: QueryParams = {},
  options: FetchOptions = {},
): Promise<T> {
  const alwaysPreviewDrafts = process.env.SANITY_ALWAYS_PREVIEW_DRAFTS === 'true'
  const token = process.env.SANITY_API_READ_TOKEN

  if (alwaysPreviewDrafts) {
    if (!token) {
      throw new Error('SANITY_API_READ_TOKEN is required when SANITY_ALWAYS_PREVIEW_DRAFTS=true.')
    }
    return client
      .withConfig({
        useCdn: false,
        stega: options.stega === false ? false : {enabled: true, studioUrl},
      })
      .fetch<T>(query, params, {
        token,
        perspective: options.perspective || 'drafts',
        next: {revalidate: 0},
      })
  }

  // Fail early with a useful message if a Studio draft session is active but the
  // Viewer/read token needed by defineLive is missing.
  if ((await draftMode()).isEnabled && !token) {
    throw new Error('SANITY_API_READ_TOKEN is required for Sanity Presentation / Draft Mode.')
  }

  const result = await liveSanityFetch({
    query: query as any,
    params,
    ...(options.stega === false ? {stega: false} : {}),
    ...(options.perspective ? {perspective: options.perspective as any} : {}),
  } as any)

  return result.data as T
}

export {SanityLive} from './live'
