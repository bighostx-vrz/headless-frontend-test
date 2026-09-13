'use client'

import {Children,useEffect,useRef,useState,type PointerEvent as ReactPointerEvent,type ReactNode} from 'react'

type Props={children:ReactNode;autoplay?:boolean;seconds?:number;showArrows?:boolean;showDots?:boolean;enableDrag?:boolean;pauseOnHover?:boolean;label?:string}
const clamp=(value:any,min:number,max:number,fallback:number)=>Math.max(min,Math.min(max,Number.isFinite(Number(value))?Number(value):fallback))

export default function TextSliderRuntimeV1({children,autoplay=false,seconds=5,showArrows=true,showDots=true,enableDrag=true,pauseOnHover=true,label='Text and media slider'}:Props){
  const slides=Children.toArray(children),count=slides.length
  const [index,setIndex]=useState(0),[paused,setPaused]=useState(false)
  const startX=useRef<number|null>(null),deltaX=useRef(0)
  const go=(next:number)=>setIndex(count?((next%count)+count)%count:0)
  useEffect(()=>{if(index>=count&&count)setIndex(0)},[count,index])
  useEffect(()=>{if(!autoplay||count<=1||(pauseOnHover&&paused))return;if(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)return;const delay=clamp(seconds,1,60,5)*1000;const timer=window.setInterval(()=>setIndex(current=>(current+1)%count),delay);return()=>window.clearInterval(timer)},[autoplay,count,pauseOnHover,paused,seconds])
  const pointerDown=(event:ReactPointerEvent<HTMLDivElement>)=>{if(!enableDrag)return;startX.current=event.clientX;deltaX.current=0;event.currentTarget.setPointerCapture?.(event.pointerId)}
  const pointerMove=(event:ReactPointerEvent<HTMLDivElement>)=>{if(startX.current!=null)deltaX.current=event.clientX-startX.current}
  const pointerEnd=()=>{if(startX.current==null)return;const delta=deltaX.current;startX.current=null;deltaX.current=0;if(Math.abs(delta)>=45)go(index+(delta<0?1:-1))}
  if(!count)return <div className="bhx-text-slider-empty">No slider items added yet.</div>
  return <div className="bhx-text-slider-runtime" role="region" aria-roledescription="carousel" aria-label={label} tabIndex={0} data-bhx-text-slider-runtime data-bhx-active-index={index} onKeyDown={event=>{if(event.key==='ArrowLeft'){event.preventDefault();go(index-1)}else if(event.key==='ArrowRight'){event.preventDefault();go(index+1)}}} onMouseEnter={()=>setPaused(true)} onMouseLeave={()=>setPaused(false)} onFocusCapture={()=>setPaused(true)} onBlurCapture={event=>{if(!event.currentTarget.contains(event.relatedTarget as Node|null))setPaused(false)}} onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerEnd} onPointerCancel={pointerEnd}>
    <div className="bhx-text-slider-stage" aria-live="off">{slides.map((slide,slideIndex)=><div key={slideIndex} className={`bhx-text-slider-slide ${slideIndex===index?'is-active':''}`} aria-hidden={slideIndex!==index} inert={slideIndex!==index?true:undefined}>{slide}</div>)}</div>
    {count>1&&showArrows?<><button type="button" className="bhx-text-slider-arrow is-prev" aria-label="Previous slide" onClick={()=>go(index-1)}>‹</button><button type="button" className="bhx-text-slider-arrow is-next" aria-label="Next slide" onClick={()=>go(index+1)}>›</button></>:null}
    {count>1&&showDots?<div className="bhx-text-slider-dots" aria-label="Slider navigation">{slides.map((_,dotIndex)=><button key={dotIndex} type="button" className={dotIndex===index?'is-active':''} aria-label={`Go to slide ${dotIndex+1}`} aria-current={dotIndex===index?'true':undefined} onClick={()=>go(dotIndex)}/>)}</div>:null}
  </div>
}
