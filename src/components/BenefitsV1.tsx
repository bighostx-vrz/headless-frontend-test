import {SectionActions,SectionHeaderV1} from './WebSectionStaticV1'
import BenefitsCardV1 from './BenefitsCardV1'
import BenefitsRuntimeV1 from './BenefitsRuntimeV1'

const legacy=(data:any)=>Array.isArray(data?.items)?data.items.filter((x:any)=>x?.enabled!==false).map((x:any)=>({_key:x._key,mediaType:x.image?.asset?'image':'icon',icon:x.iconText,image:x.image,title:x.title,text:x.text,url:x.link?.url,linkText:x.link?.label,linkTarget:x.link?.newWindow?'new':'same'})):[]
export default function BenefitsV1({data}:{data:any}){
 const items=(Array.isArray(data?.benefitsItemsV1)&&data.benefitsItemsV1.length?data.benefitsItemsV1:legacy(data)).slice(0,100)
 const showText=data?.benefitsShowTextContentV1===true
 const runtime=data?.benefitsMarqueeEnableV1===true
 return <>{showText&&<SectionHeaderV1 data={data}/>} {runtime?<BenefitsRuntimeV1 items={items} data={data}/>:<div className="bhx-benefits-grid">{items.map((item:any,i:number)=><BenefitsCardV1 key={item?._key||i} item={item} data={data}/>)}</div>} {showText&&<SectionActions data={data}/>}</>
}
