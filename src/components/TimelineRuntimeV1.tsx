'use client'

import {useEffect} from 'react'

type TimelineRuntimeProps={
  ownerId:string
  revealThreshold?:number
  revealOnce?:boolean
  animateProgress?:boolean
  animateMarkers?:boolean
}

export default function TimelineRuntimeV1({ownerId,revealThreshold=18,revealOnce=true,animateProgress=true,animateMarkers=true}:TimelineRuntimeProps){
  useEffect(()=>{
    const root=document.getElementById(ownerId)
    if(!root)return
    const items=Array.from(root.querySelectorAll<HTMLElement>('[data-bhx-timeline-item]'))
    const shell=root.querySelector<HTMLElement>('[data-bhx-timeline-scroll]')
    const list=root.querySelector<HTMLElement>('[data-bhx-timeline-list]')
    const prev=root.querySelector<HTMLButtonElement>('[data-bhx-timeline-prev]')
    const next=root.querySelector<HTMLButtonElement>('[data-bhx-timeline-next]')
    const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches
    root.classList.add('is-runtime-ready')
    let observer:IntersectionObserver|undefined
    let resizeObserver:ResizeObserver|undefined
    let lastDialogTrigger:HTMLElement|null=null

    const isHorizontal=()=>{
      const mobile=window.matchMedia('(max-width: 768px)').matches
      return mobile?root.dataset.mobileDirection==='horizontal_scroll':root.dataset.desktopDirection==='horizontal'
    }
    const setRailGeometry=()=>{
      if(!list||!shell)return
      const markers=Array.from(root.querySelectorAll<HTMLElement>('[data-bhx-timeline-marker]'))
      if(!markers.length)return
      if(isHorizontal()){
        const first=markers[0],last=markers[markers.length-1]
        const shellRect=shell.getBoundingClientRect(),firstRect=first.getBoundingClientRect(),lastRect=last.getBoundingClientRect()
        const logicalScroll=Math.abs(shell.scrollLeft)
        const start=(firstRect.left-shellRect.left)+logicalScroll+(firstRect.width/2)
        const end=(lastRect.left-shellRect.left)+logicalScroll+(lastRect.width/2)
        shell.style.setProperty('--bhx-rail-start',`${Math.max(0,Math.min(start,end))}px`)
        shell.style.setProperty('--bhx-rail-size',`${Math.max(0,Math.abs(end-start))}px`)
      }else{
        const track=root.querySelector<HTMLElement>('[data-bhx-timeline-track]')
        if(!track)return
        const tr=track.getBoundingClientRect(),a=markers[0].getBoundingClientRect(),b=markers[markers.length-1].getBoundingClientRect()
        const top=(a.top-tr.top)+(a.height/2)
        const bottom=(b.top-tr.top)+(b.height/2)
        track.style.setProperty('--bhx-rail-start',`${Math.max(0,top)}px`)
        track.style.setProperty('--bhx-rail-size',`${Math.max(0,bottom-top)}px`)
      }
    }
    const updateHorizontal=()=>{
      if(!shell)return
      const horizontal=isHorizontal()
      const overflow=horizontal&&shell.scrollWidth>shell.clientWidth+2
      if(prev)prev.hidden=!overflow
      if(next)next.hidden=!overflow
      if(!overflow){
        if(prev)prev.disabled=true
        if(next)next.disabled=true
        if(animateProgress)root.style.setProperty('--bhx-progress','1')
        return
      }
      const max=Math.max(1,shell.scrollWidth-shell.clientWidth)
      const logical=Math.min(max,Math.max(0,Math.abs(shell.scrollLeft)))
      const ratio=logical/max
      if(prev)prev.disabled=ratio<=.01
      if(next)next.disabled=ratio>=.99
      if(animateProgress)root.style.setProperty('--bhx-progress',String(ratio))
    }
    const updateVerticalProgress=()=>{
      if(!animateProgress||isHorizontal())return
      const rect=root.getBoundingClientRect(),vh=window.innerHeight||document.documentElement.clientHeight
      const start=vh*.75,end=Math.max(1,rect.height+vh*.25)
      const ratio=Math.min(1,Math.max(0,(start-rect.top)/end))
      root.style.setProperty('--bhx-progress',String(ratio))
    }
    const refresh=()=>{setRailGeometry();updateHorizontal();updateVerticalProgress()}
    const move=(dir:number)=>{
      if(!shell)return
      const rtl=getComputedStyle(root).direction==='rtl'?-1:1
      shell.scrollBy({left:dir*rtl*Math.max(shell.clientWidth*.82,240),behavior:reduce?'auto':'smooth'})
    }
    const onPrev=()=>move(-1)
    const onNext=()=>move(1)
    const onKeyDown=(event:KeyboardEvent)=>{if(!isHorizontal())return;if(event.key==='ArrowLeft'){event.preventDefault();move(-1)}else if(event.key==='ArrowRight'){event.preventDefault();move(1)}}
    prev?.addEventListener('click',onPrev)
    next?.addEventListener('click',onNext)
    shell?.addEventListener('scroll',updateHorizontal,{passive:true})
    shell?.addEventListener('keydown',onKeyDown)
    window.addEventListener('scroll',updateVerticalProgress,{passive:true})
    window.addEventListener('resize',refresh,{passive:true})

    const setVisible=(item:HTMLElement,visible:boolean)=>{
      item.classList.toggle('is-visible',visible)
      if(animateMarkers)item.querySelector<HTMLElement>('[data-bhx-timeline-marker]')?.classList.toggle('is-marker-visible',visible)
    }
    if(reduce){items.forEach((item)=>setVisible(item,true))}
    else if('IntersectionObserver' in window){
      root.classList.add('is-motion-ready')
      observer=new IntersectionObserver(entries=>{
        entries.forEach(entry=>{
          const el=entry.target as HTMLElement
          if(entry.isIntersecting){setVisible(el,true);if(revealOnce)observer?.unobserve(el)}
          else if(!revealOnce)setVisible(el,false)
        })
      },{threshold:Math.min(.8,Math.max(0,revealThreshold/100))})
      items.forEach(item=>observer?.observe(item))
    }else items.forEach(item=>setVisible(item,true))

    if('ResizeObserver' in window){
      resizeObserver=new ResizeObserver(refresh)
      if(list)resizeObserver.observe(list)
      if(shell)resizeObserver.observe(shell)
    }

    const click=(event:MouseEvent)=>{
      const target=event.target as HTMLElement|null
      const open=target?.closest<HTMLElement>('[data-bhx-timeline-open]')
      if(open){
        const id=open.dataset.bhxTimelineOpen||''
        const dialog=id?document.getElementById(id) as HTMLDialogElement|null:null
        if(dialog){
          lastDialogTrigger=open
          typeof dialog.showModal==='function'?dialog.showModal():dialog.setAttribute('open','')
          event.preventDefault()
        }
        return
      }
      const close=target?.closest<HTMLElement>('[data-bhx-timeline-close]')
      if(close){const dialog=close.closest('dialog') as HTMLDialogElement|null;dialog?.close();event.preventDefault()}
    }
    const dialogClick=(event:MouseEvent)=>{
      const d=event.target as HTMLDialogElement
      if(d?.tagName==='DIALOG'&&event.target===d){
        const r=d.getBoundingClientRect()
        const inside=event.clientX>=r.left&&event.clientX<=r.right&&event.clientY>=r.top&&event.clientY<=r.bottom
        if(!inside)d.close()
      }
    }
    const closed=()=>lastDialogTrigger?.focus()
    const dialogs=Array.from(root.querySelectorAll<HTMLDialogElement>('dialog[data-bhx-timeline-dialog]'))
    root.addEventListener('click',click)
    dialogs.forEach(d=>{d.addEventListener('click',dialogClick);d.addEventListener('close',closed)})
    const frame=requestAnimationFrame(refresh)

    return ()=>{
      cancelAnimationFrame(frame)
      root.classList.remove('is-runtime-ready','is-motion-ready')
      observer?.disconnect()
      resizeObserver?.disconnect()
      prev?.removeEventListener('click',onPrev)
      next?.removeEventListener('click',onNext)
      shell?.removeEventListener('scroll',updateHorizontal)
      shell?.removeEventListener('keydown',onKeyDown)
      window.removeEventListener('scroll',updateVerticalProgress)
      window.removeEventListener('resize',refresh)
      root.removeEventListener('click',click)
      dialogs.forEach(d=>{d.removeEventListener('click',dialogClick);d.removeEventListener('close',closed)})
    }
  },[ownerId,revealThreshold,revealOnce,animateProgress,animateMarkers])
  return null
}
