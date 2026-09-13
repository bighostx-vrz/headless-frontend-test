import Image from 'next/image'
import {PortableText} from '@portabletext/react'
import {urlFor} from '@/sanity/lib/image'
export default function DetailPage({item}: {item:any}) {return <article className="detail-page"><div className="detail-hero"><div className="section-inner width-contained"><span className="eyebrow">{item._type}</span><h1>{item.title}</h1>{item.excerpt && <p className="lead">{item.excerpt}</p>}{item.outcome && <strong className="outcome">{item.outcome}</strong>}{item.image?.asset && <Image src={urlFor(item.image).width(1500).height(900).url()} alt={item.title || ''} width={1500} height={900}/>}</div></div>{Array.isArray(item.body) && <div className="detail-body rich-text"><PortableText value={item.body}/></div>}</article>}
