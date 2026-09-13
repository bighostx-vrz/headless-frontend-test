'use client'

import {useEffect,useMemo,useRef,useState,type PointerEvent as ReactPointerEvent,type ReactNode} from 'react'

type LightboxItem={src:string;alt:string;title:string;caption:string}
type Props={ownerId:string;children:ReactNode;slidesPerViewDesktop:number;slidesPerViewMobile:number;autoplay:boolean;seconds:number;arrows:boolean;dots:boolean;drag:boolean;pauseOnHover:boolean;lightbox:boolean;lightboxItems:LightboxItem[]}

export default function GalleryRuntimeV1({ownerId,children,slidesPerViewDesktop,slidesPerViewMobile,autoplay,seconds,arrows,dots,drag,pauseOnHover,lightbox,lightboxItems}:Props){
  const track=useRef<HTMLDivElement|null>(null),startX=useRef<number|null>(null),startScroll=useRef(0),moved=useRef(false),lastTrigger=useRef<HTMLElement|null>(null),closeButton=useRef<HTMLButtonElement|null>(null)
  const [mobile,setMobile]=useState(false),[page,setPage]=useState(0),[hover,setHover]=useState(false),[active,setActive]=useState<number|null>(null)
  const per=Math.max(1,Math.min(mobile?2:6,mobile?slidesPerViewMobile:slidesPerViewDesktop))
  const count=lightboxItems.length
  const pages=Math.max(1,Math.ceil(count/per))
  const scope=String(ownerId||'gallery').replace(/[^a-zA-Z0-9_-]+/g,'-')
  useEffect(()=>{const mq=window.matchMedia('(max-width: 767px)');const sync=()=>setMobile(mq.matches);sync();mq.addEventListener?.('change',sync);return()=>mq.removeEventListener?.('change',sync)},[])
  useEffect(()=>{if(page>=pages)setPage(Math.max(0,pages-1))},[page,pages])
  const go=(next:number,behavior:ScrollBehavior='smooth')=>{const el=track.current;if(!el||count<=0)return;const target=((next%pages)+pages)%pages;const child=el.children[Math.min(count-1,target*per)] as HTMLElement|undefined;if(child)el.scrollTo({left:child.offsetLeft,behavior});setPage(target)}
  useEffect(()=>{if(!autoplay||seconds<=0||pages<=1||(pauseOnHover&&hover))return;if(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)return;const id=window.setInterval(()=>setPage(current=>{const next=(current+1)%pages;requestAnimationFrame(()=>go(next));return next}),Math.max(1,seconds)*1000);return()=>window.clearInterval(id)},[autoplay,seconds,pages,pauseOnHover,hover,per,count])
  useEffect(()=>{if(active==null)return;const onKey=(event:KeyboardEvent)=>{if(event.key==='Escape'){event.preventDefault();setActive(null)}if(event.key==='ArrowLeft'){event.preventDefault();setActive(v=>v==null?null:(v-1+count)%count)}if(event.key==='ArrowRight'){event.preventDefault();setActive(v=>v==null?null:(v+1)%count)}};window.addEventListener('keydown',onKey);requestAnimationFrame(()=>closeButton.current?.focus());return()=>window.removeEventListener('keydown',onKey)},[active,count])
  useEffect(()=>{if(active==null)lastTrigger.current?.focus?.()},[active])
  const onScroll=()=>{const el=track.current;if(!el||!count)return;let nearest=0,best=Infinity;Array.from(el.children).forEach((node,index)=>{const d=Math.abs((node as HTMLElement).offsetLeft-el.scrollLeft);if(d<best){best=d;nearest=index}});setPage(Math.min(pages-1,Math.floor(nearest/per)))}
  const down=(event:ReactPointerEvent<HTMLDivElement>)=>{if(!drag||event.pointerType==='touch')return;startX.current=event.clientX;startScroll.current=event.currentTarget.scrollLeft;moved.current=false;event.currentTarget.setPointerCapture?.(event.pointerId)}
  const move=(event:ReactPointerEvent<HTMLDivElement>)=>{if(startX.current==null)return;const delta=event.clientX-startX.current;if(Math.abs(delta)>4)moved.current=true;event.currentTarget.scrollLeft=startScroll.current-delta}
  const up=(event:ReactPointerEvent<HTMLDivElement>)=>{if(startX.current==null)return;startX.current=null;event.currentTarget.releasePointerCapture?.(event.pointerId);requestAnimationFrame(onScroll)}
  const onClick=(event:any)=>{const trigger=(event.target as HTMLElement)?.closest?.('[data-bhx-gallery-open]') as HTMLElement|null;if(!trigger||!lightbox)return;if(moved.current){event.preventDefault();moved.current=false;return}const index=Number(trigger.dataset.bhxGalleryOpen);if(Number.isFinite(index)&&lightboxItems[index]?.src){lastTrigger.current=trigger;setActive(index)}}
  const current=active==null?null:lightboxItems[active]
  const dotIndexes=useMemo(()=>Array.from({length:pages},(_,index)=>index),[pages])
  return <div className="bhx-gallery-runtime" data-bhx-gallery-runtime="true" onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}>
    <div id={`${scope}-track`} className={`bhx-gallery-track ${drag?'is-draggable':''}`} ref={track} role="region" aria-roledescription="carousel" aria-label="Image slider" tabIndex={0} onKeyDown={event=>{if(event.key==='ArrowLeft'){event.preventDefault();go(page-1)}if(event.key==='ArrowRight'){event.preventDefault();go(page+1)}}} onScroll={onScroll} onClick={onClick} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}>{children}</div>
    {pages>1&&arrows?<div className="bhx-gallery-arrows"><button type="button" aria-controls={`${scope}-track`} aria-label="Previous gallery page" onClick={()=>go(page-1)}>‹</button><button type="button" aria-controls={`${scope}-track`} aria-label="Next gallery page" onClick={()=>go(page+1)}>›</button></div>:null}
    {pages>1&&dots?<div className="bhx-gallery-dots" role="group" aria-label="Gallery pages">{dotIndexes.map(index=><button type="button" key={index} aria-current={page===index?'page':undefined} aria-label={`Go to gallery page ${index+1}`} className={page===index?'is-active':''} onClick={()=>go(index)}/>)}</div>:null}
    {current?<div className="bhx-gallery-lightbox" role="dialog" aria-modal="true" aria-label={current.title||current.alt||'Image preview'} onMouseDown={event=>{if(event.currentTarget===event.target)setActive(null)}}>
      <button ref={closeButton} type="button" className="bhx-gallery-lightbox-close" aria-label="Close lightbox" onClick={()=>setActive(null)}>×</button>
      {count>1?<button type="button" className="bhx-gallery-lightbox-prev" aria-label="Previous image" onClick={()=>setActive(v=>v==null?null:(v-1+count)%count)}>‹</button>:null}
      <img src={current.src} alt={current.alt}/>
      {count>1?<button type="button" className="bhx-gallery-lightbox-next" aria-label="Next image" onClick={()=>setActive(v=>v==null?null:(v+1)%count)}>›</button>:null}
      {(current.title||current.caption)?<div className="bhx-gallery-lightbox-caption">{current.title?<strong>{current.title}</strong>:null}{current.caption?<span>{current.caption}</span>:null}</div>:null}
    </div>:null}
  </div>
}
