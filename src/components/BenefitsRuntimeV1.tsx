'use client'
import {useEffect,useRef,useState} from 'react'
import BenefitsCardV1 from './BenefitsCardV1'

export default function BenefitsRuntimeV1({items,data}:{items:any[];data:any}){
 const rail=useRef<HTMLDivElement>(null),[index,setIndex]=useState(0),[paused,setPaused]=useState(false),[copies,setCopies]=useState(2)
 const mode=String(data?.benefitsScrollTypeV1||'continuous')
 const speedScale=Math.max(1,Math.min(200,Number(data?.benefitsMarqueeSpeedV1||40)))
 const pixelsPerSecond=Math.max(12,Math.min(240,4800/speedScale))
 const stepMs=Math.max(500,Math.min(30000,Number(data?.benefitsStepDelayV1||3)*1000))
 const go=(next:number)=>{const n=(next+items.length)%items.length;setIndex(n);const el=rail.current?.children[n] as HTMLElement|undefined;el?.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'nearest',inline:'start'})}

 useEffect(()=>{
  if(mode!=='continuous'||items.length<1)return
  const el=rail.current
  if(!el)return
  const measure=()=>{
   const first=el.querySelector<HTMLElement>('[data-bhx-marquee-group="0"]')
   if(!first)return
   const groupWidth=Math.max(1,first.getBoundingClientRect().width)
   // Keep enough identical groups to overflow even when the original WP starter
   // set is narrower than a wide desktop viewport. Cap protects DOM/PageSpeed.
   setCopies(Math.max(2,Math.min(40,Math.ceil(el.clientWidth/groupWidth)+2)))
  }
  measure()
  const observer=typeof ResizeObserver!=='undefined'?new ResizeObserver(measure):null
  observer?.observe(el)
  window.addEventListener('resize',measure)
  return()=>{observer?.disconnect();window.removeEventListener('resize',measure)}
 },[mode,items.length])

 useEffect(()=>{if(mode!=='step'||paused||items.length<2)return;const id=window.setInterval(()=>go(index+1),stepMs);return()=>window.clearInterval(id)},[mode,paused,index,stepMs,items.length])
 useEffect(()=>{
  if(mode!=='continuous'||paused||items.length<1||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return
  let raf=0,last=performance.now()
  const tick=(now:number)=>{
   const el=rail.current
   if(el){
    const second=el.querySelector<HTMLElement>('[data-bhx-marquee-group="1"]')
    const loopWidth=second?.offsetLeft||0
    const dt=Math.min(64,now-last)
    el.scrollLeft+=pixelsPerSecond*dt/1000
    if(loopWidth>0&&el.scrollLeft>=loopWidth)el.scrollLeft-=loopWidth
   }
   last=now;raf=requestAnimationFrame(tick)
  }
  raf=requestAnimationFrame(tick);return()=>cancelAnimationFrame(raf)
 },[mode,paused,pixelsPerSecond,items.length,copies])

 if(mode==='continuous'){
  return <div className="bhx-benefits-runtime bhx-benefits-continuous" onMouseEnter={()=>data?.benefitsMarqueePauseHoverV1!==false&&setPaused(true)} onMouseLeave={()=>setPaused(false)}>
   <div ref={rail} className="bhx-benefits-rail bhx-benefits-marquee-rail" aria-label="Benefits">
    {Array.from({length:copies},(_,group)=><div className="bhx-benefits-marquee-group" data-bhx-marquee-group={group} key={`group-${group}`}>{items.map((item,i)=><BenefitsCardV1 key={`${item?._key||i}-${group}`} item={item} data={data} duplicate={group>0}/>)}</div>)}
   </div>
  </div>
 }

 return <div className="bhx-benefits-runtime bhx-benefits-step" onMouseEnter={()=>data?.benefitsMarqueePauseHoverV1!==false&&setPaused(true)} onMouseLeave={()=>setPaused(false)}>
  <div ref={rail} className="bhx-benefits-rail">{items.map((item,i)=><BenefitsCardV1 key={item?._key||i} item={item} data={data}/>)}</div>
  <div className="bhx-benefits-step-controls"><button type="button" onClick={()=>go(index-1)} aria-label="Previous benefit">‹</button><span aria-live="polite">{index+1} / {items.length}</span><button type="button" onClick={()=>go(index+1)} aria-label="Next benefit">›</button></div>
 </div>
}
