import Image from 'next/image'
import {urlFor} from '@/sanity/lib/image'
import {SectionActions,SectionHeaderV1} from './WebSectionStaticV1'

const clean=(value:any)=>String(value??'').trim()
const position=(value:any)=>{const v=clean(value).toLowerCase();return ['left','right','top','bottom','background'].includes(v)?v:'right'}
const clamp=(value:any,fallback:number,min:number,max:number)=>Math.max(min,Math.min(max,Number.isFinite(Number(value))?Number(value):fallback))
const imageUrl=(image:any,width=1400,height=1200)=>urlFor(image).width(width).height(height).fit('max').auto('format').url()

export default function ImageAccentCtaV1({data,ownerId}:{data:any;ownerId:string}){
  const image=data?.imageAccentImageV1||data?.media
  const placement=position(data?.imageAccentPositionV1)
  const width=clamp(data?.imageAccentWidthV1,42,10,90)
  const hasImage=Boolean(image?.asset)
  return <div className={`bhx-image-accent-cta-v1 bhx-image-accent-${placement}${hasImage?'':' bhx-image-accent-no-image'}`} data-bhx-image-accent-cta-v1="true" data-bhx-image-accent-position={placement} style={{'--bhx-accent-image-width':`${width}%`} as any}>
    <div className="bhx-image-accent-content"><SectionHeaderV1 data={data}/><SectionActions data={data}/></div>
    {hasImage?<div className="bhx-image-accent-media" aria-hidden={placement==='background'?true:undefined}><Image src={imageUrl(image)} alt={placement==='background'?'':clean(data?.heading||data?.title||'Accent image')} width={1400} height={1200} sizes={placement==='left'||placement==='right'?`(max-width: 767px) 100vw, ${width}vw`:'(max-width: 767px) 100vw, 70vw'} priority={false}/></div>:null}
    <span className="bhx-image-accent-owner" aria-hidden="true">{ownerId}</span>
  </div>
}
