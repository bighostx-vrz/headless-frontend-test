import Image from 'next/image'
import {stegaClean} from 'next-sanity'
import {urlFor} from '@/sanity/lib/image'
import {SectionActions,SectionHeaderV1} from './WebSectionStaticV1'

const clean=(value:any)=>stegaClean(value==null?'':String(value)).trim()
const imageUrl=(image:any,w=1400,h=1000)=>image?.asset?urlFor(image).width(w).height(h).url():''

function decodeEmbedEntities(value:string){
  return value
    .replace(/&amp;/gi,'&')
    .replace(/&quot;/gi,'"')
    .replace(/&#39;|&apos;/gi,"'")
    .replace(/&lt;/gi,'<')
    .replace(/&gt;/gi,'>')
}

function extractMapSrc(value:any){
  const raw=decodeEmbedEntities(clean(value))
  if(!raw)return ''
  const iframe=raw.match(/<iframe\b[^>]*\bsrc\s*=\s*(["'])(.*?)\1/i)
  return clean(iframe?.[2]||raw)
}

function safeExternalHref(value:any){
  const raw=extractMapSrc(value)
  if(!raw)return ''
  try{const url=new URL(raw);return url.protocol==='https:'||url.protocol==='http:'?url.toString():''}catch{return ''}
}

function trustedMapEmbedSrc(value:any){
  const raw=extractMapSrc(value)
  if(!raw)return ''
  try{
    const url=new URL(raw)
    if(url.protocol!=='https:')return ''
    const host=url.hostname.toLowerCase()
    const path=url.pathname.toLowerCase()
    const google=/^(?:www\.|maps\.)?google\.(?:com|[a-z]{2,3}|co\.[a-z]{2}|com\.[a-z]{2})$/.test(host)&&path.startsWith('/maps')
    return google?url.toString():''
  }catch{return ''}
}

function contactPhone(value:any){
  const raw=clean(value)
  const dial=raw.replace(/[^+\d]/g,'')
  return {raw,dial:dial.length>=3?dial:''}
}

function contactEmail(value:any){
  const raw=clean(value).replace(/[\r\n]/g,'')
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw)?raw:''
}

export default function ContactV1({data}:{data:any}){
  const layout=String(data.contactLayoutV1||'contact-map')
  const mobileLayout=String(data.contactLayoutMobileV1||'contact-map')
  const phone=contactPhone(data.contactPhoneV1)
  const email=contactEmail(data.contactEmailV1)
  const mapType=String(data.contactMapTypeV1||'url')
  const embedSrc=mapType==='url'?trustedMapEmbedSrc(data.contactMapUrlV1||data.mapUrl):''
  const mapHref=mapType==='url'?safeExternalHref(data.contactMapUrlV1||data.mapUrl):''
  const mapTitle=clean(data.heading?`${data.heading} location map`:'Location map')
  const hasImage=mapType==='image'&&Boolean(data.contactMapImageV1?.asset)

  const info=<div className="bhx-contact-info" aria-label="Contact information">
    <SectionHeaderV1 data={data}/>
    <div className="bhx-contact-details">
      {data.contactAddressV1?<address className="bhx-contact-address">{clean(data.contactAddressV1)}</address>:null}
      {phone.raw?<p className="bhx-contact-phone">{phone.dial?<a href={`tel:${phone.dial}`}>{phone.raw}</a>:phone.raw}</p>:null}
      {data.contactEmailV1?<p className="bhx-contact-email">{email?<a href={`mailto:${email}`}>{email}</a>:clean(data.contactEmailV1)}</p>:null}
      {data.contactHoursV1?<p className="bhx-contact-hours">{clean(data.contactHoursV1)}</p>:null}
    </div>
    <SectionActions data={data}/>
  </div>

  const map=<div className="bhx-contact-map" aria-label={mapTitle}>
    {hasImage?<Image className="bhx-contact-map-image" src={imageUrl(data.contactMapImageV1,1400,1000)} alt={mapTitle} width={1400} height={1000} sizes="(max-width: 767px) 100vw, 50vw"/>:
      embedSrc?<iframe className="bhx-contact-map-frame" src={embedSrc} title={mapTitle} loading="lazy" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen/>:
      mapHref?<a className="bhx-contact-map-link" href={mapHref} target="_blank" rel="noopener noreferrer">Open map <span aria-hidden="true">↗</span></a>:
      <span className="bhx-contact-map-empty">Map not configured</span>}
  </div>

  return <div className={`bhx-contact-v1 bhx-contact-layout-${layout} bhx-contact-mobile-${mobileLayout}`} data-bhx-contact-v1="true">
    {layout==='map-contact'?<>{map}{info}</>:<>{info}{map}</>}
  </div>
}
