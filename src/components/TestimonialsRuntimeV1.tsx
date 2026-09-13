'use client'

import {Children,useEffect,useRef,useState,type PointerEvent as ReactPointerEvent,type ReactNode} from 'react'

type Props={children:ReactNode;autoplay?:boolean;seconds?:number;showArrows?:boolean;showDots?:boolean;enableDrag?:boolean;pauseOnHover?:boolean;label?:string}
const safeSeconds=(value:any)=>Math.max(0,Math.min(60,Number.isFinite(Number(value))?Number(value):5))

export default function TestimonialsRuntimeV1({children,autoplay=false,seconds=5,showArrows=true,showDots=true,enableDrag=true,pauseOnHover=true,label='Testimonials'}:Props){
  const slides=Children.toArray(children),count=slides.length
  const [index,setIndex]=useState(0),[hovered,setHovered]=useState(false),[focused,setFocused]=useState(false)
  const startX=useRef<number|null>(null),deltaX=useRef(0)
  const go=(next:number)=>setIndex(count?((next%count)+count)%count:0)
  useEffect(()=>{if(index>=count&&count)setIndex(0)},[count,index])
  useEffect(()=>{
    const delay=safeSeconds(seconds)
    if(!autoplay||delay<=0||count<=1||focused||(pauseOnHover&&hovered))return
    if(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)return
    const timer=window.setInterval(()=>setIndex(current=>(current+1)%count),delay*1000)
    return()=>window.clearInterval(timer)
  },[autoplay,count,focused,hovered,pauseOnHover,seconds])
  const pointerDown=(event:ReactPointerEvent<HTMLDivElement>)=>{if(!enableDrag||count<=1)return;startX.current=event.clientX;deltaX.current=0;event.currentTarget.setPointerCapture?.(event.pointerId)}
  const pointerMove=(event:ReactPointerEvent<HTMLDivElement>)=>{if(startX.current!=null)deltaX.current=event.clientX-startX.current}
  const pointerEnd=()=>{if(startX.current==null)return;const delta=deltaX.current;startX.current=null;deltaX.current=0;if(Math.abs(delta)>=45)go(index+(delta<0?1:-1))}
  if(!count)return <div className="bhx-testimonials-empty-v1">No testimonials added yet.</div>
  return <div className={`bhx-testimonials-runtime-v1 ${enableDrag&&count>1?'is-draggable':''}`} role="region" aria-roledescription="carousel" aria-label={label} tabIndex={0} data-bhx-testimonials-runtime-v1 data-bhx-active-index={index}
    onKeyDown={event=>{if(event.key==='ArrowLeft'){event.preventDefault();go(index-1)}else if(event.key==='ArrowRight'){event.preventDefault();go(index+1)}else if(event.key==='Home'){event.preventDefault();go(0)}else if(event.key==='End'){event.preventDefault();go(count-1)}}}
    onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)} onFocusCapture={()=>setFocused(true)} onBlurCapture={event=>{if(!event.currentTarget.contains(event.relatedTarget as Node|null))setFocused(false)}}
    onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerEnd} onPointerCancel={pointerEnd}>
    <div className="bhx-testimonials-stage-v1" aria-live="off">{slides.map((slide,slideIndex)=><div key={slideIndex} className={`bhx-testimonials-slide-v1 ${slideIndex===index?'is-active':''}`} aria-hidden={slideIndex!==index} inert={slideIndex!==index?true:undefined}>{slide}</div>)}</div>
    {count>1&&showArrows?<><button type="button" className="bhx-testimonials-arrow-v1 is-prev" aria-label="Previous testimonial" onClick={()=>go(index-1)}>‹</button><button type="button" className="bhx-testimonials-arrow-v1 is-next" aria-label="Next testimonial" onClick={()=>go(index+1)}>›</button></>:null}
    {count>1&&showDots?<div className="bhx-testimonials-dots-v1" role="group" aria-label="Testimonial navigation">{slides.map((_,dotIndex)=><button key={dotIndex} type="button" className={dotIndex===index?'is-active':''} aria-label={`Go to testimonial ${dotIndex+1}`} aria-current={dotIndex===index?'true':undefined} onClick={()=>go(dotIndex)}/>)}</div>:null}
    <span className="sr-only" aria-live="polite">Testimonial {index+1} of {count}</span>
  </div>
}
