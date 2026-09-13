import type {CSSProperties} from 'react'

type AnyMap=Record<string,any>
type CssVars=CSSProperties&Record<`--${string}`,string|number>
const clamp=(v:any,min:number,max:number,f:number)=>Math.max(min,Math.min(max,Number.isFinite(Number(v))?Number(v):f))
const c=(v:any,f='')=>typeof v==='string'&&v?v:(typeof v?.hex==='string'?v.hex:f)
const dir=(v:any)=>({right:'to right',left:'to left',bottom:'to bottom',top:'to top',diag:'135deg'} as Record<string,string>)[String(v||'right')]||'to right'
const shadow=(v:any)=>({soft:'0 8px 22px rgba(0,0,0,.16)',medium:'0 12px 28px rgba(0,0,0,.24)',strong:'0 18px 42px rgba(0,0,0,.34)',glow:'0 0 26px currentColor',floating:'0 16px 35px rgba(0,0,0,.30)',inset:'inset 0 0 0 2px rgba(255,255,255,.12)'} as Record<string,string>)[String(v||'none')]||'none'
const glow=(strength:any,distance:any,color:string)=>{const blur=({soft:10,medium:18,strong:28,neon:38} as Record<string,number>)[String(strength||'medium')]||18;const spread=({tight:0,normal:2,wide:5} as Record<string,number>)[String(distance||'normal')]||2;return `0 0 ${blur}px ${spread}px ${color}`}
const safe=(value:any)=>{
 const raw=String(value??'').trim(); if(!raw)return '#'
 if(raw.startsWith('#')||raw.startsWith('/')||raw.startsWith('./')||raw.startsWith('../'))return raw
 if(/^(https?:|mailto:|tel:)/i.test(raw))return raw
 return '#'
}
function hrefOf(content:AnyMap){
 const action=String(content?.linkType||'custom'), raw=String(content?.link||'').trim()
 if(action==='anchor_down')return raw&&raw!=='#'?safe(raw):'#next'
 if(action==='anchor_up')return raw&&raw!=='#'?safe(raw):'#top'
 if(action==='tel'){const d=raw.replace(/[^+\d]/g,'');return d?`tel:${d}`:'#'}
 if(action==='wa'){if(/^https?:\/\//i.test(raw))return raw;const d=raw.replace(/\D/g,'');return d?`https://wa.me/${d}`:'#'}
 return safe(raw)
}
function ActionIcon({type}:{type?:string}){const t=String(type||'custom');return <span className="bhx-v1-btn-action-icon" aria-hidden="true">{t==='buy'?'🛒':t==='bag'?'🛍':t==='play'?'▶':t==='tel'?'☎':t==='wa'?'✆':t==='anchor_up'?'↑':t==='anchor_down'?'↓':'→'}</span>}
export default function V1SectionButton({content,desktop,mobile,kind='primary'}:{content?:AnyMap;desktop?:AnyMap;mobile?:AnyMap;kind?:'primary'|'secondary'}){
 if(!content)return null
 const mode=String(content.contentMode||'text_icon'),text=String(content.text||'').trim(); if(mode!=='icon'&&!text)return null
 const style=String(desktop?.style||'solid')
 const background=style==='gradient'?`linear-gradient(${dir(desktop?.gradientDirection)},${c(desktop?.gradient1,'#4f46e5')},${c(desktop?.gradient2,'#7c3aed')})`:style==='solid'?c(desktop?.background,kind==='primary'?'#4f46e5':'#fff'):'transparent'
 const hoverType=String(desktop?.hoverType||'simple')
 const hoverBg=hoverType==='gradient'?`linear-gradient(${dir(desktop?.hoverGradientDirection)},${c(desktop?.hoverGradient1,'#4f46e5')},${c(desktop?.hoverGradient2,'#7c3aed')})`:c(desktop?.hoverBackground,'#4338ca')
 const radius=String(desktop?.radiusMode||'all')==='individual'?`${clamp(desktop?.radiusTopLeft,0,200,40)}px ${clamp(desktop?.radiusTopRight,0,200,40)}px ${clamp(desktop?.radiusBottomRight,0,200,40)}px ${clamp(desktop?.radiusBottomLeft,0,200,40)}px`:`${clamp(desktop?.radius,0,200,50)}px`
 const borderType=String(desktop?.borderType||'solid'),bw=clamp(desktop?.borderWidth,0,15,0),borderStyle=borderType==='gradient'?'solid':borderType==='none'?'solid':borderType
 const borderColor=c(desktop?.borderColor,'transparent'),borderGradient=`linear-gradient(${dir(desktop?.borderGradientDirection)},${c(desktop?.borderGradient1,'#4f46e5')},${c(desktop?.borderGradient2,'#7c3aed')})`
 const glowColor=c(desktop?.borderGlowColor,'#4f46e5')
 const vars:CssVars={
  '--bhx-btn-bg':background,'--bhx-btn-color':c(desktop?.color,'#fff'),'--bhx-btn-hover-bg':hoverBg,'--bhx-btn-hover-color':c(desktop?.hoverColor,'#fff'),'--bhx-btn-radius':radius,
  '--bhx-btn-font':`${clamp(desktop?.fontSize,10,60,18)}px`,'--bhx-btn-py':`${clamp(desktop?.paddingY,0,50,14)}px`,'--bhx-btn-px':`${clamp(desktop?.paddingX,0,100,34)}px`,
  '--bhx-btn-font-m':`${clamp(mobile?.fontSize,10,60,16)}px`,'--bhx-btn-py-m':`${clamp(mobile?.paddingY,0,50,12)}px`,'--bhx-btn-px-m':`${clamp(mobile?.paddingX,0,100,28)}px`,
  '--bhx-btn-shadow':shadow(desktop?.shadowPreset),'--bhx-btn-border-style':borderStyle,'--bhx-btn-border-color':borderColor,'--bhx-btn-border-gradient':borderGradient,
  '--bhx-btn-border-top':`${desktop?.borderTop===false?0:bw}px`,'--bhx-btn-border-right':`${desktop?.borderRight===false?0:bw}px`,'--bhx-btn-border-bottom':`${desktop?.borderBottom===false?0:bw}px`,'--bhx-btn-border-left':`${desktop?.borderLeft===false?0:bw}px`,
  '--bhx-btn-duration':`${clamp(desktop?.hoverDuration,100,2000,450)}ms`,'--bhx-btn-slide-color':c(desktop?.hoverSlideColor,'#4f46e5'),'--bhx-btn-border-glow':glow(desktop?.borderGlowStrength,desktop?.borderGlowDistance,glowColor),
  '--bhx-btn-border-speed':String(desktop?.borderAnimationSpeed||'normal')==='slow'?'2.8s':String(desktop?.borderAnimationSpeed||'normal')==='fast'?'.9s':'1.6s'
 }
 const blank=String(content.target||'self')==='blank'
 const classes=[`bhx-v1-button-pro`,`bhx-v1-button-${style}`,`bhx-v1-button-${kind}`,`bhx-v1-hover-${hoverType}`,`bhx-v1-slide-${String(desktop?.hoverSlideDirection||'left')}`,`bhx-v1-motion-${String(desktop?.hoverTextMotion||'none')}`,`bhx-v1-border-${borderType}`,`bhx-v1-border-anim-${String(desktop?.borderAnimation||'none')}`].join(' ')
 return <a className={classes} href={hrefOf(content)} target={blank?'_blank':undefined} rel={blank?'noopener noreferrer':undefined} style={vars}>{mode!=='text'&&<ActionIcon type={content.linkType}/>} {mode!=='icon'&&<span>{text}</span>}</a>
}
