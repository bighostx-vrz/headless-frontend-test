import Image from 'next/image'
import type {BhxFrontendModule} from '../../types'
const module:BhxFrontendModule={id:'profile-showcase',title:'Profile Showcase',version:'6.6.23',webSectionTypes:['profile_showcase'],renderWebSection:(section:any)=>{
 const items=Array.isArray(section.profileShowcaseItemsV1)?section.profileShowcaseItemsV1.filter(Boolean):[]
 return <div className={`bhx-profile-showcase bhx-profile-${String(section.profileShowcaseCardStyleV1||'card')}`} style={{'--bhx-profile-cols':Math.max(1,Math.min(6,Number(section.profileShowcaseColumnsV1||4)))} as any}>{items.map((p:any,i:number)=><article className="bhx-profile-card" key={p._id||i}>{p.imageUrl&&<Image src={p.imageUrl} alt={String(p.name||'')} width={640} height={760}/>}<h3>{p.name}</h3>{p.designation&&<p>{p.designation}</p>}{p.department&&<small>{p.department}</small>}{p.bio&&<p>{p.bio}</p>}</article>)}</div>
}}
export default module
