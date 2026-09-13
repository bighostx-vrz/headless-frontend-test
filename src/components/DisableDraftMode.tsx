'use client'

import {useIsPresentationTool} from 'next-sanity/hooks'

export default function DisableDraftMode() {
  const isPresentationTool = useIsPresentationTool()
  if (isPresentationTool) return null

  return (
    <a className="draft-exit" href="/api/draft-mode/disable">
      Exit Draft Preview
    </a>
  )
}
