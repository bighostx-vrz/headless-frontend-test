'use client'

import {useEffect,useRef,useState,type KeyboardEvent as ReactKeyboardEvent} from 'react'

type LightboxImage={src:string;alt:string;title:string;caption:string}
type LightboxAlbum={title:string;images:LightboxImage[]}
type Active={album:number;image:number}|null

export default function AlbumLightboxV1({ownerId,albums}:{ownerId:string;albums:LightboxAlbum[]}){
  const [active,setActive]=useState<Active>(null)
  const lastTrigger=useRef<HTMLElement|null>(null),closeButton=useRef<HTMLButtonElement|null>(null),dialog=useRef<HTMLDivElement|null>(null)
  useEffect(()=>{const owner=document.getElementById(ownerId);if(!owner)return;const onClick=(event:MouseEvent)=>{const trigger=(event.target as HTMLElement)?.closest?.('[data-bhx-album-open]') as HTMLElement|null;if(!trigger||!owner.contains(trigger))return;const album=Number(trigger.dataset.albumIndex),image=Number(trigger.dataset.imageIndex);if(!Number.isFinite(album)||!Number.isFinite(image)||!albums[album]?.images?.[image]?.src)return;event.preventDefault();lastTrigger.current=trigger;setActive({album,image})};owner.addEventListener('click',onClick);return()=>owner.removeEventListener('click',onClick)},[ownerId,albums])
  useEffect(()=>{if(active==null)return;const previous=document.body.style.overflow;document.body.style.overflow='hidden';const onKey=(event:KeyboardEvent)=>{if(event.key==='Escape'){event.preventDefault();setActive(null)}if(event.key==='ArrowLeft'){event.preventDefault();step(-1)}if(event.key==='ArrowRight'){event.preventDefault();step(1)}};window.addEventListener('keydown',onKey);requestAnimationFrame(()=>closeButton.current?.focus());return()=>{window.removeEventListener('keydown',onKey);document.body.style.overflow=previous}},[active?.album])
  useEffect(()=>{if(active==null)lastTrigger.current?.focus?.()},[active])
  if(active==null)return null
  const album=albums[active.album],images=album?.images||[],current=images[active.image]
  if(!current)return null
  const step=(direction:number)=>setActive(value=>{if(!value)return value;const list=albums[value.album]?.images||[];if(!list.length)return null;return {...value,image:(value.image+direction+list.length)%list.length}})
  const trap=(event:ReactKeyboardEvent<HTMLDivElement>)=>{if(event.key!=='Tab')return;const focusable=Array.from(dialog.current?.querySelectorAll<HTMLElement>('button:not([disabled]),a[href]')||[]).filter(node=>node.offsetParent!==null);if(!focusable.length)return;const first=focusable[0],last=focusable[focusable.length-1],currentNode=document.activeElement;if(event.shiftKey&&currentNode===first){event.preventDefault();last.focus()}else if(!event.shiftKey&&currentNode===last){event.preventDefault();first.focus()}}
  const title=album?.title||current.title||current.alt||'Album image'
  return <div ref={dialog} className="bhx-album-lightbox-v1" role="dialog" aria-modal="true" aria-label={title} onKeyDown={trap} onMouseDown={event=>{if(event.currentTarget===event.target)setActive(null)}}>
    <button ref={closeButton} type="button" className="bhx-album-lightbox-close-v1" aria-label="Close album lightbox" onClick={()=>setActive(null)}>×</button>
    {images.length>1?<button type="button" className="bhx-album-lightbox-prev-v1" aria-label="Previous image" onClick={()=>step(-1)}>‹</button>:null}
    <div className="bhx-album-lightbox-stage-v1"><img src={current.src} alt={current.alt}/>{(album?.title||current.title||current.caption)?<div className="bhx-album-lightbox-caption-v1">{album?.title?<strong>{album.title}</strong>:null}{current.title&&current.title!==album?.title?<span>{current.title}</span>:null}{current.caption?<span>{current.caption}</span>:null}<small>{active.image+1} / {images.length}</small></div>:null}</div>
    {images.length>1?<button type="button" className="bhx-album-lightbox-next-v1" aria-label="Next image" onClick={()=>step(1)}>›</button>:null}
  </div>
}
