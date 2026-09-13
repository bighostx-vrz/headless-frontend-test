import Image from 'next/image'
import {PortableText} from '@portabletext/react'
import {stegaClean} from 'next-sanity'
import {urlFor} from '@/sanity/lib/image'
import {designClass, designStyle} from './sectionDesign'
import HeroSlideshow from './HeroSlideshow'

function LinkButton({item}: {item: any}) {
  if (!item?.label || !item?.url) return null
  return <a className={`button button-${stegaClean(item.style || 'primary')}`} href={stegaClean(item.url)} target={item.newWindow ? '_blank' : undefined} rel={`${item.newWindow ? 'noopener noreferrer ' : ''}${item.nofollow ? 'nofollow' : ''}`.trim() || undefined}>{item.label}</a>
}
function Card({item}: {item: any}) {
  const inner = <><>{item.image?.asset && <Image src={urlFor(item.image).width(900).height(560).url()} alt={item.title || ''} width={900} height={560} />}</><div className="card-body">{item.eyebrow && <span className="eyebrow">{item.eyebrow}</span>}{item.value && <strong className="card-value">{item.value}</strong>}{item.title && <h3>{item.title}</h3>}{item.text && <p>{item.text}</p>}{item.link?.label && <span className="text-link">{item.link.label} →</span>}</div></>
  return item.link?.url ? <a className="content-card" href={stegaClean(item.link.url)} target={item.link.newWindow ? '_blank' : undefined}>{inner}</a> : <div className="content-card">{inner}</div>
}
function RefCard({item}: {item: any}) {
  const pathMap: Record<string,string> = {service:'/services/',industry:'/industries/',caseStudy:'/cases/',newsItem:'/news/',insight:'/insights/',brochure:'/brochures#',region:'/',person:'/'}
  const url = item._type === 'brochure' ? (item.fileUrl || item.externalUrl || '#') : `${pathMap[item._type] || '/'}${stegaClean(item.slug?.current || '')}`
  return <a className="content-card ref-card" href={url}><>{item.image?.asset && <Image src={urlFor(item.image).width(900).height(560).url()} alt={item.title || ''} width={900} height={560} />}</><div className="card-body"><span className="eyebrow">{item.newsType || item.brochureType || item.industry?.title || item.region?.title || item._type}</span><h3>{item.title}</h3>{item.outcome && <strong>{item.outcome}</strong>}{item.excerpt && <p>{item.excerpt}</p>}<span className="text-link">Explore →</span></div></a>
}

export default function InspiraSection({data}: {data: any}) {
  if (!data) return null
  const type = stegaClean(data.sectionType || 'content')
  const design = data.design || {}
  const classes = `inspira-section section-${type} display-${stegaClean(data.displayMode || 'grid')} ${designClass(design)} ${stegaClean(data.customClass || '')}`
  const style = designStyle(design)
  const cards = data.cards || []
  const refs = data.contentRefs || []
  const allCards = [...cards.map((x:any)=>({...x,_manual:true})), ...refs]

  const header = <div className="section-heading">{data.eyebrow && <span className="eyebrow">{data.eyebrow}</span>}{data.heading && <h2>{data.heading}</h2>}{data.description && <p className="lead">{data.description}</p>}</div>
  const buttons = data.buttons?.length ? <div className="button-row">{data.buttons.map((b:any,i:number)=><LinkButton key={`${b.label}-${i}`} item={b}/>)}</div> : null

  let body: React.ReactNode
  if (type === 'hero') { const slides = (data.mediaGallery || []).filter((x:any)=>x?.asset).map((x:any)=>urlFor(x).width(1400).height(900).url()); if(data.media?.asset) slides.unshift(urlFor(data.media).width(1400).height(900).url()); body = <div className="hero-grid"><div>{data.eyebrow && <span className="eyebrow">{data.eyebrow}</span>}{data.heading && <h1>{data.heading}</h1>}{data.description && <p className="lead">{data.description}</p>}{buttons}</div>{data.heroMediaMode==='slideshow'&&slides.length>1?<HeroSlideshow images={slides} alt={data.heading||''}/>:slides[0]?<Image className="hero-media" src={slides[0]} alt={data.heading || ''} width={1400} height={900} priority />:null}</div> }
  else if (type === 'stats') body = <><>{header}</><div className="stats-grid">{data.stats?.map((s:any,i:number)=><div className="stat" key={i}><strong>{s.value}</strong><span>{s.label}</span>{s.note && <small>{s.note}</small>}</div>)}</div></>
  else if (type === 'testimonial') body = cards.length ? <><>{header}</><div className="section-grid testimonial-grid">{cards.map((item:any,i:number)=><div className="content-card testimonial-card" key={i}><div className="card-body"><div className="quote-mark">“</div><blockquote>{item.text}</blockquote><p><strong>{item.title}</strong>{item.eyebrow&&<> · {item.eyebrow}</>}</p></div></div>)}</div>{buttons}</> : <div className="testimonial"><div className="quote-mark">“</div><blockquote>{data.quote || data.description}</blockquote><p><strong>{data.personName}</strong>{data.personRole && <> · {data.personRole}</>}{data.personCompany && <> · {data.personCompany}</>}</p>{buttons}</div>
  else if (type === 'proofMetric') body = <div className="proof-grid"><div className="mega-metric">{data.metricPrefix}{data.metricValue}{data.metricSuffix}</div><div>{header}{data.metricText && <p>{data.metricText}</p>}{buttons}</div></div>
  else if (type === 'mediaFeature') body = <><>{header}</><div className="media-feature">{data.videoUrl ? <a className="video-placeholder" href={stegaClean(data.videoUrl)} target="_blank" rel="noopener noreferrer">Open video ↗</a> : data.media?.asset ? <Image src={urlFor(data.media).width(1600).height(900).url()} alt={data.heading || ''} width={1600} height={900}/> : null}</div>{buttons}</>
  else if (type === 'comparison') body = <><>{header}</><div className="comparison-grid">{allCards.map((item:any,i:number)=>item._manual?<Card key={i} item={item}/>:<RefCard key={i} item={item}/>)}</div>{buttons}</>
  else if (type === 'industries') body = <><>{header}</><div className="accordion-list">{allCards.map((item:any,i:number)=><details key={i}><summary>{item.title || item.eyebrow}</summary><p>{item.text || item.excerpt}</p>{item.link?.url && <LinkButton item={item.link}/>}</details>)}</div>{buttons}</>
  else if (['featuredNews','pillars','capabilities','fusionCenters','caseStudies','recognition','resources','process','brochures','collection'].includes(type)) body = <><>{header}</><div className="section-grid">{allCards.map((item:any,i:number)=>item._manual?<Card key={i} item={item}/>:<RefCard key={i} item={item}/>)}</div>{buttons}</>
  else if (type === 'expertConnect') body = <div className="expert-grid">{data.media?.asset && <Image src={urlFor(data.media).width(700).height(700).url()} alt={data.personName || ''} width={700} height={700}/>}<div>{header}<p><strong>{data.personName}</strong>{data.personRole && <> · {data.personRole}</>}</p>{buttons}</div></div>
  else if (type === 'cta') body = <div className="cta-inner">{header}{buttons}</div>
  else body = <div className="content-layout">{data.media?.asset && <Image src={urlFor(data.media).width(1000).height(700).url()} alt={data.heading || ''} width={1000} height={700}/>}<div>{header}{Array.isArray(data.richText) && <div className="rich-text"><PortableText value={data.richText}/></div>}{buttons}</div></div>

  return <section className={classes} style={style}>{data.customCss && <style dangerouslySetInnerHTML={{__html: stegaClean(data.customCss)}}/>}<div className="section-inner">{body}</div></section>
}
