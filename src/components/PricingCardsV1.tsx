import V1SectionButton from './V1SectionButton'

type AnyMap=Record<string,any>
const clean=(value:any)=>value==null?'':String(value)
const cyclePrice=(plan:AnyMap,index:number)=>{
  const fields=['price','price2','price3','price4'] as const
  const value=plan?.[fields[Math.max(0,Math.min(3,index))]]
  return value==null||String(value)===''?(index===0?clean(plan?.price):''):clean(value)
}

export default function PricingCardsV1({plans,activeCycle=0,id,labelledBy}:{plans:AnyMap[];activeCycle?:number;id?:string;labelledBy?:string}){
  return <div className="bhx-pricing-cards-v1" id={id} role={id?'tabpanel':undefined} aria-labelledby={labelledBy}>
    {plans.map((plan,index)=>{
      const featured=plan?.featured===true
      const badge=clean(plan?.badge)||(featured?'POPULAR':'')
      const price=cyclePrice(plan,activeCycle)
      const features=Array.isArray(plan?.features)?plan.features.filter((x:any)=>x!=null&&String(x).trim()).slice(0,50):[]
      return <article className={`bhx-pricing-card-v1${featured?' is-featured':''}`} key={plan?._key||`pricing-plan-${index}`}>
        {badge?<span className="bhx-pricing-badge-v1">{badge}</span>:null}
        {plan?.title?<h3 className="bhx-pricing-name-v1">{plan.title}</h3>:null}
        {plan?.description?<p className="bhx-pricing-description-v1">{plan.description}</p>:null}
        <div className="bhx-pricing-price-row-v1">
          {price?<strong className="bhx-pricing-price-v1">{price}</strong>:null}
          {plan?.period?<span className="bhx-pricing-suffix-v1">{plan.period}</span>:null}
        </div>
        {features.length?<ul className="bhx-pricing-features-v1">{features.map((feature:any,featureIndex:number)=><li key={`${plan?._key||index}-feature-${featureIndex}`}><span aria-hidden="true" className="bhx-pricing-feature-check-v1">✓</span><span>{clean(feature)}</span></li>)}</ul>:null}
        {plan?.button?<div className="bhx-pricing-button-wrap-v1"><V1SectionButton content={plan.button} desktop={plan.buttonDesktop} mobile={plan.buttonMobile} kind="primary"/></div>:null}
      </article>
    })}
  </div>
}
