import Image from 'next/image'
import DynamicForm from '@/components/DynamicForm'
import {sanityFetch} from '@/sanity/lib/fetch'
import {brochuresQuery} from '@/sanity/lib/queries'
import {urlFor} from '@/sanity/lib/image'
export default async function Brochures(){const items=await sanityFetch<any[]>(brochuresQuery);return <section className="collection-page"><div className="section-inner width-contained"><span className="eyebrow">Resources</span><h1>Brochures & downloads</h1><div className="collection-grid">{items.map((x:any)=><article className="collection-card" id={x.slug?.current} key={x._id}>{x.image?.asset&&<Image src={urlFor(x.image).width(800).height(480).url()} alt={x.title||''} width={800} height={480}/>}<div><span className="eyebrow">{x.brochureType}</span><h3>{x.title}</h3><p>{x.excerpt}</p>{x.requireForm&&x.form?<DynamicForm form={x.form}/>:<a className="button" href={x.fileUrl||x.externalUrl||'#'}>Download</a>}</div></article>)}</div></div></section>}
