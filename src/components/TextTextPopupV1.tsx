'use client'

import type {ReactNode} from 'react'
import {useEffect,useRef,useState} from 'react'

export default function TextTextPopupV1({popupId,ownerId,label,children}:{popupId:string;ownerId:string;label:string;children:ReactNode}){
 const [open,setOpen]=useState(false)
 const closeRef=useRef<HTMLButtonElement|null>(null)
 const triggerRef=useRef<HTMLButtonElement|null>(null)
 const dialogRef=useRef<HTMLDivElement|null>(null)
 useEffect(()=>{
   if(!open)return
   const prior=document.body.style.overflow
   const owner=document.getElementById(ownerId)
   if(owner)owner.dataset.bhxPopupOpen='true'
   document.body.style.overflow='hidden'
   const key=(e:KeyboardEvent)=>{
     if(e.key==='Escape'){e.preventDefault();setOpen(false);return}
     if(e.key!=='Tab'||!dialogRef.current)return
     const focusable=Array.from(dialogRef.current.querySelectorAll<HTMLElement>('button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])')).filter(el=>!el.hasAttribute('disabled')&&el.getAttribute('aria-hidden')!=='true')
     if(!focusable.length){e.preventDefault();closeRef.current?.focus();return}
     const first=focusable[0],last=focusable[focusable.length-1]
     if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}
     else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
   }
   document.addEventListener('keydown',key)
   requestAnimationFrame(()=>closeRef.current?.focus())
   return ()=>{document.body.style.overflow=prior;document.removeEventListener('keydown',key);if(owner)delete owner.dataset.bhxPopupOpen;triggerRef.current?.focus()}
 },[open])
 return <div className="bhx-tt-readmore">
   <button ref={triggerRef} type="button" className="bhx-tt-readmore-button" aria-haspopup="dialog" aria-controls={popupId} aria-expanded={open} onClick={()=>setOpen(true)}>{label}</button>
   {open?<div className="bhx-tt-popup-backdrop" role="presentation" onPointerDown={(e)=>{if(e.target===e.currentTarget)setOpen(false)}}>
     <div ref={dialogRef} id={popupId} className="bhx-tt-popup" role="dialog" aria-modal="true" aria-label={label}>
       <button ref={closeRef} type="button" className="bhx-tt-popup-close" aria-label="Close" onClick={()=>setOpen(false)}>×</button>
       {children}
     </div>
   </div>:null}
 </div>
}
