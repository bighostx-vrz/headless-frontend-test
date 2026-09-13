'use client'

import {useIsPresentationTool} from 'next-sanity/hooks'
import {studioUrl} from '@/sanity/env'

function cleanId(value: string) {
  return String(value || '').replace(/^drafts\./, '').replace(/^versions\.[^.]+\./, '')
}

export default function SectionStudioLink({documentId,documentType='webSection'}:{documentId:string;documentType?:string}) {
  const isPresentationTool = useIsPresentationTool()
  const id = cleanId(documentId)
  if (isPresentationTool || !id) return null

  // Official Sanity edit-intent URL. This is deliberately shown only while the
  // frontend is in draft/preview mode; public visitors never see an admin link.
  const base = studioUrl.replace(/\/$/, '')
  const type=documentType==='bhxConnectedSection'?'bhxConnectedSection':'webSection'
  const href = `${base}/intent/edit/id=${encodeURIComponent(id)};type=${encodeURIComponent(type)}`

  return <a className="bhx-open-in-studio" href={href} target="_blank" rel="noopener noreferrer">Open in Studio</a>
}
