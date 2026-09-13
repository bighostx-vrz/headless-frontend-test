'use client'
import {useEffect,useId,useRef,useState} from 'react'
import {stegaClean} from 'next-sanity'

const clean=(v:any)=>stegaClean(v==null?'':String(v))
const clamp=(v:any,min:number,max:number,fallback:number)=>{const n=Number(v);return Number.isFinite(n)?Math.max(min,Math.min(max,n)):fallback}
const MAX_HTML=153600,MAX_CSS=153600,MAX_JS=102400
function cut(v:any,max:number){const s=clean(v);return new TextEncoder().encode(s).length<=max?s:s.slice(0,max)}
function extract(raw:string,tag:'style'|'script'){
 const found:string[]=[];const re=new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}\\s*>`,'gi')
 const html=raw.replace(re,(_m,b)=>{found.push(String(b||''));return ''});return {html,code:found.join('\n')}
}
function sanitizeHtml(raw:string){
 let html=raw.replace(/<!doctype[^>]*>/gi,'').replace(/<\/?(?:html|head|body)[^>]*>/gi,'')
 html=html.replace(/<(iframe|object|embed|applet|base|meta|link|form|input|textarea|select|option)(\s[^>]*)?>[\s\S]*?<\/\1\s*>/gi,'')
 html=html.replace(/<(iframe|object|embed|applet|base|meta|link|form|input|textarea|select|option)(\s[^>]*)?\/?\s*>/gi,'')
 html=html.replace(/\son[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi,'')
 html=html.replace(/(href|src|xlink:href)\s*=\s*(["'])\s*javascript:[\s\S]*?\2/gi,'$1=$2#$2')
 return html
}
function stylesheetLinks(raw:string){
 const urls:string[]=[];const html=raw.replace(/<link\b[^>]*rel\s*=\s*(["'])?stylesheet\1?[^>]*>/gi,m=>{const hit=m.match(/href\s*=\s*(["'])(.*?)\1/i);if(hit&&/^https:\/\//i.test(hit[2]))urls.push(hit[2]);return ''});return {html,urls}
}
function escapeAttr(v:string){return v.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;')}
function srcDoc(data:any,token:string,allowJs:boolean){
 const htmlRaw=cut(data.codeHtml,MAX_HTML);const cssRaw=cut(data.codeCssV1,MAX_CSS);const jsRaw=cut(data.codeJsV1,MAX_JS)
 const styles=extract(htmlRaw,'style'),scripts=extract(styles.html,'script'),links=stylesheetLinks(scripts.html)
 const body=sanitizeHtml(links.html);const css=[styles.code,cssRaw].filter(Boolean).join('\n').replace(/<\/style/gi,'<\\/style')
 const userJs=allowJs&&data.codeJsEnabledV1===true?[scripts.code,jsRaw].filter(Boolean).join('\n'):''
 const auto=data.codeAutoHeightV1!==false
 const internal=auto?`(()=>{const send=()=>parent.postMessage({bhxCodeHeight:true,token:${JSON.stringify(token)},height:Math.max(document.documentElement.scrollHeight,document.body?.scrollHeight||0)},'*');new ResizeObserver(send).observe(document.documentElement);addEventListener('load',send);setTimeout(send,50)})();`:''
 const script=[internal,userJs].filter(Boolean).join('\n')
 const csp=`default-src 'none'; img-src https: data: blob:; media-src https: data: blob:; font-src https: data:; style-src 'unsafe-inline' https:; ${script?"script-src 'unsafe-inline';":''} connect-src 'none'; object-src 'none'; frame-src 'none'; form-action 'none'; base-uri 'none'`
 const external=links.urls.map(u=>`<link rel="stylesheet" href="${escapeAttr(u)}">`).join('')
 return `<!doctype html><html><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="${csp}"><meta name="viewport" content="width=device-width,initial-scale=1">${external}<style>html,body{margin:0;padding:0;background:transparent}${css}</style></head><body>${body}${script?`<script>${script.replace(/<\/script/gi,'<\\/script')}</script>`:''}</body></html>`
}
function animStyle(kind:string,distance:number):any{
 switch(kind){case'fade_in':return{opacity:0};case'fade_up':return{opacity:0,transform:`translateY(${distance}px)`};case'fade_down':return{opacity:0,transform:`translateY(-${distance}px)`};case'slide_left':return{opacity:0,transform:`translateX(${distance}px)`};case'slide_right':return{opacity:0,transform:`translateX(-${distance}px)`};case'zoom_in':return{opacity:0,transform:'scale(.92)'};case'zoom_out':return{opacity:0,transform:'scale(1.08)'};default:return{}}
}
function useReveal(ref:any,trigger:string){const [on,setOn]=useState(false);useEffect(()=>{const el=ref.current;if(!el)return;const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;if(reduce){setOn(true);return}const io=new IntersectionObserver(([e])=>{if(e.isIntersecting)setOn(true);else if(trigger==='scroll')setOn(false)},{threshold:.08});io.observe(el);return()=>io.disconnect()},[ref,trigger]);return on}

export default function CodeSectionV1({data,allow}:{data:any;allow:boolean}){
 const wrap=useRef<HTMLDivElement>(null),frame=useRef<HTMLIFrameElement>(null),outRef=useRef<HTMLDivElement>(null);const token=`bhx-${useId().replace(/[^a-z0-9_-]/gi,'')}`
 const [mobile,setMobile]=useState(false)
 useEffect(()=>{const mq=window.matchMedia('(max-width:767px)');const sync=()=>setMobile(mq.matches);sync();mq.addEventListener?.('change',sync);return()=>mq.removeEventListener?.('change',sync)},[])
 const sectionKind=String(mobile?data.codeSectionAnimationMobileV1:data.codeSectionAnimationDesktopV1||'none'),sectionTrigger=String(mobile?data.codeSectionAnimationTriggerMobileV1:data.codeSectionAnimationTriggerDesktopV1||'scroll')
 const revealed=useReveal(wrap,sectionTrigger)
 const [height,setHeight]=useState<number|null>(null)
 useEffect(()=>{const on=(e:MessageEvent)=>{if(e.source!==frame.current?.contentWindow||!e.data?.bhxCodeHeight||e.data?.token!==token)return;setHeight(clamp(e.data.height,180,3000,520))};addEventListener('message',on);return()=>removeEventListener('message',on)},[token])
 const dist=clamp(mobile?data.codeSectionAnimationDistanceMobileV1:data.codeSectionAnimationDistanceDesktopV1,0,1000,80),dur=clamp(mobile?data.codeSectionAnimationDurationMobileV1:data.codeSectionAnimationDurationDesktopV1,0,10,.8),delay=clamp(mobile?data.codeSectionAnimationDelayMobileV1:data.codeSectionAnimationDelayDesktopV1,0,10,0)
 const outKind=String(mobile?data.codeOutputAnimationMobileV1:data.codeOutputAnimationDesktopV1||'none'),outTrigger=String(mobile?data.codeOutputTriggerMobileV1:data.codeOutputTriggerDesktopV1||'scroll');const outOn=useReveal(outRef,outTrigger)
 const outDist=clamp(mobile?data.codeOutputDistanceMobileV1:data.codeOutputDistanceDesktopV1,0,1000,80),outDur=clamp(mobile?data.codeOutputDurationMobileV1:data.codeOutputDurationDesktopV1,0,10,.8),outDelay=clamp(mobile?data.codeOutputDelayMobileV1:data.codeOutputDelayDesktopV1,0,10,0)
 const top=Number(mobile?data.codeOutputTopMobileV1:data.codeOutputTopDesktopV1||0),bottom=Number(mobile?data.codeOutputBottomMobileV1:data.codeOutputBottomDesktopV1||0),left=Number(mobile?data.codeOutputLeftMobileV1:data.codeOutputLeftDesktopV1||0),right=Number(mobile?data.codeOutputRightMobileV1:data.codeOutputRightDesktopV1||0)
 const topUnit=clean(mobile?data.codeOutputTopUnitMobileV1:data.codeOutputTopUnitDesktopV1||'px'),bottomUnit=clean(mobile?data.codeOutputBottomUnitMobileV1:data.codeOutputBottomUnitDesktopV1||'px'),leftUnit=clean(mobile?data.codeOutputLeftUnitMobileV1:data.codeOutputLeftUnitDesktopV1||'px'),rightUnit=clean(mobile?data.codeOutputRightUnitMobileV1:data.codeOutputRightUnitDesktopV1||'px')
 const align=String(mobile?data.codeAlignMobileV1:data.codeAlignDesktopV1||data.codeAlignmentV1||'center'),width=mobile?`${clamp(data.codeMaxWidthMobileV1,20,100,100)}%`:(String(data.codeContentWidthV1||'boxed')==='full'?'100%':`${clamp(data.codeMaxWidthDesktopV1,320,2200,1200)}px`)
 const baseH=mobile?clamp(data.codeFrameHeightMobileV1,180,3000,460):clamp(data.codeFrameHeightDesktopV1,180,3000,520),minH=mobile?clamp(data.codeMinHeightMobileV1,0,3000,0):clamp(data.codeMinHeightDesktopV1,0,3000,0)
 const hover=String(mobile?data.codeOutputHoverMobileV1:data.codeOutputHoverDesktopV1||'none'),glow=(mobile?data.codeOutputHoverColorMobileV1:data.codeOutputHoverColorDesktopV1)?.hex||'#4f46e5'
 const pos:any={position:'relative',top:`${top}${topUnit}`,bottom:`${bottom}${bottomUnit}`,left:`${left}${leftUnit}`,right:`${right}${rightUnit}`,zIndex:Number(mobile?data.codeOutputZIndexMobileV1:data.codeOutputZIndexDesktopV1||1)}
 const margin=align==='left'?'0 auto 0 0':align==='right'?'0 0 0 auto':'0 auto'
 const sandbox=data.codeJsEnabledV1===true||data.codeAutoHeightV1!==false?'allow-scripts':''
 if(!allow)return <div className="bhx-code-disabled" role="note">Advanced Code output is disabled by the server policy.</div>
 return <div ref={wrap} className="bhx-code-section-v1" style={{...(revealed?{}:animStyle(sectionKind,dist)),transition:`opacity ${dur}s ease ${delay}s, transform ${dur}s ease ${delay}s`}}><div ref={outRef} className={`bhx-code-output bhx-code-hover-${hover}`} style={{...pos,width,margin,minHeight:minH,overflow:String(data.codeOverflowV1||'visible') as any,...(outOn?{}:animStyle(outKind,outDist)),transition:`opacity ${outDur}s ease ${outDelay}s, transform ${outDur}s ease ${outDelay}s, box-shadow .25s ease`,['--bhx-code-glow' as any]:glow}}><iframe ref={frame} title="Custom Code Section" sandbox={sandbox} referrerPolicy="no-referrer" loading="lazy" srcDoc={srcDoc(data,token,allow)} style={{display:'block',width:'100%',height:(data.codeAutoHeightV1!==false&&height)?height:baseH,minHeight:minH,border:0,background:'transparent'}}/></div></div>
}
