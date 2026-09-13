import FaqRuntimeV1 from './FaqRuntimeV1'
import {SectionActions,SectionHeaderV1} from './WebSectionStaticV1'

const clean=(value:any)=>String(value??'').trim()

function legacyItems(data:any){
  return Array.isArray(data?.items)?data.items.filter((item:any)=>item?.enabled!==false).map((item:any,index:number)=>({_key:item?._key||`legacy-faq-${index}`,question:item?.title||item?.eyebrow||'',answer:item?.text||item?.excerpt||'',openByDefault:false})):[]
}

export default function FaqV1({data,ownerId}:{data:any;ownerId:string}){
  const direct=Array.isArray(data?.faqItemsV1)?data.faqItemsV1.filter(Boolean):[]
  const items=(direct.length?direct:legacyItems(data)).slice(0,100)
  const layout=clean(data?.faqLayoutStyleV1)==='side_content'?'side_content':'faq_only'
  const hasActions=data?.sectionButtonsEnabledV1===true||(Array.isArray(data?.buttons)&&data.buttons.some((item:any)=>item?.label&&item?.url))
  const intro=<div className="bhx-faq-intro"><SectionHeaderV1 data={data}/>{hasActions?<SectionActions data={data}/>:null}</div>
  const list=<FaqRuntimeV1 items={items} allowMultiple={data?.faqAllowMultipleV1===true} iconStyle={clean(data?.faqIconStyleV1||'plus')} scope={ownerId}/>
  return <div className={`bhx-faq-section-v1 bhx-faq-layout-${layout}`} data-bhx-faq-v1="true" data-bhx-faq-layout={layout}>
    {layout==='side_content'?<>{intro}<div className="bhx-faq-list-column">{list}</div></>:<>{intro}{list}</>}
  </div>
}
