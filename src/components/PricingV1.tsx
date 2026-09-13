import {PortableText} from '@portabletext/react'
import {stegaClean} from 'next-sanity'
import PricingCardsV1 from './PricingCardsV1'
import PricingRuntimeV1 from './PricingRuntimeV1'
import {pricingV1Css} from './pricingV1Css'

type AnyMap=Record<string,any>
const clean=(value:any)=>stegaClean(value==null?'':String(value))
const fallback=(value:any,defaultValue:string)=>value==null?defaultValue:String(value)
function legacyItems(data:AnyMap){return Array.isArray(data.items)?data.items.filter((item:any)=>item?.enabled!==false).map((item:any,index:number)=>({_key:item._key||`legacy-pricing-${index}`,title:item.title,description:item.text,price:item.value,period:item.secondaryValue,features:item.features,featured:false,button:item.link?{contentMode:'text',text:item.link.label,linkType:'custom',link:item.link.url,target:item.link.newWindow?'blank':'self'}:undefined})):[]}
function Header({data}:{data:AnyMap}){const eyebrow=fallback(data.eyebrow,'Pricing'),heading=fallback(data.heading,'Simple, transparent pricing'),paragraph=fallback(data.paragraph,'No hidden fees. Cancel anytime.');return <div className="bhx-pricing-header-v1">{eyebrow?<span className="eyebrow">{eyebrow}</span>:null}{heading?<h2>{heading}</h2>:null}{paragraph?<p className="lead">{paragraph}</p>:null}{Array.isArray(data.richText)&&data.richText.length?<div className="rich-text"><PortableText value={data.richText}/></div>:null}{data.readMoreLabel&&data.readMoreUrl?<p><a className="text-link" href={clean(data.readMoreUrl)}>{data.readMoreLabel} →</a></p>:null}</div>}

export default function PricingV1({data,ownerId}:{data:AnyMap;ownerId:string}){
  const source=Array.isArray(data.pricingPlansV1)&&data.pricingPlansV1.length?data.pricingPlansV1:legacyItems(data)
  const plans=source.filter(Boolean).slice(0,24)
  const cycles=Math.max(1,Math.min(4,Number.isFinite(Number(data.pricingBillingCyclesV1))?Number(data.pricingBillingCyclesV1):1))
  const labels=[
    fallback(data.pricingCycleLabel1V1,'Monthly'),
    fallback(data.pricingCycleLabel2V1,'Quarterly'),
    fallback(data.pricingCycleLabel3V1,'Half-Yearly'),
    fallback(data.pricingCycleLabel4V1,'Annually'),
  ].slice(0,cycles)
  const sectionLabel=clean(data.heading||'Pricing')||'Pricing'
  return <div className="bhx-pricing-v1" data-bhx-pricing-v1 data-cycles={cycles} data-layout-desktop={clean(data.pricingLayoutDesktopV1||'floating_cards')} data-layout-mobile={clean(data.pricingLayoutMobileV1||'scroll')}>
    <style dangerouslySetInnerHTML={{__html:pricingV1Css(ownerId,data)}}/>
    <Header data={data}/>
    {!plans.length?<div className="bhx-pricing-empty-v1">No pricing plans added yet.</div>:cycles>1?<PricingRuntimeV1 plans={plans} labels={labels} sectionLabel={sectionLabel} ownerId={ownerId}/>:<PricingCardsV1 plans={plans} activeCycle={0}/>} 
  </div>
}
