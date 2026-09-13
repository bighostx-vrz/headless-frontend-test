import {stegaClean} from 'next-sanity'
import {urlFor} from '@/sanity/lib/image'
const clean=(v:any)=>stegaClean(v==null?'':String(v))
const color=(v:any,fallback='')=>v?.hex?clean(v.hex):fallback
const imageUrl=(image:any,w=2200,h=1400)=>image?.asset?urlFor(image).width(w).height(h).url():''
const clamp=(n:any,min:number,max:number,fallback:number)=>{const x=Number(n);return Number.isFinite(x)?Math.max(min,Math.min(max,x)):fallback}
const esc=(s:string)=>s.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
const dataUri=(svg:string)=>`data:image/svg+xml,${encodeURIComponent(svg)}`

function motif(style:string,colorHex:string,opacity:number,rotation:number){
 const c=esc(colorHex),o=clamp(opacity,0,1,.35),r=clamp(rotation,-180,180,0)
 const common=`fill="${c}" fill-opacity="${o}" stroke="${c}" stroke-opacity="${o}" transform="rotate(${r} 50 50)"`
 const line=`stroke="${c}" stroke-opacity="${o}" stroke-width="5" fill="none" transform="rotate(${r} 50 50)"`
 switch(style){
  case'grid':return `<path d="M0 0H100M0 50H100M0 100H100M0 0V100M50 0V100M100 0V100" ${line}/>`
  case'dashed_grid':return `<path d="M0 0H100M0 50H100M0 100H100M0 0V100M50 0V100M100 0V100" ${line} stroke-dasharray="8 8"/>`
  case'diagonal_lines':return `<path d="M-25 25L25-25M-25 75L75-25M-25 125L125-25M25 125L125 25M75 125L125 75" ${line}/>`
  case'horizontal_lines':return `<path d="M0 20H100M0 50H100M0 80H100" ${line}/>`
  case'vertical_lines':return `<path d="M20 0V100M50 0V100M80 0V100" ${line}/>`
  case'crosshatch':return `<path d="M-20 20L20-20M-20 70L70-20M0 120L120 0M30 120L120 30M80 120L120 80M80-20L120 20M30-20L120 70M-20 0L100 120M-20 50L50 120M-20 100L0 120" ${line}/>`
  case'checker':return `<path d="M0 0H50V50H0ZM50 50H100V100H50Z" ${common}/>`
  case'brick':return `<path d="M0 0H100V50H0ZM0 50H100M50 0V50M25 50V100M75 50V100M0 100H100" ${line}/>`
  case'chevron':case'zigzag':return `<path d="M-10 35L25 65L60 35L95 65L130 35M-10 85L25 115L60 85L95 115L130 85" ${line}/>`
  case'waves':return `<path d="M-20 25Q5 0 30 25T80 25T130 25M-20 75Q5 50 30 75T80 75T130 75" ${line}/>`
  case'scales':return `<path d="M0 30Q25 70 50 30Q75 70 100 30M-25 80Q0 120 25 80Q50 120 75 80Q100 120 125 80" ${line}/>`
  case'honeycomb':return `<path d="M25 5L50 20V50L25 65L0 50V20ZM75 5L100 20V50L75 65L50 50V20ZM50 50L75 65V95L50 110L25 95V65" ${line}/>`
  case'lattice':return `<path d="M0 25L25 0L50 25L25 50ZM50 25L75 0L100 25L75 50ZM0 75L25 50L50 75L25 100ZM50 75L75 50L100 75L75 100Z" ${line}/>`
  case'concentric_rings':return `<circle cx="50" cy="50" r="12" ${line}/><circle cx="50" cy="50" r="28" ${line}/><circle cx="50" cy="50" r="44" ${line}/>`
  case'circuit':return `<path d="M5 20H40V45H75V15H95M15 80H55V60H90M25 5V25M70 75V95" ${line}/><circle cx="40" cy="45" r="6" ${common}/><circle cx="75" cy="15" r="6" ${common}/><circle cx="55" cy="60" r="6" ${common}/>`
  case'staggered_dots':return `<circle cx="20" cy="20" r="10" ${common}/><circle cx="70" cy="55" r="10" ${common}/><circle cx="20" cy="90" r="10" ${common}/>`
  case'ring':return `<circle cx="50" cy="50" r="31" ${line}/>`
  case'oval':return `<ellipse cx="50" cy="50" rx="38" ry="24" ${common}/>`
  case'square':return `<rect x="18" y="18" width="64" height="64" ${common}/>`
  case'rounded_square':return `<rect x="18" y="18" width="64" height="64" rx="16" ${common}/>`
  case'capsule':return `<rect x="10" y="30" width="80" height="40" rx="20" ${common}/>`
  case'diamond':return `<path d="M50 10L90 50L50 90L10 50Z" ${common}/>`
  case'triangle':return `<path d="M50 10L92 88H8Z" ${common}/>`
  case'star':return `<path d="M50 7L62 36L94 38L69 58L77 90L50 72L23 90L31 58L6 38L38 36Z" ${common}/>`
  case'sparkle':return `<path d="M50 5Q55 40 95 50Q55 60 50 95Q45 60 5 50Q45 40 50 5Z" ${common}/>`
  case'plus':return `<path d="M38 10H62V38H90V62H62V90H38V62H10V38H38Z" ${common}/>`
  case'hexagon':return `<path d="M25 10H75L95 50L75 90H25L5 50Z" ${common}/>`
  case'arch':return `<path d="M15 88V50A35 35 0 0 1 85 50V88Z" ${common}/>`
  case'heart':return `<path d="M50 88C40 75 10 58 10 35C10 13 38 10 50 30C62 10 90 13 90 35C90 58 60 75 50 88Z" ${common}/>`
  case'crescent':return `<path d="M70 12A40 40 0 1 0 70 88A33 33 0 0 1 70 12Z" ${common}/>`
  case'teardrop':return `<path d="M50 7C50 7 85 47 85 67A35 35 0 1 1 15 67C15 47 50 7 50 7Z" ${common}/>`
  case'flower':return `<path d="M50 35C30 5 10 25 35 50C5 70 30 95 50 65C70 95 95 70 65 50C90 25 70 5 50 35Z" ${common}/>`
  case'organic':return `<path d="M20 30C30 5 70 8 82 28C95 50 75 88 42 90C12 92 2 58 20 30Z" ${common}/>`
  case'circle':case'dots':default:return `<circle cx="50" cy="50" r="18" ${common}/>`
 }
}
function seedFloat(seed:number,index:number,channel:number){let x=(seed>>>0)^(index*2654435761)^(channel*1597334677);x^=x<<13;x^=x>>>17;x^=x<<5;return (x>>>0)/4294967295}
function patternCss(data:any){
 let mode=String(data.patternModeV1||'repeat');if(mode==='repeat'&&String(data.patternVariationV1||'uniform')==='random')mode='scatter'
 const style=String(data.patternTypeV1||'dots'),bg=color(data.patternBackgroundColorV1,color(data.backgroundColor,'#f8fafc')),fg=color(data.patternColorV1,'#4f46e5')
 const size=clamp(data.patternSizeV1,4,1200,mode==='single'?360:18),sx=clamp(data.patternSpacingXV1,0,400,24),sy=clamp(data.patternSpacingYV1,0,400,24),ox=clamp(data.patternOffsetXV1,-500,500,0),oy=clamp(data.patternOffsetYV1,-500,500,0),op=clamp(data.patternOpacityV1,0,1,.35),rot=clamp(data.patternRotationV1,-180,180,0)
 if(mode==='single'){
  const posMap:Record<string,string>={'top-left':'0% 0%','top-center':'50% 0%','top-right':'100% 0%','center-left':'0% 50%',center:'50% 50%','center-right':'100% 50%','bottom-left':'0% 100%','bottom-center':'50% 100%','bottom-right':'100% 100%'}
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">${motif(style,fg,op,rot)}</svg>`
  const [px,py]=(posMap[String(data.patternPositionV1||'center')]||'50% 50%').split(' ');return `background-color:${bg};background-image:url("${dataUri(svg)}");background-repeat:no-repeat;background-size:${size}px ${size}px;background-position:calc(${px} + ${ox}px) calc(${py} + ${oy}px);`
 }
 if(mode==='scatter'){
  const seed=Math.floor(clamp(data.patternRandomSeedV1,1,2147483647,48271)),density=String(data.patternScatterDensityV1||'balanced'),n=density==='sparse'?18:density==='dense'?54:32,strength=String(data.patternVariationStrengthV1||'balanced'),spread=strength==='subtle'?.16:strength==='bold'?.45:.3
  let items='';for(let i=0;i<n;i++){const x=4+seedFloat(seed,i,1)*92,y=4+seedFloat(seed,i,2)*92,scale=data.patternRandomSizeV1===false?1:(1-spread)+seedFloat(seed,i,3)*spread*2,rr=data.patternRandomRotationV1===false?rot:rot+(seedFloat(seed,i,4)*2-1)*(strength==='bold'?75:strength==='subtle'?18:40),oo=data.patternRandomOpacityV1===false?op:Math.max(.02,op*((1-spread)+seedFloat(seed,i,5)*spread*2));items+=`<g transform="translate(${x-5} ${y-5}) scale(${Math.max(.15,scale)*.1})">${motif(style,fg,oo,rr)}</g>`}
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">${items}</svg>`
  return `background-color:${bg};background-image:url("${dataUri(svg)}");background-repeat:no-repeat;background-size:cover;background-position:calc(50% + ${ox}px) calc(50% + ${oy}px);`
 }
 const tileW=Math.max(4,size+sx),tileH=Math.max(4,size+sy);const scale=Math.min(size/tileW,size/tileH);const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${tileW}" height="${tileH}" viewBox="0 0 100 100"><g transform="translate(${(100-100*scale)/2} ${(100-100*scale)/2}) scale(${scale})">${motif(style,fg,op,rot)}</g></svg>`
 return `background-color:${bg};background-image:url("${dataUri(svg)}");background-repeat:repeat;background-size:${tileW}px ${tileH}px;background-position:${ox}px ${oy}px;`
}
export function sectionBackgroundCss(data:any){
 const t=String(data.backgroundType||'color')
 if(t==='transparent')return 'background:transparent;'
 if(t==='color'){const c=String(data.sectionType||'')==='code'?color(data.codeBackgroundTintColorV1,'#f8fafc'):color(data.backgroundColor);return c?`background:${c};`:''}
 if(t==='gradient'){
  const a=color(data.gradientFrom,'transparent'),b=color(data.gradientTo,'transparent'),start=clamp(data.gradientStartV1,0,100,0),end=clamp(data.gradientEndV1,0,100,100),dir=String(data.gradientDirectionV1||'')
  if(dir==='radial')return `background:radial-gradient(circle,${a} ${start}%,${b} ${end}%);`
  if(dir==='bottom')return `background:linear-gradient(to bottom,${a} ${start}%,${b} ${end}%);`
  if(dir==='right')return `background:linear-gradient(to right,${a} ${start}%,${b} ${end}%);`
  return `background:linear-gradient(${clamp(data.gradientAngle,0,360,135)}deg,${a},${b});`
 }
 if(t==='pattern')return patternCss(data)
 if(t==='image'&&data.backgroundImage?.asset){const u=imageUrl(data.backgroundImage);const code=String(data.sectionType||'')==='code';const op=clamp(code?data.codeBackgroundOverlayOpacityV1:data.overlayOpacity,0,1,code?0.6:0);const op2=clamp(code?data.codeBackgroundOverlayOpacity2V1:op,0,1,op);const tint=color(code?data.codeBackgroundTintColorV1:data.backgroundColor,'#000000');const g1=color(data.codeBackgroundGradient1V1,'#4f46e5'),g2=color(data.codeBackgroundGradient2V1,'#db2777'),gs=clamp(data.codeBackgroundGradientStartV1,0,100,0),ge=clamp(data.codeBackgroundGradientEndV1,0,100,100),gd=String(data.codeBackgroundGradientDirectionV1||'right');const style=code?String(data.codeBackgroundImageStyleV1||'cover'):'cover';let layer='';if(op){if(code&&String(data.codeBackgroundOverlayTypeV1||'solid')==='gradient'){const c1=`${g1}${Math.round(op*255).toString(16).padStart(2,'0')}`,c2=`${g2}${Math.round(op2*255).toString(16).padStart(2,'0')}`;layer=gd==='radial'?`radial-gradient(circle,${c1} ${gs}%,${c2} ${ge}%),`:gd==='bottom'?`linear-gradient(to bottom,${c1} ${gs}%,${c2} ${ge}%),`:`linear-gradient(to right,${c1} ${gs}%,${c2} ${ge}%),`}else layer=`linear-gradient(${tint}${Math.round(op*255).toString(16).padStart(2,'0')},${tint}${Math.round(op*255).toString(16).padStart(2,'0')}),`;} return `background-image:${layer}url("${u}");background-size:${style==='tiling'?'auto':'cover'};background-repeat:${style==='tiling'?'repeat':'no-repeat'};background-attachment:${style==='parallax'?'fixed':'scroll'};background-position:center;`}
 if(t==='split')return 'background:transparent;'
 return ''
}
