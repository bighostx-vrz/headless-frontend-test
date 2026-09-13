import Image from 'next/image'
import {PortableText} from '@portabletext/react'
import {stegaClean} from 'next-sanity'
import {urlFor} from '@/sanity/lib/image'
import TestimonialsRuntimeV1 from './TestimonialsRuntimeV1'
import {testimonialsV1Css} from './testimonialsV1Css'

type AnyMap=Record<string,any>
const clean=(value:any)=>stegaClean(value==null?'':String(value))
const imageUrl=(image:any,size=360)=>image?.asset?urlFor(image).width(size).height(size).fit('crop').auto('format').url():''
const clampRating=(value:any)=>Math.max(0,Math.min(5,Number.isFinite(Number(value))?Number(value):0))

function Header({data}:{data:AnyMap}){return <div className="bhx-v1-section-header">{data.eyebrow?<span className="eyebrow">{data.eyebrow}</span>:null}{data.heading?<h2>{data.heading}</h2>:null}{data.paragraph?<p className="lead">{data.paragraph}</p>:null}{Array.isArray(data.richText)&&data.richText.length?<div className="rich-text"><PortableText value={data.richText}/></div>:null}</div>}
function Card({item,index,data}:{item:AnyMap;index:number;data:AnyMap}){const name=clean(item.name);const rating=clampRating(item.rating);const rounded=Math.round(rating);const image=data.testimonialsAvatarEnabledV1!==false?imageUrl(item.image):'';return <blockquote className="bhx-testimonials-card-v1" aria-label={name?`Testimonial from ${name}`:`Testimonial ${index+1}`}>{image?<Image className="bhx-testimonials-avatar-v1" src={image} alt={name?`Portrait of ${name}`:'Testimonial author'} width={360} height={360} sizes="(max-width: 767px) 72px, 90px" loading="lazy"/>:null}{item.quote?<p className="bhx-testimonials-quote-v1">“{item.quote}”</p>:null}{rating>0?<div className="bhx-testimonials-rating-v1" aria-label={`${rating} out of 5 stars`}>{Array.from({length:5},(_,star)=><span key={star} aria-hidden="true">{star<rounded?'★':'☆'}</span>)}</div>:null}{(name||item.role)?<footer className="bhx-testimonials-author-v1">{name?<strong>{name}</strong>:null}{item.role?<span>{item.role}</span>:null}</footer>:null}</blockquote>}
function legacyItems(data:AnyMap){return Array.isArray(data.items)?data.items.filter((item:any)=>item?.enabled!==false).map((item:any,index:number)=>({_key:item._key||`legacy-testimonial-${index}`,quote:item.quote||item.text,name:item.name||item.title,role:item.role,image:item.image,rating:item.rating})):[]}

export default function TestimonialsV1({data,ownerId}:{data:AnyMap;ownerId:string}){
  const source=Array.isArray(data.testimonialsItemsV1)&&data.testimonialsItemsV1.length?data.testimonialsItemsV1:legacyItems(data)
  const items=source.filter(Boolean).slice(0,50),layout=clean(data.testimonialsLayoutV1||'grid')==='slider'?'slider':'grid'
  return <div className={`bhx-testimonials-v1 is-${layout}`} data-bhx-testimonials-v1 data-layout={layout}><style dangerouslySetInnerHTML={{__html:testimonialsV1Css(ownerId,data)}}/><Header data={data}/>{!items.length?<div className="bhx-testimonials-empty-v1">No testimonials added yet.</div>:layout==='slider'&&items.length>1?<TestimonialsRuntimeV1 autoplay={data.testimonialsAutoplay===true} seconds={Number(data.testimonialsAutoplaySeconds||5)} showArrows={data.testimonialsShowArrows!==false} showDots={data.testimonialsShowDots!==false} enableDrag={data.testimonialsEnableDrag!==false} pauseOnHover={data.testimonialsPauseOnHover!==false} label={clean(data.heading||'Testimonials')}>{items.map((item:any,index:number)=><Card key={item._key||index} item={item} index={index} data={data}/>)}</TestimonialsRuntimeV1>:<div className="bhx-testimonials-grid-v1">{items.map((item:any,index:number)=><Card key={item._key||index} item={item} index={index} data={data}/>)}</div>}</div>
}
