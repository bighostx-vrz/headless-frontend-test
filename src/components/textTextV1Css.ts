import {stegaClean} from 'next-sanity'

const clean=(v:any)=>stegaClean(v==null?'':String(v))
const num=(v:any,f:number,min=-99999,max=99999)=>Math.max(min,Math.min(max,Number.isFinite(Number(v))?Number(v):f))
const token=(v:any,f='')=>{const t=clean(v||f).toLowerCase().replace(/[^a-z0-9_-]+/g,'-');return t||f}
const color=(v:any,f='')=>{const raw=typeof v==='string'?clean(v):clean(v?.hex||'');return /^#[0-9a-f]{3,8}$/i.test(raw)||/^(?:rgb|hsl)a?\([^)]+\)$/i.test(raw)?raw:f}
const unit=(v:any)=>['px','%','em','rem','vw','vh'].includes(clean(v))?clean(v):'px'
const font=(v:any)=>{const raw=clean(v||'inherit').replace(/[^a-zA-Z0-9\s,'"_-]/g,'').trim();return raw||'inherit'}
const weight=(v:any)=>{const raw=clean(v||'inherit');return /^(?:inherit|300|400|500|600|700|800|900)$/.test(raw)?raw:'inherit'}
const align=(v:any,f='left')=>['left','center','right'].includes(clean(v))?clean(v):f
const vertical=(v:any,f='top')=>['top','center','bottom'].includes(clean(v))?clean(v):f
const justify=(v:string)=>v==='center'?'center':v==='bottom'?'flex-end':'flex-start'

function shadowPreset(v:any,style:string){
 const s=token(v,'auto')
 if(s==='none')return 'none'
 if(s==='light')return '0 8px 24px rgba(15,23,42,.08)'
 if(s==='medium')return '0 14px 34px rgba(15,23,42,.14)'
 if(s==='heavy')return '0 22px 54px rgba(15,23,42,.22)'
 if(style==='glass_panel')return '0 18px 44px rgba(15,23,42,.16)'
 if(style==='card'||style==='soft_panel')return '0 10px 30px rgba(15,23,42,.08)'
 return 'none'
}
function radius(v:any){const r=clean(v||'global');if(r==='global')return 'var(--card-radius,16px)';return `${num(r,16,0,200)}px`}
function blockBackground(data:any,col:1|2,mobile=false){
 const p=`textTextCol${col}Block`
 const style=token(data[`${p}StyleDesktopV1`],'plain')
 if(style==='plain')return 'transparent'
 const desktopType=token(data[`${p}BackgroundTypeDesktopV1`],'')
 const type=token(data[`${p}BackgroundType${mobile?'Mobile':'Desktop'}V1`],mobile?desktopType:'')
 const typeEff=type||desktopType||'solid'
 const fallback=style==='soft_panel'?'rgba(79,70,229,.055)':style==='glass_panel'?'rgba(255,255,255,.16)':style==='outline_panel'?'transparent':'#ffffff'
 const desktopColor=color(data[`${p}BackgroundColorDesktopV1`],fallback)
 const c=color(data[`${p}BackgroundColor${mobile?'Mobile':'Desktop'}V1`],mobile?desktopColor:fallback)
 const df=color(data[`${p}BackgroundGradientFromDesktopV1`],c||'#ffffff')
 const dt=color(data[`${p}BackgroundGradientToDesktopV1`],style==='soft_panel'?'#f5f3ff':'#f8fafc')
 const da=num(data[`${p}BackgroundGradientAngleDesktopV1`],135,0,360)
 const gf=color(data[`${p}BackgroundGradientFrom${mobile?'Mobile':'Desktop'}V1`],mobile?df:c||'#ffffff')
 const gt=color(data[`${p}BackgroundGradientTo${mobile?'Mobile':'Desktop'}V1`],mobile?dt:'#f8fafc')
 const ga=num(data[`${p}BackgroundGradientAngle${mobile?'Mobile':'Desktop'}V1`],mobile?da:135,0,360)
 if(typeEff==='gradient')return `linear-gradient(${ga}deg,${gf},${gt})`
 if(typeEff==='transparent'||typeEff==='none')return 'transparent'
 return c||fallback
}
function blockCss(id:string,data:any,col:1|2){
 const p=`textTextCol${col}Block`
 const style=token(data[`${p}StyleDesktopV1`],'plain')
 const active=style!=='plain'
 const borderDefault=style==='outline_panel'?1:0
 const borderW=num(data[`${p}BorderWidthDesktopV1`],borderDefault,0,20)
 const borderC=color(data[`${p}BorderColorDesktopV1`],style==='outline_panel'?'rgba(79,70,229,.38)':'rgba(148,163,184,.32)')
 const hover=token(data[`${p}HoverDesktopV1`],'none')
 const bg=blockBackground(data,col,false),mbg=blockBackground(data,col,true)
 const pt=num(data[`${p}PaddingTopDesktopV1`],28,0,200),pr=num(data[`${p}PaddingRightDesktopV1`],28,0,200),pb=num(data[`${p}PaddingBottomDesktopV1`],28,0,200),pl=num(data[`${p}PaddingLeftDesktopV1`],28,0,200)
 const mpt=num(data[`${p}PaddingTopMobileV1`],22,0,200),mpr=num(data[`${p}PaddingRightMobileV1`],22,0,200),mpb=num(data[`${p}PaddingBottomMobileV1`],22,0,200),mpl=num(data[`${p}PaddingLeftMobileV1`],22,0,200)
 const minH=num(data[`${p}MinHeightDesktopV1`],0,0,2000),mMinH=num(data[`${p}MinHeightMobileV1`],0,0,2000)
 const va=justify(vertical(data[`${p}VerticalAlignDesktopV1`],'top')),mva=justify(vertical(data[`${p}VerticalAlignMobileV1`],vertical(data[`${p}VerticalAlignDesktopV1`],'top')))
 return `#${id} .bhx-texttext-col-${col}{background:${active?bg:'transparent'};${active?`border:${borderW}px solid ${borderC};border-radius:${radius(data[`${p}RadiusDesktopV1`])};box-shadow:${shadowPreset(data[`${p}ShadowDesktopV1`],style)};padding:${pt}px ${pr}px ${pb}px ${pl}px;`:''}min-height:${minH}px;justify-content:${va};${style==='glass_panel'?'backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);':''}${hover!=='none'?'transition:transform .24s ease,box-shadow .24s ease,border-color .24s ease;':''}}
@media(hover:hover) and (pointer:fine){#${id} .bhx-texttext-col-${col}.bhx-tt-block-hover-lift:hover{transform:translateY(-6px)}#${id} .bhx-texttext-col-${col}.bhx-tt-block-hover-scale:hover{transform:scale(1.025)}#${id} .bhx-texttext-col-${col}.bhx-tt-block-hover-brand_outline_glow:hover{box-shadow:0 0 0 2px var(--bhx-accent,#4f46e5),0 18px 42px color-mix(in srgb,var(--bhx-accent,#4f46e5) 24%,transparent)}}
@media(max-width:768px){#${id} .bhx-texttext-col-${col}{background:${active?mbg:'transparent'};${active?`padding:${mpt}px ${mpr}px ${mpb}px ${mpl}px;`:''}min-height:${mMinH}px;justify-content:${mva}}}`
}
function textCss(id:string,data:any,col:1|2){
 const p=`textTextCol${col}`
 const desktopAlign=align(data[`${p}TextAlignDesktopV1`],'left'),mobileAlign=align(data[`${p}TextAlignMobileV1`],desktopAlign)
 const kickerC=color(data[`${p}KickerColorV1`],'inherit'),headlineC=color(data[`${p}HeadlineColorV1`],'inherit'),textC=color(data[`${p}TextColorV1`],'inherit'),linkC=color(data[`${p}ReadMoreLinkColorV1`],color(data.accentColor,'var(--bhx-accent,#4f46e5)'))
 const kds=num(data[`${p}KickerSizeDesktopV1`],14,8,120),hds=num(data[`${p}HeadlineSizeDesktopV1`],36,10,160),tds=num(data[`${p}TextSizeDesktopV1`],17,8,80),rds=num(data[`${p}ReadMoreLinkSizeDesktopV1`],15,8,80)
 const kms=num(data[`${p}KickerSizeMobileV1`],kds,8,120),hms=num(data[`${p}HeadlineSizeMobileV1`],Math.min(hds,32),10,160),tms=num(data[`${p}TextSizeMobileV1`],tds,8,80),rms=num(data[`${p}ReadMoreLinkSizeMobileV1`],rds,8,80)
 const readA=align(data[`${p}ReadMoreAlignDesktopV1`],desktopAlign),readM=align(data[`${p}ReadMoreAlignMobileV1`],mobileAlign)
 return `#${id} .bhx-texttext-col-${col}{text-align:${desktopAlign}}#${id} .bhx-texttext-col-${col} .bhx-tt-kicker{color:${kickerC};font-family:${font(data[`${p}KickerFontFamilyV1`])};font-weight:${weight(data[`${p}KickerFontWeightV1`])};font-size:${kds}px}#${id} .bhx-texttext-col-${col} .bhx-tt-headline{color:${headlineC};font-family:${font(data[`${p}HeadlineFontFamilyV1`])};font-weight:${weight(data[`${p}HeadlineFontWeightV1`])};font-size:${hds}px}#${id} .bhx-texttext-col-${col} .bhx-tt-paragraph{color:${textC};font-family:${font(data[`${p}TextFontFamilyV1`])};font-weight:${weight(data[`${p}TextFontWeightV1`])};font-size:${tds}px}#${id} .bhx-texttext-col-${col} .bhx-tt-readmore{font-size:${rds}px;color:${linkC};text-align:${readA}}#${id} .bhx-texttext-col-${col} .bhx-tt-readmore summary,#${id} .bhx-texttext-col-${col} .bhx-tt-readmore-button{color:${linkC}}
@media(max-width:768px){#${id} .bhx-texttext-col-${col}{text-align:${mobileAlign}}#${id} .bhx-texttext-col-${col} .bhx-tt-kicker{font-size:${kms}px}#${id} .bhx-texttext-col-${col} .bhx-tt-headline{font-size:${hms}px}#${id} .bhx-texttext-col-${col} .bhx-tt-paragraph{font-size:${tms}px}#${id} .bhx-texttext-col-${col} .bhx-tt-readmore{font-size:${rms}px;text-align:${readM}}}`
}
function decorCss(id:string,data:any,col:1|2){
 const p=`textTextCol${col}`
 const enabled=data[`${p}DecorLineEnabledV1`]===true
 if(!enabled)return `#${id} .bhx-texttext-col-${col} .bhx-tt-decor{display:none}`
 const style=token(data[`${p}DecorLineStyleV1`],'solid'),c=color(data[`${p}DecorLineColorV1`],color(data.accentColor,'#4f46e5'))
 const w=num(data[`${p}DecorLineWidthDesktopV1`],72,0,1000),h=num(data[`${p}DecorLineHeightDesktopV1`],3,1,100),mw=num(data[`${p}DecorLineWidthMobileV1`],w,0,1000),mh=num(data[`${p}DecorLineHeightMobileV1`],h,1,100)
 const a=align(data[`${p}DecorLineAlignDesktopV1`],'left'),ma=align(data[`${p}DecorLineAlignMobileV1`],a)
 const margin=(x:string)=>x==='center'?'0 auto':x==='right'?'0 0 0 auto':'0 auto 0 0'
 const glow=num(data[`${p}DecorLineGlowStrengthV1`],18,0,100),dot=num(data[`${p}DecorLineDotSizeV1`],6,1,100),dotGap=num(data[`${p}DecorLineDotGapV1`],8,0,200),split=num(data[`${p}DecorLineSplitCenterGapV1`],18,0,500),skew=num(data[`${p}DecorLineWaveSkewV1`],0,-90,90),angle=num(data[`${p}DecorLineAngleV1`],0,-180,180)
 return `#${id} .bhx-texttext-col-${col} .bhx-tt-decor{display:block;width:${w}px;height:${h}px;margin:${margin(a)};color:${c};background:${style==='gradient'?`linear-gradient(90deg,transparent,${c},transparent)`:style==='dots'?`radial-gradient(circle,${c} ${Math.max(1,dot/2)}px,transparent ${Math.max(2,dot/2+1)}px) 0 50%/${dot+dotGap}px 100% repeat-x`:c};${style==='double'?`border-top:${Math.max(1,h/3)}px solid ${c};border-bottom:${Math.max(1,h/3)}px solid ${c};background:transparent;`:''}${style==='glow'?`box-shadow:0 0 ${glow}px ${c};`:''}${style==='wave'?`transform:skewX(${skew}deg);border-radius:999px;`:''}${style==='brush'||style==='sketch'?`transform:rotate(${angle}deg);border-radius:50% 10% 40% 5%;opacity:${style==='sketch'?.72:.88};`:''}position:relative}
${style==='split'?`#${id} .bhx-texttext-col-${col} .bhx-tt-decor{background:transparent}#${id} .bhx-texttext-col-${col} .bhx-tt-decor:before,#${id} .bhx-texttext-col-${col} .bhx-tt-decor:after{content:"";position:absolute;top:0;height:100%;width:calc(50% - ${split/2}px);background:${c}}#${id} .bhx-texttext-col-${col} .bhx-tt-decor:before{left:0}#${id} .bhx-texttext-col-${col} .bhx-tt-decor:after{right:0}`:''}
@media(max-width:768px){#${id} .bhx-texttext-col-${col} .bhx-tt-decor{width:${mw}px;height:${mh}px;margin:${margin(ma)}}}`
}
function enterTransform(type:string,d:number){
 if(type==='fade_up')return `translate3d(0,${d}px,0)`
 if(type==='fade_down')return `translate3d(0,-${d}px,0)`
 if(type==='slide_left')return `translate3d(${d}px,0,0)`
 if(type==='slide_right')return `translate3d(-${d}px,0,0)`
 if(type==='zoom_in')return 'scale(.94)'
 if(type==='zoom_out')return 'scale(1.06)'
 return 'none'
}
function animationCss(id:string,data:any,selector:string,prefix:string,section=false){
 const dType=token(data[`${prefix}DesktopV1`],section?'none':'fade_in'),mType=token(data[`${prefix}MobileV1`],dType)
 const timingBase=section?prefix:prefix.replace(/Animation$/,'')
 const dDist=num(data[`${timingBase}DistanceDesktopV1`],80,0,1000),mDist=num(data[`${timingBase}DistanceMobileV1`],dDist,0,1000)
 const dDur=num(data[`${timingBase}DurationDesktopV1`],.8,0,10),mDur=num(data[`${timingBase}DurationMobileV1`],dDur,0,10)
 const dDelay=num(data[`${timingBase}DelayDesktopV1`],0,0,10),mDelay=num(data[`${timingBase}DelayMobileV1`],dDelay,0,10)
 const deskNone=dType==='none'?`@media(min-width:769px){#${id} ${selector}[data-bhx-tt-anim]{opacity:1;transform:none;transition:none}}`:''
 const mobileNone=mType==='none'?`@media(max-width:768px){#${id} ${selector}[data-bhx-tt-anim]{opacity:1;transform:none;transition:none}}`:''
 return `#${id} ${selector}[data-bhx-tt-anim]{--bhx-tt-enter:${enterTransform(dType,dDist)};--bhx-tt-enter-mobile:${enterTransform(mType,mDist)};--bhx-tt-enter-duration:${dDur}s;--bhx-tt-enter-duration-mobile:${mDur}s;--bhx-tt-enter-delay:${dDelay}s;--bhx-tt-enter-delay-mobile:${mDelay}s}${deskNone}${mobileNone}`
}
function positionCss(id:string,data:any,col:1|2){
 const p=`textTextCol${col}Position`
 const css=(mobile=false)=>{const s=mobile?'MobileV1':'DesktopV1';return `top:${num(data[`${p}Top${s}`],0,-5000,5000)}${unit(data[`${p}TopUnit${s}`])};bottom:${num(data[`${p}Bottom${s}`],0,-5000,5000)}${unit(data[`${p}BottomUnit${s}`])};left:${num(data[`${p}Left${s}`],0,-5000,5000)}${unit(data[`${p}LeftUnit${s}`])};right:${num(data[`${p}Right${s}`],0,-5000,5000)}${unit(data[`${p}RightUnit${s}`])};z-index:${num(data[`${p}ZIndex${s}`],1,-9999,99999)};`}
 const hc=color(data[`${p}HoverColorDesktopV1`],color(data.accentColor,'#4f46e5')),mhc=color(data[`${p}HoverColorMobileV1`],hc)
 return `#${id} .bhx-texttext-slot-${col}{position:relative;min-width:0;${css(false)}}@media(min-width:769px) and (hover:hover) and (pointer:fine){#${id} .bhx-texttext-slot-${col}.bhx-tt-position-hover-lift:hover{transform:translateY(-5px)}#${id} .bhx-texttext-slot-${col}.bhx-tt-position-hover-scale:hover{transform:scale(1.025)}#${id} .bhx-texttext-slot-${col}.bhx-tt-position-hover-glow:hover{box-shadow:0 0 26px ${hc}}}
@media(max-width:768px){#${id} .bhx-texttext-slot-${col}{${css(true)}}}@media(max-width:768px) and (hover:hover) and (pointer:fine){#${id} .bhx-texttext-slot-${col}.bhx-tt-position-hover-lift-mobile:hover{transform:translateY(-5px)}#${id} .bhx-texttext-slot-${col}.bhx-tt-position-hover-scale-mobile:hover{transform:scale(1.025)}#${id} .bhx-texttext-slot-${col}.bhx-tt-position-hover-glow-mobile:hover{box-shadow:0 0 26px ${mhc}}}`
}

export function textTextV1Css(id:string,data:any){
 const layout=token(data.textTextLayoutDesktopV1,'text_left'),mobile=token(data.textTextLayoutMobileV1,'follow_desktop')
 const balance=clean(data.textTextBalanceV1||'50/50');const ratios:Record<string,[number,number]>={'40/60':[40,60],'60/40':[60,40],'33/67':[33,67],'67/33':[67,33],'50/50':[50,50]};const [r1,r2]=ratios[balance]||[50,50]
 const show1=data.textTextShowColumn1V1!==false,show2=data.textTextShowColumn2V1!==false
 const gap=num(data.textTextColumnGapDesktopV1,50,0,300),mgap=num(data.textTextColumnGapMobileV1,30,0,300)
 const hgap=num(data.textTextHeaderGapDesktopV1,20,0,180),mhgap=num(data.textTextHeaderGapMobileV1,hgap,0,180)
 const b1Top=num(data.textTextCol1ButtonTopGapDesktopV1,0,0,150),b2Top=num(data.textTextCol2ButtonTopGapDesktopV1,0,0,150)
 const b1MobileOverride=data.sectionButtonMobileOverrideV1===true,b2MobileOverride=data.textTextCol2ButtonMobileOverrideV1===true
 const b1TopMobile=b1MobileOverride?num(data.textTextCol1ButtonTopGapMobileV1,b1Top,0,150):b1Top
 const b2TopMobile=b2MobileOverride?num(data.textTextCol2ButtonTopGapMobileV1,b2Top,0,150):b2Top
 const divider=data.textTextColumnDividerEnabledV1===true&&show1&&show2
 const divStyle=['solid','dashed','dotted'].includes(token(data.textTextColumnDividerStyleV1,'solid'))?token(data.textTextColumnDividerStyleV1,'solid'):'solid'
 const divColor=color(data.textTextColumnDividerColorV1,'#e5e7eb'),divThickness=num(data.textTextColumnDividerThicknessV1,1,1,20),divHeight=num(data.textTextColumnDividerHeightDesktopV1,100,0,100),divMobileWidth=num(data.textTextColumnDividerWidthMobileV1,100,0,100)
 const desktopGrid=!show1||!show2?'minmax(0,1fr)':layout==='text_top'?'minmax(0,1fr)':layout==='text_right'?`minmax(0,${r2}fr) minmax(0,${r1}fr)`:`minmax(0,${r1}fr) minmax(0,${r2}fr)`
 const dividerLeft=layout==='text_right'?r2:r1
 const dividerGapOffset=Math.round((.5-dividerLeft/100)*gap*1000)/1000
 const sectionAnim=animationCss(id,data,'.bhx-texttext-shell','textTextSectionAnimation',true)
 const col1Anim=animationCss(id,data,'.bhx-texttext-slot-1','textTextCol1PositionAnimation')
 const col2Anim=animationCss(id,data,'.bhx-texttext-slot-2','textTextCol2PositionAnimation')
 return `@media(max-width:768px){#${id}.bhx-hide-mobile{display:none!important}}@media(min-width:769px){#${id}.bhx-hide-desktop{display:none!important}}#${id} .bhx-texttext-shell{position:relative}#${id} .bhx-texttext-grid{position:relative;display:grid;grid-template-columns:${desktopGrid};gap:${gap}px;align-items:stretch;margin-top:${hgap}px;min-width:0}#${id} .bhx-texttext-slot-1{${show1?'':'display:none;'}}#${id} .bhx-texttext-slot-2{${show2?'':'display:none;'}}#${id} .bhx-texttext-col{height:100%;display:flex;flex-direction:column;min-width:0;overflow-wrap:anywhere}#${id} .bhx-tt-kicker{display:inline-block;margin-bottom:10px;letter-spacing:.08em;text-transform:uppercase}#${id} .bhx-tt-headline{margin:0 0 14px;line-height:1.12;text-wrap:balance}#${id} .bhx-tt-paragraph{margin:0;line-height:1.7}#${id} .bhx-tt-decor{margin-top:18px!important;margin-bottom:18px!important;max-width:100%}#${id} .bhx-tt-buttons{display:flex;flex-wrap:wrap;align-items:center;max-width:100%}#${id} .bhx-tt-buttons-col-1{margin-top:${b1Top}px}#${id} .bhx-tt-buttons-col-2{margin-top:${b2Top}px}#${id} .bhx-tt-buttons>a{max-width:100%}#${id} .bhx-tt-buttons-stack{flex-direction:column;align-items:flex-start}#${id} .bhx-tt-readmore{margin-top:18px}#${id} .bhx-tt-readmore summary{cursor:pointer;font-weight:700;list-style:none}#${id} .bhx-tt-readmore summary::-webkit-details-marker{display:none}#${id} .bhx-tt-readmore-content{margin-top:12px;line-height:1.7;white-space:pre-line;overflow-wrap:anywhere}#${id} .bhx-tt-readmore-button{appearance:none;border:0;background:transparent;padding:0;cursor:pointer;touch-action:manipulation;font:inherit;font-weight:700;text-decoration:underline;text-underline-offset:3px}#${id} .bhx-tt-readmore summary:focus-visible,#${id} .bhx-tt-readmore-button:focus-visible,#${id} .bhx-tt-popup-close:focus-visible{outline:2px solid var(--bhx-accent,#4f46e5);outline-offset:3px}#${id} .bhx-tt-popup-backdrop{position:fixed;inset:0;z-index:10000;background:rgba(2,6,23,.62);display:grid;place-items:center;padding:20px;overscroll-behavior:contain}#${id} .bhx-tt-popup{position:relative;width:min(720px,100%);max-height:min(86vh,900px);max-height:min(86dvh,900px);overflow:auto;overscroll-behavior:contain;scrollbar-gutter:stable;background:var(--page-bg,#fff);color:var(--page-text,#111827);border-radius:18px;padding:clamp(22px,4vw,42px);box-shadow:0 28px 90px rgba(2,6,23,.36);text-align:left}#${id} .bhx-tt-popup-close{position:absolute;top:10px;right:10px;width:44px;height:44px;border-radius:999px;border:1px solid rgba(148,163,184,.35);background:var(--page-bg,#fff);cursor:pointer;touch-action:manipulation;font-size:24px;line-height:1}#${id} .bhx-tt-popup-media{margin:0 0 20px;aspect-ratio:1200/760}#${id} .bhx-tt-popup-media img{display:block;width:100%;height:100%;border-radius:14px;object-fit:cover}#${id} .bhx-tt-popup h3{margin-top:0;text-wrap:balance}#${id} .bhx-tt-popup-actions{margin-top:20px}#${id} .bhx-texttext-divider{${divider?'display:block;':'display:none;'}position:absolute;z-index:1;pointer-events:none;border-left:${divThickness}px ${divStyle} ${divColor};height:${divHeight}%;left:calc(${dividerLeft}% + ${dividerGapOffset}px);top:50%;transform:translate(-50%,-50%)}
#${id} .bhx-texttext-shell[data-bhx-popup-open="true"],#${id} .bhx-texttext-shell[data-bhx-popup-open="true"] .bhx-texttext-slot,#${id} .bhx-texttext-shell[data-bhx-popup-open="true"] .bhx-texttext-col{transform:none!important}#${id} .bhx-texttext-layout-text_right .bhx-texttext-slot-1{order:2}#${id} .bhx-texttext-layout-text_right .bhx-texttext-slot-2{order:1}#${id} .bhx-texttext-layout-text_top{grid-template-columns:minmax(0,1fr)}#${id} .bhx-texttext-layout-text_top .bhx-texttext-divider{position:static;width:${divMobileWidth}%;height:0;border-left:0;border-top:${divThickness}px ${divStyle} ${divColor};transform:none;margin:auto;order:2}#${id} .bhx-texttext-layout-text_top .bhx-texttext-slot-1{order:1}#${id} .bhx-texttext-layout-text_top .bhx-texttext-slot-2{order:3}
#${id} .bhx-texttext-shell[data-bhx-motion-ready="true"][data-bhx-tt-anim][data-bhx-visible="false"],#${id} .bhx-texttext-shell[data-bhx-motion-ready="true"] [data-bhx-tt-anim][data-bhx-visible="false"]{opacity:0;transform:var(--bhx-tt-enter,none)}#${id} [data-bhx-tt-anim][data-bhx-visible="true"]{opacity:1;transform:none;transition:opacity var(--bhx-tt-enter-duration,.8s) ease var(--bhx-tt-enter-delay,0s),transform var(--bhx-tt-enter-duration,.8s) cubic-bezier(.22,.61,.36,1) var(--bhx-tt-enter-delay,0s)}#${id} [data-bhx-tt-anim][data-bhx-no-animation="true"]{opacity:1!important;transform:none!important;transition:none!important}
#${id} .bhx-tt-hidden-all{display:none!important}#${id} .bhx-tt-desktop-hidden{display:none!important}
${textCss(id,data,1)}${textCss(id,data,2)}${decorCss(id,data,1)}${decorCss(id,data,2)}${blockCss(id,data,1)}${blockCss(id,data,2)}${positionCss(id,data,1)}${positionCss(id,data,2)}${sectionAnim}${col1Anim}${col2Anim}
@media(max-width:768px){#${id} .bhx-texttext-grid{grid-template-columns:minmax(0,1fr);gap:${mgap}px;margin-top:${mhgap}px}#${id} .bhx-tt-desktop-hidden{display:revert!important}#${id} .bhx-tt-mobile-hidden{display:none!important}#${id} .bhx-texttext-slot-1,#${id} .bhx-texttext-slot-2{order:initial}#${id} .bhx-texttext-mobile-text_top .bhx-texttext-slot-1{order:1}#${id} .bhx-texttext-mobile-text_top .bhx-texttext-slot-2{order:3}#${id} .bhx-texttext-mobile-media_top .bhx-texttext-slot-2{order:1}#${id} .bhx-texttext-mobile-media_top .bhx-texttext-slot-1{order:3}#${id} .bhx-texttext-mobile-follow_desktop.bhx-texttext-layout-text_right .bhx-texttext-slot-2{order:1}#${id} .bhx-texttext-mobile-follow_desktop.bhx-texttext-layout-text_right .bhx-texttext-slot-1{order:3}#${id} .bhx-texttext-divider{position:static;width:${divMobileWidth}%;height:0;border-left:0;border-top:${divThickness}px ${divStyle} ${divColor};transform:none;margin:auto;order:2}#${id} .bhx-tt-buttons-col-1{margin-top:${b1TopMobile}px}#${id} .bhx-tt-buttons-col-2{margin-top:${b2TopMobile}px}#${id} .bhx-tt-buttons-mobile-stack{flex-direction:column;align-items:flex-start}#${id} .bhx-tt-buttons-mobile-inline,#${id} .bhx-tt-buttons-mobile-inherit{flex-direction:row}#${id} .bhx-texttext-shell[data-bhx-motion-ready="true"][data-bhx-tt-anim][data-bhx-visible="false"],#${id} .bhx-texttext-shell[data-bhx-motion-ready="true"] [data-bhx-tt-anim][data-bhx-visible="false"]{transform:var(--bhx-tt-enter-mobile,var(--bhx-tt-enter,none))}#${id} [data-bhx-tt-anim][data-bhx-visible="true"]{transition-duration:var(--bhx-tt-enter-duration-mobile,var(--bhx-tt-enter-duration,.8s));transition-delay:var(--bhx-tt-enter-delay-mobile,var(--bhx-tt-enter-delay,0s))}}
@media(prefers-reduced-motion:reduce){#${id} [data-bhx-tt-anim]{opacity:1!important;transform:none!important;transition:none!important}#${id} .bhx-texttext-col,#${id} .bhx-texttext-slot-1,#${id} .bhx-texttext-slot-2{transition:none!important}}
`
}
