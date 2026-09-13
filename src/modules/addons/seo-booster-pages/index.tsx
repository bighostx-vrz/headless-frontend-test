import Image from 'next/image'
import type {BhxFrontendModule} from '../../types'
const safe=(v:any)=>String(v??'')
const module:BhxFrontendModule={id:'seo-booster-pages',title:'SEO Booster / Search Growth Pages',version:'6.6.23',webSectionTypes:['news_magazine'],renderWebSection:(section:any)=>{
 const posts=Array.isArray(section.newsMagazinePostsV1)?section.newsMagazinePostsV1.filter(Boolean):[]
 return <div className={`bhx-news-magazine bhx-news-${safe(section.newsMagazineLayoutV1||'grid')}`} style={{'--bhx-news-cols':Math.max(1,Math.min(5,Number(section.newsMagazineColumnsV1||3))),'--bhx-news-cols-tablet':section.newsMagazineColumnsTabletV1==null?undefined:Math.max(1,Math.min(5,Number(section.newsMagazineColumnsTabletV1)))} as any}>{posts.map((p:any,i:number)=><article className="bhx-news-card" key={p._id||i}>{section.newsMagazineShowImageV1!==false&&p.imageUrl&&<Image src={p.imageUrl} alt={safe(p.title)} width={960} height={600}/>}<h3>{p.title}</h3>{section.newsMagazineShowExcerptV1!==false&&p.excerpt&&<p>{p.excerpt}</p>}{p.slug?.current&&<a href={`/blog/${encodeURIComponent(p.slug.current)}`}>Read more →</a>}</article>)}</div>
}}
export default module
