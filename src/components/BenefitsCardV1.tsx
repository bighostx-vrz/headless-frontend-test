import Image from 'next/image'
import {urlFor} from '@/sanity/lib/image'
import V1Icon from './V1Icon'

const clean=(v:any)=>String(v??'').trim()
const safeHref=(v:any)=>{const raw=clean(v);if(!raw)return '';if(raw.startsWith('#')||raw.startsWith('/')||/^(https?:|mailto:|tel:)/i.test(raw))return raw;return ''}

export default function BenefitsCardV1({item,data}:{item:any;data:any}){
 const href=safeHref(item?.url), blank=String(item?.linkTarget||'new')==='new'
 const media=item?.mediaType==='image'&&item?.image?.asset
  ?<Image className="bhx-benefit-image" src={urlFor(item.image).width(320).height(320).url()} alt={clean(item.title)} width={160} height={160}/>
  :<span className="bhx-benefit-icon"><V1Icon name={item?.icon||'outline-check-circle'} size={Math.max(16,Number(data?.benefitsIconSizeDesktopV1||50))}/></span>
 const body=<><div className="bhx-benefit-media" aria-hidden={item?.mediaType==='image'?undefined:true}>{media}</div><div className="bhx-benefit-copy">{item?.title&&<h3>{item.title}</h3>}{item?.text&&<p>{item.text}</p>}{item?.linkText&&href&&<span className="bhx-benefit-link">{item.linkText} →</span>}</div></>
 return href?<a className="bhx-benefit-card" href={href} target={blank?'_blank':undefined} rel={blank?'noopener noreferrer':undefined}>{body}</a>:<article className="bhx-benefit-card">{body}</article>
}
