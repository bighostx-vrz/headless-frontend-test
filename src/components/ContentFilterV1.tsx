import Image from 'next/image'
import {urlFor} from '@/sanity/lib/image'
import {SectionHeaderV1} from './WebSectionStaticV1'
import ContentFilterClientV1,{type ContentFilterClientItem} from './ContentFilterClientV1'

const clean=(value:any)=>String(value??'').trim()
const safeHref=(value:any)=>{const raw=clean(value);if(!raw)return '';if(raw.startsWith('#')||raw.startsWith('/')||/^(https?:|mailto:|tel:)/i.test(raw))return raw;return ''}
const imageUrl=(image:any,w=1000,h=700)=>image?.asset?urlFor(image).width(w).height(h).fit('max').url():''
const align=(value:any)=>['start','center','end','stretch'].includes(clean(value))?clean(value):'start'
function normalise(data:any):ContentFilterClientItem[]{
  const source=clean(data?.contentFilterSourceV1||'manual')
  const selectedCats=new Set((Array.isArray(data?.contentFilterCategoriesV1)?data.contentFilterCategoriesV1:[]).map((c:any)=>clean(c?.slug?.current||c?.title)).filter(Boolean))
  const manual=(Array.isArray(data?.contentFilterItemsV1)?data.contentFilterItemsV1:[]).slice(0,120).map((item:any,index:number)=>({key:clean(item?._key||`manual-${index}`),category:clean(item?.category||'Other'),title:clean(item?.title),text:clean(item?.text),image:imageUrl(item?.image),url:safeHref(item?.url),linkText:clean(item?.linkText||'Read more'),linkTarget:item?.linkTarget==='new'?'new':'same'}))
  const posts=(Array.isArray(data?.contentFilterPostsV1)?data.contentFilterPostsV1:[]).slice(0,120).filter((post:any)=>{if(!selectedCats.size)return true;const slug=clean(post?.category?.slug?.current),title=clean(post?.category?.title);return selectedCats.has(slug)||selectedCats.has(title)}).map((post:any,index:number)=>({key:clean(post?._id||`post-${index}`),category:clean(post?.category?.title||'Posts'),title:clean(post?.title),text:clean(post?.excerpt),image:imageUrl(post?.image||post?.mainImage),url:post?.slug?.current?`/blog/${post.slug.current}`:'',linkText:'Read more',linkTarget:'same' as const}))
  const legacy=(Array.isArray(data?.items)?data.items:[]).slice(0,120).map((item:any,index:number)=>({key:clean(item?._key||`legacy-${index}`),category:clean(item?.eyebrow||'Items'),title:clean(item?.title),text:clean(item?.text),image:imageUrl(item?.image),url:safeHref(item?.link?.url),linkText:clean(item?.link?.label||'Read more'),linkTarget:item?.link?.newWindow?'new' as const:'same' as const}))
  return (source==='posts'?posts:(manual.length?manual:legacy)).filter(item=>item.title||item.text||item.image)
}
function Card({item}:{item:ContentFilterClientItem}){return <article className="bhx-content-filter-card-v1">{item.image?<Image src={item.image} alt={item.title} width={1000} height={700} sizes="(max-width: 767px) 100vw, (max-width: 900px) 50vw, 33vw"/>:null}<div className="bhx-content-filter-card-copy-v1">{item.category?<span className="bhx-content-filter-category-v1">{item.category}</span>:null}{item.title?<h3>{item.title}</h3>:null}{item.text?<p>{item.text}</p>:null}{item.url?<a href={item.url} target={item.linkTarget==='new'?'_blank':undefined} rel={item.linkTarget==='new'?'noopener noreferrer':undefined}>{item.linkText||'Read more'} <span aria-hidden="true">→</span></a>:null}</div></article>}
export default function ContentFilterV1({data}:{data:any}){
  const items=normalise(data),allLabel=clean(data?.contentFilterAllLabelV1||'All')||'All'
  const categories=[allLabel,...Array.from(new Set(items.map(item=>item.category).filter(Boolean).filter(value=>value!==allLabel)))]
  const layout=clean(data?.contentFilterLayoutV1||'masonry')==='grid'?'grid':'masonry'
  const classes=['bhx-content-filter-list-v1',`is-${layout}`,`bhx-content-filter-align-desktop-${align(data?.contentFilterLastRowAlignDesktopV1)}`,`bhx-content-filter-align-tablet-${align(data?.contentFilterLastRowAlignTabletV1)}`,`bhx-content-filter-align-mobile-${align(data?.contentFilterLastRowAlignMobileV1)}`].join(' ')
  const style:any={'--bhx-filter-cols-desktop':Math.max(1,Math.min(6,Number(data?.contentFilterColumnsV1||3))),'--bhx-filter-cols-tablet':Math.max(1,Math.min(4,Number(data?.contentFilterColumnsTabletV1||2))),'--bhx-filter-cols-mobile':Math.max(1,Math.min(2,Number(data?.contentFilterColumnsMobileV1||1)))}
  const interactive=data?.contentFilterSearchV1===true||categories.length>1
  return <div className="bhx-content-filter-section-v1" data-bhx-content-filter-v1="true"><SectionHeaderV1 data={data}/>{items.length?(interactive?<ContentFilterClientV1 items={items} categories={categories} allLabel={allLabel} showSearch={data?.contentFilterSearchV1===true} layoutClass={classes} style={style}/>:<div className={classes} style={style}>{items.map(item=><Card key={item.key} item={item}/>)}</div>):<div className="bhx-v1-empty">No filter items added yet.</div>}</div>
}
