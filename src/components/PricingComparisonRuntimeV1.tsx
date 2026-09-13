'use client'

import {useEffect,useRef,useState,type KeyboardEvent} from 'react'
import PricingComparisonTableV1 from './PricingComparisonTableV1'

type AnyMap=Record<string,any>
type Props={plans:AnyMap[];rows:AnyMap[];labels:string[];sectionLabel:string;featureLabel:string;highlightIndex:number;ownerId:string}

export default function PricingComparisonRuntimeV1({plans,rows,labels,sectionLabel,featureLabel,highlightIndex,ownerId}:Props){
  const [active,setActive]=useState(0)
  const buttons=useRef<Array<HTMLButtonElement|null>>([])
  const wrap=useRef<HTMLDivElement|null>(null)
  const [pill,setPill]=useState({left:0,width:0,ready:false})
  const count=Math.max(1,labels.length)
  const panelId=`${ownerId}-comparison-panel`
  const tabId=(index:number)=>`${ownerId}-comparison-cycle-${index}`
  const measure=(index=active)=>{
    const el=buttons.current[index],root=wrap.current
    if(!el||!root)return
    setPill({left:el.offsetLeft,width:el.offsetWidth,ready:true})
  }
  useEffect(()=>{
    const frame=requestAnimationFrame(()=>measure(active))
    const onResize=()=>requestAnimationFrame(()=>measure(active))
    window.addEventListener('resize',onResize,{passive:true})
    return ()=>{cancelAnimationFrame(frame);window.removeEventListener('resize',onResize)}
  },[active])
  const select=(index:number,focus=false)=>{
    const next=(index+count)%count
    setActive(next)
    requestAnimationFrame(()=>{measure(next);if(focus)buttons.current[next]?.focus()})
  }
  const keyDown=(event:KeyboardEvent<HTMLButtonElement>,index:number)=>{
    if(event.key==='ArrowRight'){event.preventDefault();select(index+1,true)}
    else if(event.key==='ArrowLeft'){event.preventDefault();select(index-1,true)}
    else if(event.key==='Home'){event.preventDefault();select(0,true)}
    else if(event.key==='End'){event.preventDefault();select(count-1,true)}
  }
  return <>
    <div className="bhx-comp-cycle-scroll-v1" ref={wrap} onScroll={()=>measure(active)}>
      <div className="bhx-comp-cycle-toggle-v1" role="tablist" aria-label={`${sectionLabel} billing cycle`}>
        <span className="bhx-comp-cycle-pill-v1" aria-hidden="true" style={{width:pill.width,left:pill.left,opacity:pill.ready?1:0}}/>
        {labels.map((label,index)=><button key={`${label}-${index}`} ref={node=>{buttons.current[index]=node}} type="button" role="tab" id={tabId(index)} aria-controls={panelId} aria-selected={active===index} tabIndex={active===index?0:-1} onClick={()=>select(index)} onKeyDown={event=>keyDown(event,index)}>{label}</button>)}
      </div>
    </div>
    <p className="bhx-comp-sr-only-v1" role="status" aria-live="polite">Showing {labels[active]||labels[0]} comparison pricing</p>
    <PricingComparisonTableV1 plans={plans} rows={rows} activeCycle={active} featureLabel={featureLabel} highlightIndex={highlightIndex} id={panelId} labelledBy={tabId(active)}/>
  </>
}
