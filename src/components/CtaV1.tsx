import {SectionActions,SectionHeaderV1} from './WebSectionStaticV1'

const cleanToken=(value:any)=>String(value??'').trim().toLowerCase()
const clamp=(value:any,fallback:number,min:number,max:number)=>Math.max(min,Math.min(max,Number.isFinite(Number(value))?Number(value):fallback))

export default function CtaV1({data,ownerId}:{data:any;ownerId:string}){
  const layout=cleanToken(data?.ctaLayoutV1)==='split'?'split':'center'
  const legacyActions=Array.isArray(data?.buttons)&&data.buttons.some((item:any)=>item?.label&&item?.url)
  const hasActions=data?.sectionButtonsEnabledV1===true||legacyActions
  const maxWidth=clamp(data?.ctaMaxWidthV1,900,320,1600)
  return <div className={`bhx-cta-v1 bhx-v1-cta bhx-cta-${layout}${hasActions?'':' bhx-cta-no-actions'}`} data-bhx-cta-v1="true" data-bhx-cta-layout={layout} style={{'--bhx-cta-max-width':`${maxWidth}px`} as any}>
    <div className="bhx-cta-copy"><SectionHeaderV1 data={data}/></div>
    {hasActions?<div className="bhx-cta-actions"><SectionActions data={data}/></div>:null}
    <span className="bhx-cta-owner" aria-hidden="true">{ownerId}</span>
  </div>
}
