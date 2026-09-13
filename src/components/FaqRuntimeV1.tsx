'use client'

import {useMemo,useState} from 'react'

type FaqItem={_key?:string;question?:string;answer?:string;openByDefault?:boolean}

function FaqIcon({style,open}:{style:string;open:boolean}){
  if(style==='chevron')return <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M5 8l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
  if(style==='arrow')return <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M10 4v11M6 11l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
  return <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M4 10h12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path className="bhx-faq-icon-vertical" d="M10 4v12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
}

export default function FaqRuntimeV1({items,allowMultiple=false,iconStyle='plus',scope}:{items:FaqItem[];allowMultiple?:boolean;iconStyle?:string;scope:string}){
  const safeStyle=['plus','chevron','arrow'].includes(String(iconStyle))?String(iconStyle):'plus'
  const defaults=useMemo(()=>items.reduce<number[]>((acc,item,index)=>{if(item?.openByDefault)acc.push(index);return acc},[]),[items])
  const [open,setOpen]=useState<number[]>(()=>allowMultiple?defaults:defaults.slice(0,1))
  const toggle=(index:number)=>setOpen(previous=>previous.includes(index)?previous.filter(x=>x!==index):(allowMultiple?[...previous,index]:[index]))
  if(!items.length)return <div className="bhx-faq-empty" role="status">No FAQ items added yet.</div>
  return <div className={`bhx-faq-v1 bhx-faq-icon-${safeStyle}`} data-bhx-faq-runtime-v1="true">
    {items.map((item,index)=>{
      const active=open.includes(index)
      const key=item?._key||`faq-${index}`
      const buttonId=`${scope}-faq-button-${index}`
      const panelId=`${scope}-faq-panel-${index}`
      return <div className={`bhx-faq-row${active?' is-open':''}`} key={key}>
        <h3 className="bhx-faq-question-heading">
          <button id={buttonId} type="button" aria-expanded={active} aria-controls={panelId} onClick={()=>toggle(index)}>
            <span className="bhx-faq-question">{item?.question||`Question ${index+1}`}</span>
            <span className={`bhx-faq-icon${active?' is-open':''}`} data-icon-style={safeStyle}><FaqIcon style={safeStyle} open={active}/></span>
          </button>
        </h3>
        <div id={panelId} role="region" aria-labelledby={buttonId} hidden={!active} className="bhx-faq-answer-panel">
          {item?.answer?<p className="bhx-faq-answer">{item.answer}</p>:null}
        </div>
      </div>
    })}
  </div>
}
