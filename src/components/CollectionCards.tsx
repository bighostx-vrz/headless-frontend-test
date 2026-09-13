import Image from 'next/image'
import {urlFor} from '@/sanity/lib/image'
import {stegaClean} from 'next-sanity'
export default function CollectionCards({items, basePath}: {items:any[]; basePath:string}) {
  return <div className="collection-grid">{items?.map((item:any)=><a className="collection-card" href={`${basePath}/${stegaClean(item.slug?.current || '')}`} key={item._id}>{item.image?.asset && <Image src={urlFor(item.image).width(800).height(480).url()} alt={item.title || ''} width={800} height={480}/>}<div><span className="eyebrow">{item.industry?.title || item.region?.title || item.newsType || item.brochureType || ''}</span><h3>{item.title}</h3>{item.outcome && <strong>{item.outcome}</strong>}{item.excerpt && <p>{item.excerpt}</p>}<span className="text-link">Explore →</span></div></a>)}</div>
}
