'use client'
import {useEffect,useRef,useState} from 'react'

export default function TextMediaReadMoreV1({label,content,style='inline'}:{label:string;content?:string;style?:string}){
  const [open,setOpen]=useState(false);const closeRef=useRef<HTMLButtonElement>(null)
  useEffect(()=>{if(!open)return;const key=(e:KeyboardEvent)=>{if(e.key==='Escape')setOpen(false)};document.addEventListener('keydown',key);closeRef.current?.focus();return()=>document.removeEventListener('keydown',key)},[open])
  if(style!=='popup')return <details className="bhx-textmedia-readmore bhx-readmore-inline"><summary>{label}</summary>{content&&<p>{content}</p>}</details>
  return <><button type="button" className="bhx-textmedia-readmore-trigger" onClick={()=>setOpen(true)}>{label}</button>{open&&<div className="bhx-textmedia-readmore-modal" role="dialog" aria-modal="true" aria-label={label} onMouseDown={(e)=>{if(e.currentTarget===e.target)setOpen(false)}}><div className="bhx-textmedia-readmore-dialog"><button ref={closeRef} type="button" className="bhx-textmedia-readmore-close" aria-label="Close" onClick={()=>setOpen(false)}>×</button>{content&&<p>{content}</p>}</div></div>}</>
}
