import Image from 'next/image'
import {urlFor} from '@/sanity/lib/image'
import {stegaClean} from 'next-sanity'

export default function Hero({data}: {data: any}) {
  if (!data) return null
  const theme = stegaClean(data.theme || 'dark')
  const alignment = stegaClean(data.alignment || 'left')
  const height = stegaClean(data.height || 'standard')

  return (
    <section className={`hero theme-${theme} hero-${height}`} style={{textAlign: alignment}}>
      <div className={data.media?.asset ? 'hero-grid' : 'hero-single'}>
        <div>
          {data.eyebrow && <div className="eyebrow">{data.eyebrow}</div>}
          <h1>{data.heading}</h1>
          {data.tagline && <p className="hero-copy">{data.tagline}</p>}
          <div className="button-row">
            {data.buttonText && data.buttonUrl && <a className="button" href={stegaClean(data.buttonUrl) || '#'}>{data.buttonText}</a>}
            {data.secondaryButtonText && data.secondaryButtonUrl && <a className="button button-secondary" href={stegaClean(data.secondaryButtonUrl) || '#'}>{data.secondaryButtonText}</a>}
          </div>
        </div>
        {data.media?.asset && (
          <Image className="hero-image" src={urlFor(data.media).width(1200).height(800).url()} alt={data.heading || ''} width={760} height={500} />
        )}
      </div>
    </section>
  )
}
