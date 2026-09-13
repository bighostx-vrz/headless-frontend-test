'use client'

import {useEffect} from 'react'

function inInitialViewport(el:HTMLElement){
  const rect=el.getBoundingClientRect()
  const viewport=Math.max(document.documentElement.clientHeight,window.innerHeight||0)
  return rect.bottom>0&&rect.top<viewport*.94
}

export default function TextTextMotionV1({scopeId}:{scopeId:string}){
 useEffect(()=>{
   const root=document.getElementById(scopeId)
   if(!root)return
   const nodes=[root,...Array.from(root.querySelectorAll<HTMLElement>('[data-bhx-tt-anim]'))]
   const reduced=window.matchMedia('(prefers-reduced-motion: reduce)')
   const mobile=window.matchMedia('(max-width: 768px)')
   const revealAll=()=>{nodes.forEach(el=>{el.dataset.bhxVisible='true'});root.dataset.bhxMotionReady='true'}
   if(reduced.matches||!('IntersectionObserver'in window)){revealAll();return}

   // Progressive enhancement: server-rendered content remains visible without JS.
   // When JS is available, only off-screen animated nodes start hidden. This avoids
   // hiding likely LCP content during hydration while preserving scroll entrances.
   for(const el of nodes){
     const noAnimation=el.dataset.bhxNoAnimation==='true'
     el.dataset.bhxVisible=noAnimation||inInitialViewport(el)?'true':'false'
   }
   root.dataset.bhxMotionReady='true'

   const observer=new IntersectionObserver(entries=>{
     for(const entry of entries){
       const el=entry.target as HTMLElement
       if(el.dataset.bhxNoAnimation==='true'){el.dataset.bhxVisible='true';observer.unobserve(el);continue}
       const trigger=(mobile.matches?el.dataset.bhxTtTriggerMobile:el.dataset.bhxTtTrigger)||'scroll'
       const once=trigger==='once'
       if(entry.isIntersecting){el.dataset.bhxVisible='true';if(once)observer.unobserve(el)}
       else if(!once){el.dataset.bhxVisible='false'}
     }
   },{threshold:.14,rootMargin:'0px 0px -6% 0px'})

   for(const el of nodes){
     if(el.dataset.bhxNoAnimation==='true')continue
     const trigger=(mobile.matches?el.dataset.bhxTtTriggerMobile:el.dataset.bhxTtTrigger)||'scroll'
     if(trigger==='once'&&el.dataset.bhxVisible==='true')continue
     observer.observe(el)
   }
   return ()=>observer.disconnect()
 },[scopeId])
 return null
}
