'use client'

import {useEffect,useRef,useState} from 'react'
import V1Icon from './V1Icon'

type StickyItem={_key?:string;label?:string;anchor?:string;icon?:string}

export default function StickyNavRuntimeV1({items,sticky,trackActive,offset}:{items:StickyItem[];sticky:boolean;trackActive:boolean;offset:number}){
  const hostRef=useRef<HTMLDivElement|null>(null)
  const navRef=useRef<HTMLElement|null>(null)
  const linksRef=useRef<Record<string,HTMLAnchorElement|null>>({})
  const [active,setActive]=useState('')
  const [fixed,setFixed]=useState(false)
  const [metrics,setMetrics]=useState({left:0,width:0,height:0})

  useEffect(()=>{
    if(!sticky){setFixed(false);return}
    let raf=0
    const update=()=>{
      if(raf)return
      raf=requestAnimationFrame(()=>{
        raf=0
        const host=hostRef.current,nav=navRef.current
        if(!host||!nav)return
        const rect=host.getBoundingClientRect()
        const h=Math.ceil(nav.getBoundingClientRect().height||metrics.height||0)
        const should=rect.top<=offset
        setFixed(should)
        setMetrics(prev=>prev.left===rect.left&&prev.width===rect.width&&prev.height===h?prev:{left:rect.left,width:rect.width,height:h})
      })
    }
    update();window.addEventListener('scroll',update,{passive:true});window.addEventListener('resize',update)
    return()=>{if(raf)cancelAnimationFrame(raf);window.removeEventListener('scroll',update);window.removeEventListener('resize',update)}
  },[sticky,offset,metrics.height])

  useEffect(()=>{
    if(!trackActive){setActive('');return}
    const targets=items.map(item=>document.getElementById(String(item.anchor||''))).filter(Boolean) as HTMLElement[]
    if(!targets.length)return
    const updateHash=()=>{const id=decodeURIComponent(window.location.hash.replace(/^#/,''));if(id&&targets.some(el=>el.id===id))setActive(id)}
    updateHash();window.addEventListener('hashchange',updateHash)
    if(typeof IntersectionObserver==='undefined')return()=>window.removeEventListener('hashchange',updateHash)
    const observer=new IntersectionObserver(entries=>{
      const visible=entries.filter(entry=>entry.isIntersecting).sort((a,b)=>{
        const ar=Math.abs(a.boundingClientRect.top-offset),br=Math.abs(b.boundingClientRect.top-offset)
        return ar-br||b.intersectionRatio-a.intersectionRatio
      })
      if(visible[0])setActive((visible[0].target as HTMLElement).id)
    },{rootMargin:`-${Math.min(500,offset+8)}px 0px -58% 0px`,threshold:[0,.1,.25,.5,.75]})
    targets.forEach(el=>observer.observe(el))
    return()=>{observer.disconnect();window.removeEventListener('hashchange',updateHash)}
  },[items,trackActive,offset])

  useEffect(()=>{
    if(!active)return
    const link=linksRef.current[active]
    if(!link)return
    const reduce=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    link.scrollIntoView({block:'nearest',inline:'nearest',behavior:reduce?'auto':'smooth'})
  },[active])

  const hostStyle=fixed&&sticky?{minHeight:metrics.height||undefined}:undefined
  const navStyle=fixed&&sticky?{top:offset,left:metrics.left,width:metrics.width}:sticky?{top:offset}:undefined
  return <div ref={hostRef} className="bhx-sticky-nav-host" style={hostStyle} data-bhx-sticky-runtime="client">
    <nav ref={navRef} className={`bhx-sticky-nav${fixed&&sticky?' is-stuck':''}`} aria-label="Section navigation" style={navStyle}>
      {items.map(item=>{const anchor=String(item.anchor||'');const on=trackActive&&active===anchor;return <a key={item._key||anchor} ref={el=>{linksRef.current[anchor]=el}} href={`#${encodeURIComponent(anchor)}`} className={on?'is-active':''} aria-current={on?'location':undefined}>
        {item.icon?<V1Icon name={item.icon} size={18}/>:null}<span>{item.label}</span>
      </a>})}
    </nav>
  </div>
}
