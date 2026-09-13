import {stegaClean} from 'next-sanity'
import {urlFor} from '@/sanity/lib/image'
import CodeBackgroundVideoV1 from './CodeBackgroundVideoV1'

const clean=(v:any)=>stegaClean(v==null?'':String(v))
const color=(v:any,fallback='')=>v?.hex?clean(v.hex):fallback
const imageUrl=(image:any,w=2200,h=1400)=>image?.asset?urlFor(image).width(w).height(h).url():''
const safeMedia=(v:any)=>{const raw=clean(v).trim();return /^(https?:)\/\//i.test(raw)?raw:''}
const token=(v:any)=>clean(v).toLowerCase().replace(/[^a-z0-9_-]+/g,'-')
function alphaColor(hex:string,opacity:number){const h=String(hex||'').replace('#','');if(!/^[0-9a-f]{6}$/i.test(h))return hex;const r=parseInt(h.slice(0,2),16),g=parseInt(h.slice(2,4),16),b=parseInt(h.slice(4,6),16);return `rgba(${r},${g},${b},${Math.max(0,Math.min(1,opacity))})`}

function Divider({data,position}:{data:any;position:'top'|'bottom'}){
 const cap=position==='top'?'Top':'Bottom'
 const style=String(data[`shape${cap}StyleV1`]||data[`shapeDivider${cap}`]||'none')
 if(!style||style==='none')return null
 const c=color(data[`shape${cap}ColorV1`],'#ffffff')
 const h=Math.max(1,Math.min(400,Number(data[`shape${cap}HeightV1`]||100)))
 const mh=data[`shape${cap}MobileHeightV1`]
 const opacity=Math.max(0,Math.min(1,Number(data[`shape${cap}OpacityV1`]??1)))
 const direction=String(data[`shape${cap}DirectionV1`]||'normal')
 return <span aria-hidden="true" className={`bhx-v1-shape-divider bhx-v1-shape-${position} bhx-v1-shape-${token(style)} ${direction==='invert'?'is-inverted':''}`} style={{'--bhx-divider-color':c,'--bhx-divider-height':`${h}px`,'--bhx-divider-mobile-height':`${Math.max(1,Math.min(400,Number(mh||h)))}px`,'--bhx-divider-opacity':opacity} as any}/>
}

export default function SectionBackgroundChromeV1({data}:{data:any}){
 const type=String(data.backgroundType||'color')
 const video=safeMedia(data.backgroundVideoUrl)
 const isCode=String(data.sectionType||'')==='code';const overlay=Math.max(0,Math.min(1,Number(isCode?(data.codeBackgroundOverlayOpacityV1??.6):(data.overlayOpacity||0))));const overlay2=Math.max(0,Math.min(1,Number(isCode?(data.codeBackgroundOverlayOpacity2V1??.6):overlay)))
 const splitType=String(data.splitFillTypeV1||'color')
 const c1=color(data.splitColor1V1||data.backgroundColor,'#ffffff')
 const c2=color(data.splitColor2V1||data.backgroundColor2,'#4f46e5')
 const op1=Math.max(0,Math.min(1,Number(data.splitTintOpacity1V1??.6)))
 const op2=Math.max(0,Math.min(1,Number(data.splitTintOpacity2V1??.6)))
 const i1=splitType==='image'?imageUrl(data.splitImage1V1):''
 const i2=splitType==='image'?imageUrl(data.splitImage2V1):''
 const layer=(img:string,c:string,op:number)=>({backgroundImage:img?`linear-gradient(${c}${Math.round(op*255).toString(16).padStart(2,'0')},${c}${Math.round(op*255).toString(16).padStart(2,'0')}),url("${img}")`:undefined,backgroundColor:img?undefined:c} as any)
 const og1=alphaColor(color(data.codeBackgroundGradient1V1,'#4f46e5'),overlay),og2=alphaColor(color(data.codeBackgroundGradient2V1,'#db2777'),overlay2);const overlayStyle:any=isCode&&String(data.codeBackgroundOverlayTypeV1||'solid')==='gradient'?{opacity:1,background:String(data.codeBackgroundGradientDirectionV1||'right')==='radial'?`radial-gradient(circle, ${og1} ${Number(data.codeBackgroundGradientStartV1||0)}%, ${og2} ${Number(data.codeBackgroundGradientEndV1||100)}%)`:String(data.codeBackgroundGradientDirectionV1||'right')==='bottom'?`linear-gradient(to bottom, ${og1} ${Number(data.codeBackgroundGradientStartV1||0)}%, ${og2} ${Number(data.codeBackgroundGradientEndV1||100)}%)`:`linear-gradient(to right, ${og1} ${Number(data.codeBackgroundGradientStartV1||0)}%, ${og2} ${Number(data.codeBackgroundGradientEndV1||100)}%)`}:{opacity:overlay,background:isCode?color(data.codeBackgroundTintColorV1,'#f8fafc'):'#000'}
 return <>
   {type==='video'&&video?(String(data.sectionType||'')==='code'?<CodeBackgroundVideoV1 data={data}/>:<video className="bhx-v1-background-video" autoPlay muted loop playsInline preload="metadata"><source src={video}/></video>):null}
   {type==='video'&&overlay>0?<span className="bhx-v1-background-overlay" style={overlayStyle}/>:null}
   {type==='split'?<div className="bhx-v1-split-bg" aria-hidden="true"><span className="bhx-v1-split-layer bhx-v1-split-one" style={layer(i1,c1,op1)}/><span className="bhx-v1-split-layer bhx-v1-split-two" style={layer(i2,c2,op2)}/></div>:null}
   <Divider data={data} position="top"/><Divider data={data} position="bottom"/>
 </>
}
