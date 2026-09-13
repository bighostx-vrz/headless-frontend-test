import V1SectionButton from './V1SectionButton'

type AnyMap=Record<string,any>
const clean=(value:any)=>value==null?'':String(value)
const cyclePrice=(plan:AnyMap,index:number)=>{
  const fields=['price','price2','price3','price4'] as const
  const value=plan?.[fields[Math.max(0,Math.min(3,index))]]
  return value==null?'':clean(value)
}
function ComparisonValue({value}:{value:any}){
  const text=clean(value).trim()
  if(/^(yes|true|included)$/i.test(text))return <span className="bhx-comp-state-v1 is-included" aria-label="Included"><span aria-hidden="true">✓</span></span>
  if(/^(no|false|not included|unavailable)$/i.test(text))return <span className="bhx-comp-state-v1 is-unavailable" aria-label="Not included"><span aria-hidden="true">—</span></span>
  return <span>{text||'—'}</span>
}

export default function PricingComparisonTableV1({plans,rows,activeCycle=0,featureLabel='Features',highlightIndex=0,id,labelledBy}:{plans:AnyMap[];rows:AnyMap[];activeCycle?:number;featureLabel?:string;highlightIndex?:number;id?:string;labelledBy?:string}){
  const highlighted=Math.max(0,Math.min(8,Number(highlightIndex)||0))
  return <div className="bhx-pricing-comparison-scroll-v1" id={id} role={id?'tabpanel':'region'} aria-labelledby={labelledBy} aria-label={id?undefined:'Pricing comparison table'} tabIndex={0}>
    <table className="bhx-pricing-comparison-table-v1">
      <caption className="bhx-comp-sr-only-v1">Compare plan features and pricing</caption>
      <thead><tr>
        <th scope="col" className="bhx-comp-feature-head-v1">{featureLabel}</th>
        {plans.map((plan,index)=>{
          const price=cyclePrice(plan,activeCycle)
          const isHighlighted=highlighted===index+1
          return <th scope="col" className={`bhx-comp-plan-head-v1${isHighlighted?' is-highlighted':''}`} key={plan?._key||`comparison-plan-${index}`}>
            <span className="bhx-comp-plan-name-v1">{clean(plan?.title)||`Plan ${index+1}`}</span>
            {price||plan?.period?<span className="bhx-comp-price-row-v1">{price?<strong className="bhx-comp-price-v1">{price}</strong>:null}{plan?.period?<small className="bhx-comp-period-v1">{clean(plan.period)}</small>:null}</span>:null}
            {plan?.button?<span className="bhx-comp-button-v1"><V1SectionButton content={plan.button} desktop={plan.buttonDesktop} mobile={plan.buttonMobile} kind="primary"/></span>:null}
          </th>
        })}
      </tr></thead>
      <tbody>{rows.map((row,rowIndex)=><tr key={row?._key||`comparison-row-${rowIndex}`}>
        <th scope="row" className="bhx-comp-feature-cell-v1"><span className="bhx-comp-feature-v1">{clean(row?.feature)||`Feature ${rowIndex+1}`}</span>{row?.description?<small className="bhx-comp-description-v1">{clean(row.description)}</small>:null}</th>
        {plans.map((plan,planIndex)=><td className={highlighted===planIndex+1?'is-highlighted':''} key={`${row?._key||rowIndex}-${plan?._key||planIndex}`}><ComparisonValue value={Array.isArray(row?.values)?row.values[planIndex]:undefined}/></td>)}
      </tr>)}</tbody>
    </table>
  </div>
}
