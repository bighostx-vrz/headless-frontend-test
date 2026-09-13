import {PortableText} from '@portabletext/react'
import {stegaClean} from 'next-sanity'
import PricingComparisonRuntimeV1 from './PricingComparisonRuntimeV1'
import PricingComparisonTableV1 from './PricingComparisonTableV1'
import {pricingComparisonV1Css} from './pricingComparisonV1Css'

type AnyMap=Record<string,any>
const clean=(value:any)=>stegaClean(value==null?'':String(value))
const fallback=(value:any,defaultValue:string)=>value==null?defaultValue:String(value)
function legacyItems(data:AnyMap){return Array.isArray(data.items)?data.items.map((x:any,index:number)=>({_key:x?._key||`legacy-comp-row-${index}`,feature:x?.title||x?.eyebrow||`Feature ${index+1}`,description:x?.text,values:Array.isArray(x?.features)?x.features:[]})):[]}
function Header({data}:{data:AnyMap}){const eyebrow=fallback(data.eyebrow,'Compare'),heading=fallback(data.heading,'Compare Our Plans'),paragraph=fallback(data.paragraph,'Find the perfect fit for your business needs.');return <div className="bhx-comp-header-v1">{eyebrow?<span className="eyebrow">{eyebrow}</span>:null}{heading?<h2>{heading}</h2>:null}{paragraph?<p className="lead">{paragraph}</p>:null}{Array.isArray(data.richText)&&data.richText.length?<div className="rich-text"><PortableText value={data.richText}/></div>:null}</div>}

export default function PricingComparisonV1({data,ownerId}:{data:AnyMap;ownerId:string}){
  const definitions=Array.isArray(data.pricingComparisonPlanDefinitionsV1)?data.pricingComparisonPlanDefinitionsV1.filter(Boolean).slice(0,8):[]
  const legacyNames=Array.isArray(data.pricingComparisonPlansV1)?data.pricingComparisonPlansV1.filter(Boolean).slice(0,8):[]
  const plans=definitions.length?definitions:legacyNames.map((title:any,index:number)=>({_key:`legacy-comp-plan-${index}`,title:clean(title)}))
  const sourceRows=Array.isArray(data.pricingComparisonRowsV1)&&data.pricingComparisonRowsV1.length?data.pricingComparisonRowsV1:legacyItems(data)
  const rows=sourceRows.filter(Boolean).slice(0,100).map((row:any)=>({...row,values:Array.isArray(row?.values)?row.values.slice(0,8):[]}))
  const cycles=Math.max(1,Math.min(4,Number.isFinite(Number(data.pricingComparisonBillingCyclesV1))?Number(data.pricingComparisonBillingCyclesV1):1))
  const labels=[fallback(data.pricingComparisonCycleLabel1V1,'Monthly'),fallback(data.pricingComparisonCycleLabel2V1,'Quarterly'),fallback(data.pricingComparisonCycleLabel3V1,'Half-Yearly'),fallback(data.pricingComparisonCycleLabel4V1,'Annually')].slice(0,cycles)
  const featureLabel=fallback(data.pricingComparisonFeatureColumnLabelV1,'Features')
  const sectionLabel=clean(data.heading||'Pricing comparison')||'Pricing comparison'
  const highlightIndex=Math.max(0,Math.min(8,Number(data.pricingComparisonHighlightV1)||0))
  return <div className={`bhx-pricing-comparison-v1${data.pricingComparisonStickyHeaderV1===true?' has-sticky-head':''}`} data-bhx-pricing-comparison-v1 data-cycles={cycles}>
    <style dangerouslySetInnerHTML={{__html:pricingComparisonV1Css(ownerId,data,plans.length)}}/>
    <Header data={data}/>
    {!plans.length?<div className="bhx-comp-empty-v1">Add at least one plan definition or legacy plan name.</div>:!rows.length?<div className="bhx-comp-empty-v1">Add comparison features to build the matrix.</div>:cycles>1?<PricingComparisonRuntimeV1 plans={plans} rows={rows} labels={labels} sectionLabel={sectionLabel} featureLabel={featureLabel} highlightIndex={highlightIndex} ownerId={ownerId}/>:<PricingComparisonTableV1 plans={plans} rows={rows} activeCycle={0} featureLabel={featureLabel} highlightIndex={highlightIndex}/>} 
  </div>
}
