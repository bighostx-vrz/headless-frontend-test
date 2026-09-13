'use client'

import {useEffect,useRef,useState,type CSSProperties} from 'react'

export type BhxVideoChannelItem={key:string;title:string;description:string;duration:string;posterUrl:string;provider:'youtube'|'vimeo'|'direct'|'external';embedUrl:string;externalUrl:string}
type SliderPolicy={autoplay:boolean;seconds:number;showArrows:boolean;showDots:boolean;enableDrag:boolean;pauseOnHover:boolean}

function VideoMedia({item}:{item:BhxVideoChannelItem}){
  const [playing,setPlaying]=useState(false)
  const playable=Boolean(item.embedUrl)
  if(playing&&playable){
    if(item.provider==='direct')return <div className="bhx-video-media"><video src={item.embedUrl} controls playsInline preload="none" autoPlay aria-label={item.title||'Video'}/></div>
    const join=item.embedUrl.includes('?')?'&':'?'
    return <div className="bhx-video-media"><iframe src={`${item.embedUrl}${join}autoplay=1`} title={item.title||'Video'} loading="lazy" allow="autoplay; encrypted-media; picture-in-picture; web-share; fullscreen" referrerPolicy="strict-origin-when-cross-origin" sandbox="allow-scripts allow-same-origin allow-presentation allow-popups" allowFullScreen/></div>
  }
  return <div className="bhx-video-media bhx-video-poster">
    {item.posterUrl?<img src={item.posterUrl} alt="" width="1280" height="720" loading="lazy" decoding="async"/>:<span className="bhx-video-placeholder" aria-hidden="true">▶</span>}
    {playable?<button type="button" className="bhx-video-play" onClick={()=>setPlaying(true)} aria-label={`Play ${item.title||'video'}`}><span aria-hidden="true">▶</span><span className="sr-only">Play video</span></button>:item.externalUrl?<a className="bhx-video-external" href={item.externalUrl} target="_blank" rel="noopener noreferrer">Open video ↗</a>:null}
  </div>
}
function VideoCard({item,featured=false}:{item:BhxVideoChannelItem;featured?:boolean}){return <article className={`bhx-video-card${featured?' is-featured':''}`}><VideoMedia item={item}/><div className="bhx-video-copy">{item.title?<h3>{item.title}</h3>:null}{item.duration?<div className="bhx-video-meta">{item.duration}</div>:null}{item.description?<p>{item.description}</p>:null}</div></article>}

function ScrollLane({items,slider}:{items:BhxVideoChannelItem[];slider?:SliderPolicy}){
  const lane=useRef<HTMLDivElement|null>(null),[index,setIndex]=useState(0),[hover,setHover]=useState(false)
  const move=(dir:number)=>{const el=lane.current;if(!el||!el.children.length)return;const next=Math.max(0,Math.min(el.children.length-1,index+dir));(el.children[next] as HTMLElement)?.scrollIntoView({behavior:window.matchMedia?.('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'nearest',inline:'start'});setIndex(next)}
  useEffect(()=>{if(!slider?.autoplay||slider.seconds<=0||items.length<2||(slider.pauseOnHover&&hover))return;if(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)return;const id=window.setInterval(()=>setIndex(current=>{const next=(current+1)%items.length;const el=lane.current;(el?.children[next] as HTMLElement|undefined)?.scrollIntoView({behavior:'smooth',block:'nearest',inline:'start'});return next}),slider.seconds*1000);return()=>window.clearInterval(id)},[slider?.autoplay,slider?.seconds,slider?.pauseOnHover,hover,items.length])
  if(!items.length)return null
  const showArrows=slider?slider.showArrows:true
  return <div className="bhx-video-scroll-shell" onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}>
    {showArrows&&items.length>1?<div className="bhx-video-scroll-controls" aria-label="Video navigation"><button type="button" onClick={()=>move(-1)} disabled={index===0} aria-label="Previous video">‹</button><button type="button" onClick={()=>move(1)} disabled={index===items.length-1} aria-label="Next video">›</button></div>:null}
    <div className={`bhx-video-scroll-track${slider&&!slider.enableDrag?' is-drag-disabled':''}`} ref={lane} onScroll={()=>{const el=lane.current;if(!el||!el.children.length)return;const children=[...el.children] as HTMLElement[];let nearest=0,best=Infinity;children.forEach((node,i)=>{const delta=Math.abs(node.offsetLeft-el.scrollLeft);if(delta<best){best=delta;nearest=i}});setIndex(nearest)}}>{items.map(item=><VideoCard key={item.key} item={item}/>)}</div>
    {slider?.showDots&&items.length>1?<div className="bhx-video-dots" role="tablist" aria-label="Video slider navigation">{items.map((item,i)=><button key={item.key} type="button" role="tab" aria-selected={i===index} aria-label={`Go to video ${i+1}`} className={i===index?'is-active':''} onClick={()=>{const el=lane.current;(el?.children[i] as HTMLElement|undefined)?.scrollIntoView({behavior:window.matchMedia?.('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'nearest',inline:'start'});setIndex(i)}}/>)}</div>:null}
  </div>
}

export default function VideoChannelRuntimeV1({items,layout,desktopColumns,legacySlider}:{items:BhxVideoChannelItem[];layout:string;desktopColumns:number;legacySlider:SliderPolicy}){
  if(layout==='theater')return <div className="bhx-video-theater"><VideoCard item={items[0]} featured/>{items.length>1?<ScrollLane items={items.slice(1)}/>:null}</div>
  if(layout==='stacked_grid'||layout==='featured')return <div className="bhx-video-stacked-grid"><VideoCard item={items[0]} featured/>{items.length>1?<div className="bhx-video-grid" style={{'--bhx-video-cols':desktopColumns} as CSSProperties}>{items.slice(1).map(item=><VideoCard key={item.key} item={item}/>)}</div>:null}</div>
  if(layout==='stacked_scroll')return <div className="bhx-video-stacked-scroll"><VideoCard item={items[0]} featured/>{items.length>1?<ScrollLane items={items.slice(1)}/>:null}</div>
  if(layout==='scroll')return <ScrollLane items={items}/>
  if(layout==='slider')return <ScrollLane items={items} slider={legacySlider}/>
  return <div className="bhx-video-grid" style={{'--bhx-video-cols':desktopColumns} as CSSProperties}>{items.map(item=><VideoCard key={item.key} item={item}/>)}</div>
}
