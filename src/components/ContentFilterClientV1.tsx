'use client'

import Image from 'next/image'
import {useEffect,useMemo,useState,type CSSProperties} from 'react'
export type ContentFilterClientItem={key:string;category:string;title:string;text:string;image:string;url:string;linkText:string;linkTarget:'same'|'new'}
export default function ContentFilterClientV1({items,categories,allLabel,showSearch,layoutClass,style}:{items:ContentFilterClientItem[];categories:string[];allLabel:string;showSearch:boolean;layoutClass:string;style:CSSProperties}){
  const [active,setActive]=useState(allLabel),[query,setQuery]=useState('')
  useEffect(()=>{if(!categories.includes(active))setActive(allLabel)},[categories,active,allLabel])
  const shown=useMemo(()=>{const needle=query.trim().toLocaleLowerCase();return items.filter(item=>(active===allLabel||item.category===active)&&(!needle||`${item.title} ${item.text} ${item.category}`.toLocaleLowerCase().includes(needle)))},[items,active,allLabel,query])
  return <div className="bhx-content-filter-client-v1">
    <div className="bhx-content-filter-controls-v1">{showSearch?<label className="bhx-content-filter-search-v1"><span className="sr-only">Search content</span><input type="search" value={query} onChange={event=>setQuery(event.target.value)} placeholder="Search…" aria-label="Search content"/></label>:null}<div className="bhx-content-filter-buttons-v1" role="group" aria-label="Content filters">{categories.map(category=><button type="button" key={category} className={active===category?'is-active':''} aria-pressed={active===category} onClick={()=>setActive(category)}>{category}</button>)}</div></div>
    <p className="sr-only" aria-live="polite">{shown.length} item{shown.length===1?'':'s'} shown.</p>
    {shown.length?<div className={layoutClass} style={style}>{shown.map(item=><article className="bhx-content-filter-card-v1" key={item.key}>{item.image?<Image src={item.image} alt={item.title} width={1000} height={700} sizes="(max-width: 767px) 100vw, (max-width: 900px) 50vw, 33vw"/>:null}<div className="bhx-content-filter-card-copy-v1">{item.category?<span className="bhx-content-filter-category-v1">{item.category}</span>:null}{item.title?<h3>{item.title}</h3>:null}{item.text?<p>{item.text}</p>:null}{item.url?<a href={item.url} target={item.linkTarget==='new'?'_blank':undefined} rel={item.linkTarget==='new'?'noopener noreferrer':undefined}>{item.linkText||'Read more'} <span aria-hidden="true">→</span></a>:null}</div></article>)}</div>:<div className="bhx-v1-empty" role="status">No matching content.</div>}
  </div>
}
