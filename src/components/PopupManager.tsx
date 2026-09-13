'use client'
import {useEffect,useState} from 'react'
import CoreSectionRenderer from './CoreSectionRenderer'
import WebSectionRenderer from './WebSectionRenderer'
import DynamicForm from './DynamicForm'
export default function PopupManager({popup}:{popup:any}){
  const [open,setOpen]=useState(false)
  useEffect(()=>{
    if(!popup?.enabled)return
    const key=`bhx-popup-${popup._id||popup.title||'global'}`
    const seen=popup.frequency==='session'?sessionStorage.getItem(key):popup.frequency==='week'?localStorage.getItem(key):null
    if(seen){if(popup.frequency==='week'&&Date.now()-Number(seen)>7*86400000)localStorage.removeItem(key);else return}
    const show=()=>{setOpen(true);const now=String(Date.now());if(popup.frequency==='session')sessionStorage.setItem(key,now);if(popup.frequency==='week')localStorage.setItem(key,now)}
    if(popup.triggerType==='manual')return
    if(popup.triggerType==='exit'){
      const onOut=(e:MouseEvent)=>{if(e.clientY<=0){show();document.removeEventListener('mouseout',onOut)}}
      document.addEventListener('mouseout',onOut);return()=>document.removeEventListener('mouseout',onOut)
    }
    const t=window.setTimeout(show,Math.max(0,Number(popup.delaySeconds||5))*1000);return()=>window.clearTimeout(t)
  },[popup])
  if(!open)return null
  return <div className="bhx-popup-backdrop" role="dialog" aria-modal="true" aria-label={popup.heading||popup.title||'Popup'} onMouseDown={(e)=>{if(e.target===e.currentTarget)setOpen(false)}}><div className={`bhx-popup popup-theme-${popup.theme||'light'}`} style={{maxWidth:popup.width||'720px'}}><button className="popup-close" type="button" aria-label="Close" onClick={()=>setOpen(false)}>×</button>{popup.heading&&<h2>{popup.heading}</h2>}{popup.text&&<p>{popup.text}</p>}{popup.webSection&&<WebSectionRenderer row={{_key:`popup-${popup._id||'section'}`,section:popup.webSection}}/>}{!popup.webSection&&popup.section&&<CoreSectionRenderer data={popup.section}/>} {popup.form&&<DynamicForm form={popup.form}/>}</div></div>
}
