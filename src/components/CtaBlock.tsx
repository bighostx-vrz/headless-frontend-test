import {stegaClean} from 'next-sanity'

export default function CtaBlock({data}: {data: any}) {
  if (!data) return null
  return (
    <section className={`cta theme-${stegaClean(data.theme || 'brand')}`} style={{textAlign: stegaClean(data.alignment || 'center')}}>
      <div className="width-contained">
        {data.heading && <h2>{data.heading}</h2>}
        {data.text && <p>{data.text}</p>}
        {data.buttonText && data.buttonUrl && <a className="button" href={stegaClean(data.buttonUrl) || '#'}>{data.buttonText}</a>}
      </div>
    </section>
  )
}
