import type {CSSProperties} from 'react'
import Image from 'next/image'
import {PortableText} from '@portabletext/react'
import {urlFor} from '@/sanity/lib/image'
import {stegaClean} from 'next-sanity'

function colorValue(value: any) {
  return value?.hex || undefined
}

export default function SectionBlock({data}: {data: any}) {
  if (!data) return null
  const theme = stegaClean(data.theme || 'light')
  const width = stegaClean(data.width || 'contained')
  const layout = stegaClean(data.layout || 'text')
  const spacing = stegaClean(data.spacing || 'global')

  const legacyBgType = stegaClean(data.bgType || '')
  const customStyle: CSSProperties = {
    ...(theme === 'custom' ? {
      backgroundColor: colorValue(data.backgroundColor) || colorValue(data.bgColor),
      color: colorValue(data.textColor),
    } : {}),
  }

  if (!customStyle.backgroundColor && legacyBgType === 'solid' && data.bgColor?.hex) customStyle.backgroundColor = data.bgColor.hex
  if (legacyBgType === 'gradient' && data.bgGradient) customStyle.background = stegaClean(data.bgGradient)

  const backgroundImage = data.backgroundImage?.asset ? data.backgroundImage : data.bgImage?.asset ? data.bgImage : null
  if (backgroundImage) {
    const opacity = Number(data.overlayOpacity || 0)
    const overlayHex = colorValue(data.overlayColor) || '#000000'
    // Keep the original overlay control concept while using a safe CSS color-mix fallback.
    customStyle.backgroundImage = `linear-gradient(color-mix(in srgb, ${overlayHex} ${Math.round(opacity * 100)}%, transparent), color-mix(in srgb, ${overlayHex} ${Math.round(opacity * 100)}%, transparent)), url(${urlFor(backgroundImage).width(1800).url()})`
    customStyle.backgroundSize = 'cover'
    customStyle.backgroundPosition = 'center'
  }

  return (
    <section className={`content-section theme-${theme} spacing-${spacing}`} style={customStyle}>
      <div className={`section-inner width-${width} layout-${layout}`} style={{textAlign: stegaClean(data.textAlign || 'left')}}>
        <div className="section-copy">
          {data.eyebrow && <div className="eyebrow">{data.eyebrow}</div>}
          {data.heading && <h2>{data.heading}</h2>}
          {Array.isArray(data.body) && <div className="rich-text"><PortableText value={data.body} /></div>}
          {!data.body && data.textContent && <p>{data.textContent}</p>}
          {data.buttonText && data.buttonUrl && <a className="button" href={stegaClean(data.buttonUrl) || '#'}>{data.buttonText}</a>}
        </div>
        {data.image?.asset && (
          <Image className="section-image" src={urlFor(data.image).width(1000).height(700).url()} alt={data.heading || ''} width={700} height={490} />
        )}
      </div>
    </section>
  )
}
