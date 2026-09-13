'use client'

import {useEffect,useMemo,useRef,useState,type CSSProperties,type PointerEvent as ReactPointerEvent,type ReactNode} from 'react'

type CssVars=CSSProperties&Record<`--${string}`,string|number>
type AnyMap=Record<string,any>

type HeroButtonContent={contentMode?:string;text?:string;linkType?:string;link?:string;target?:string}
type HeroButtonStyle=AnyMap
type HeroLayer=AnyMap
type HeroSlide=AnyMap&{
  key?:string
  headlineEnabled?:boolean
  heading?:string
  subHeadlineEnabled?:boolean
  text?:string
  buttonsEnabled?:boolean
  buttonCount?:number
  primaryButton?:HeroButtonContent
  secondaryButton?:HeroButtonContent
  primaryButtonDesktop?:HeroButtonStyle
  secondaryButtonDesktop?:HeroButtonStyle
  primaryButtonMobile?:AnyMap
  secondaryButtonMobile?:AnyMap
  layers?:AnyMap
}
type ShapeConfig={style?:string;color?:string;height?:number;mobileHeight?:number;direction?:string;opacity?:number}
type HeroProps={
  slides:HeroSlide[]
  layoutStyle?:string
  autoSlideSeconds?:number
  pauseOnHover?:boolean
  showArrows?:boolean
  showDots?:boolean
  enableDrag?:boolean
  dotSize?:number
  heightDesktop?:number
  heightMobile?:number
  paddingTopDesktop?:number
  paddingBottomDesktop?:number
  paddingTopMobile?:number
  paddingBottomMobile?:number
  headlineFontFamily?:string
  headlineFontWeight?:string
  subFontFamily?:string
  subFontWeight?:string
  shapeTop?:ShapeConfig
  shapeBottom?:ShapeConfig
}

const clamp=(value:any,min:number,max:number,fallback:number)=>Math.max(min,Math.min(max,Number.isFinite(Number(value))?Number(value):fallback))
const token=(value:any)=>String(value??'').toLowerCase().replace(/[^a-z0-9_-]+/g,'-')
const color=(value:any,fallback='')=>typeof value==='string'&&value?value:(typeof value?.hex==='string'?value.hex:fallback)
const safeUrl=(value:any)=>String(value??'').trim()
const safeHref=(value:any)=>{
  const raw=safeUrl(value)
  if(!raw)return '#'
  if(raw.startsWith('#')||raw.startsWith('/')||raw.startsWith('./')||raw.startsWith('../'))return raw
  if(/^(https?:|mailto:|tel:)/i.test(raw))return raw
  return '#'
}
const gradientDirection=(value:any)=>({right:'to right',left:'to left',bottom:'to bottom',top:'to top',diag:'135deg','135deg':'135deg'} as Record<string,string>)[String(value||'right')]||'to right'
const shadowValue=(value:any)=>({soft:'0 8px 22px rgba(0,0,0,.16)',medium:'0 12px 28px rgba(0,0,0,.24)',strong:'0 18px 42px rgba(0,0,0,.34)',glow:'0 0 26px currentColor',floating:'0 16px 35px rgba(0,0,0,.30)',inset:'inset 0 0 0 2px rgba(255,255,255,.12)'} as Record<string,string>)[String(value||'none')]||'none'
const fontFamily=(value:any)=>{
  const v=String(value||'')
  if(!v||/^Use Global/i.test(v))return undefined
  const map:Record<string,string>={
    'System UI':'system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif','Segoe UI':'"Segoe UI",Arial,sans-serif','Arial / Helvetica':'Arial,Helvetica,sans-serif',Verdana:'Verdana,sans-serif',Tahoma:'Tahoma,sans-serif','Trebuchet MS':'"Trebuchet MS",sans-serif',Georgia:'Georgia,serif','Times New Roman':'"Times New Roman",serif',Garamond:'Garamond,serif',Palatino:'Palatino,"Palatino Linotype",serif','Courier New':'"Courier New",monospace','Lucida Console':'"Lucida Console",monospace',Impact:'Impact,sans-serif',
  }
  return map[v]||`"${v.replace(/"/g,'')}",sans-serif`
}
const youtubeId=(url:string)=>url.match(/(?:youtube(?:-nocookie)?\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/i)?.[1]||''
const vimeoId=(url:string)=>url.match(/vimeo\.com\/(\d+)/i)?.[1]||''

function Icon({type}:{type?:string}){
  const common={width:18,height:18,viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:2,strokeLinecap:'round' as const,strokeLinejoin:'round' as const,'aria-hidden':true}
  switch(type){
    case 'anchor_up':return <svg {...common}><path d="M12 19V5"/><path d="m5 12 7-7 7 7"/></svg>
    case 'buy':return <svg {...common}><circle cx="9" cy="20" r="1"/><circle cx="19" cy="20" r="1"/><path d="M3 4h2l2.4 11.3a2 2 0 0 0 2 1.7h7.7a2 2 0 0 0 2-1.6L21 8H6"/></svg>
    case 'bag':return <svg {...common}><path d="M6 8h12l1 13H5L6 8Z"/><path d="M9 8a3 3 0 0 1 6 0"/></svg>
    case 'play':return <svg {...common}><circle cx="12" cy="12" r="9"/><path d="m10 8 6 4-6 4Z"/></svg>
    case 'tel':return <svg {...common}><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2Z"/></svg>
    case 'wa':return <svg {...common}><path d="M20.5 11.6a8.4 8.4 0 0 1-12.4 7.4L3 20.5l1.5-5A8.4 8.4 0 1 1 20.5 11.6Z"/><path d="M8.2 7.8c.3-.7.6-.7.9-.7h.5c.2 0 .4.1.5.4l.8 2c.1.3 0 .5-.1.7l-.6.8c-.2.2-.2.4 0 .7.6 1 1.4 1.8 2.5 2.4.3.2.5.1.7-.1l.9-1c.2-.2.4-.3.7-.2l2.1 1c.3.1.4.3.4.5 0 .6-.3 1.3-.8 1.8-.6.6-1.4.9-2.2.9-1.3 0-3.4-.7-5.2-2.4-1.5-1.5-2.7-3.4-2.8-4.9 0-.8.2-1.4.7-1.9Z"/></svg>
    case 'anchor_down':return <svg {...common}><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg>
    default:return <svg {...common}><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>
  }
}

function buttonHref(button:HeroButtonContent){
  const action=String(button.linkType||'custom')
  const raw=safeUrl(button.link)
  if(action==='tel'){
    if(raw.startsWith('tel:'))return raw
    const digits=raw.replace(/[^+\d]/g,'')
    return digits?`tel:${digits}`:'#'
  }
  if(action==='wa'){
    if(/^https?:\/\//i.test(raw))return raw
    const digits=raw.replace(/\D/g,'')
    return digits?`https://wa.me/${digits}`:'#'
  }
  return safeHref(raw)
}

function HeroButton({content,desktop,mobile,kind}:{content?:HeroButtonContent;desktop?:HeroButtonStyle;mobile?:AnyMap;kind:'primary'|'secondary'}){
  if(!content)return null
  const mode=String(content.contentMode||'text_icon')
  const text=String(content.text||'')
  if(mode!=='icon'&&!text)return null
  const href=buttonHref(content)
  const style=String(desktop?.style||'solid')
  const bg=style==='gradient'?`linear-gradient(${gradientDirection(desktop?.gradientDirection)},${color(desktop?.gradient1,'#4f46e5')},${color(desktop?.gradient2,'#7c3aed')})`:style==='solid'?color(desktop?.background,kind==='primary'?'#4f46e5':'#fff'):'transparent'
  const borderType=String(desktop?.borderType||'solid')
  const borderWidth=clamp(desktop?.borderWidth,0,15,kind==='secondary'?2:0)
  const borderColor=color(desktop?.borderColor,kind==='primary'?'#fff':'#333')
  const allBorders={top:desktop?.borderTop!==false,right:desktop?.borderRight!==false,bottom:desktop?.borderBottom!==false,left:desktop?.borderLeft!==false}
  const borderStyle=borderType==='none'?'none':borderType==='gradient'?'solid':borderType
  const radiusMode=String(desktop?.radiusMode||'all')
  const radius=clamp(desktop?.radius,0,200,kind==='primary'?50:100)
  const radiusCss=radiusMode==='individual'?`${clamp(desktop?.radiusTopLeft,0,200,radius)}px ${clamp(desktop?.radiusTopRight,0,200,radius)}px ${clamp(desktop?.radiusBottomRight,0,200,radius)}px ${clamp(desktop?.radiusBottomLeft,0,200,radius)}px`:`${radius}px`
  const hoverType=String(desktop?.hoverType||'simple')
  const hoverLayer=hoverType==='gradient'?`linear-gradient(${gradientDirection(desktop?.hoverGradientDirection)},${color(desktop?.hoverGradient1,'#4f46e5')},${color(desktop?.hoverGradient2,'#7c3aed')})`:color(hoverType==='slide'?desktop?.hoverSlideColor:desktop?.hoverBackground,'#4f46e5')
  const vars:CssVars={
    '--bhx-btn-bg':bg,'--bhx-btn-color':color(desktop?.color,kind==='primary'?'#fff':'#333'),'--bhx-btn-radius':radiusCss,
    '--bhx-btn-font':`${clamp(desktop?.fontSize,10,60,18)}px`,'--bhx-btn-py':`${clamp(desktop?.paddingY,0,50,kind==='primary'?15:10)}px`,'--bhx-btn-px':`${clamp(desktop?.paddingX,0,100,kind==='primary'?40:10)}px`,
    '--bhx-btn-font-m':`${clamp(mobile?.fontSize,10,60,16)}px`,'--bhx-btn-py-m':`${clamp(mobile?.paddingY,0,50,kind==='primary'?12:10)}px`,'--bhx-btn-px-m':`${clamp(mobile?.paddingX,0,100,kind==='primary'?30:10)}px`,
    '--bhx-btn-hover-bg':hoverLayer,'--bhx-btn-hover-color':color(desktop?.hoverColor,'#fff'),'--bhx-btn-hover-duration':`${clamp(desktop?.hoverDuration,100,2000,450)}ms`,
    '--bhx-btn-shadow':shadowValue(desktop?.shadowPreset),'--bhx-btn-glow':color(desktop?.borderGlowColor,'#4f46e5'),
  }
  const borderGradient=borderType==='gradient'?`linear-gradient(${gradientDirection(desktop?.borderGradientDirection)},${color(desktop?.borderGradient1,'#4f46e5')},${color(desktop?.borderGradient2,'#7c3aed')})`:''
  if(borderType==='gradient')vars['--bhx-btn-border-gradient']=borderGradient
  const border:CSSProperties={
    borderTop:allBorders.top?`${borderWidth}px ${borderStyle} ${borderColor}`:'0',borderRight:allBorders.right?`${borderWidth}px ${borderStyle} ${borderColor}`:'0',borderBottom:allBorders.bottom?`${borderWidth}px ${borderStyle} ${borderColor}`:'0',borderLeft:allBorders.left?`${borderWidth}px ${borderStyle} ${borderColor}`:'0',
  }
  const target=content.target==='blank'?'_blank':undefined
  return <a className={`bhx-hero-btn bhx-hero-btn-${kind} bhx-btn-style-${token(style)} bhx-btn-hover-${token(hoverType)} bhx-btn-motion-${token(desktop?.hoverTextMotion||'up')} bhx-btn-slide-${token(desktop?.hoverSlideDirection||'left')} bhx-btn-border-${token(borderType)} bhx-btn-border-anim-${token(desktop?.borderAnimation||'none')} bhx-btn-border-speed-${token(desktop?.borderAnimationSpeed||'normal')} bhx-btn-glow-${token(desktop?.borderGlowStrength||'medium')} bhx-btn-glow-distance-${token(desktop?.borderGlowDistance||'normal')}`} href={href} target={target} rel={target?'noopener noreferrer':undefined} style={{...vars,...border}}>
    <span className="bhx-hero-btn-hover-layer" aria-hidden="true"/>
    <span className="bhx-hero-btn-label">{mode!=='icon'&&<span className="bhx-hero-btn-text">{text}</span>}{mode!=='text'&&<span className="bhx-hero-btn-icon"><Icon type={content.linkType}/></span>}</span>
  </a>
}

function ShapeDivider({position,config}:{position:'top'|'bottom';config?:ShapeConfig}){
  const type=String(config?.style||'none')
  if(!type||type==='none')return null
  const c=color(config?.color,'#ffffff')
  const height=clamp(config?.height,4,300,100)
  const mobileHeight=Number.isFinite(Number(config?.mobileHeight))?clamp(config?.mobileHeight,4,300,height):height
  const opacity=clamp(config?.opacity,0,1,1)
  const invert=config?.direction==='invert'
  const isLine=['line','dotted','dashed','double_line','gradient'].includes(type)
  const transform=isLine?'none':position==='top'?(invert?'scaleY(1)':'scaleY(-1)'):(invert?'scaleY(-1)':'scaleY(1)')
  const style:CssVars={height:`${height}px`,'--bhx-shape-mobile-height':`${mobileHeight}px`,opacity,transform}
  let body:ReactNode
  if(type==='dotted')body=<span className="bhx-shape-line bhx-shape-dotted" style={{backgroundImage:`radial-gradient(circle,${c} 2px,transparent 2px)`}}/>
  else if(type==='dashed')body=<span className="bhx-shape-line bhx-shape-dashed" style={{backgroundImage:`linear-gradient(90deg,${c} 0 45%,transparent 45% 70%,${c} 70% 100%)`}}/>
  else if(type==='double_line')body=<span className="bhx-shape-line bhx-shape-double" style={{borderColor:c}}/>
  else if(type==='gradient')body=<span className="bhx-shape-line" style={{background:`linear-gradient(90deg,transparent,${c},transparent)`}}/>
  else if(type==='line')body=<span className="bhx-shape-line" style={{background:c}}/>
  else{
    const paths:Record<string,string>={wave_soft:'M0,48 C220,110 420,0 650,48 C860,92 1030,98 1200,35 L1200,120 L0,120 Z',wave_deep:'M0,80 C160,10 330,10 520,80 C730,155 910,-20 1200,65 L1200,120 L0,120 Z',tilt:'M0,120 L1200,0 L1200,120 Z',curve:'M0,0 C300,120 900,120 1200,0 L1200,120 L0,120 Z',triangle:'M0,120 L600,0 L1200,120 Z',zigzag:'M0,80 L100,35 L200,80 L300,35 L400,80 L500,35 L600,80 L700,35 L800,80 L900,35 L1000,80 L1100,35 L1200,80 L1200,120 L0,120 Z',wave:'M0,40 C200,100 400,0 600,40 C800,80 1000,100 1200,40 L1200,120 L0,120 Z'}
    body=<svg viewBox="0 0 1200 120" preserveAspectRatio="none" aria-hidden="true"><path fill={c} d={paths[type]||paths.wave}/></svg>
  }
  return <div className={`bhx-hero-shape bhx-hero-shape-${position} bhx-hero-shape-${token(type)}`} style={style} aria-hidden="true">{body}</div>
}

function overlayGradient(slide:HeroSlide,kind:'image'|'video'){
  const overlayType=String(kind==='image'?slide.imageOverlayType:slide.videoOverlayType||'solid')
  const primary=color(slide.backgroundColor,kind==='image'?color(slide.imageTint1,'#0F172A'):color(slide.videoTint,'#000000'))
  const secondary=color(slide.gradientTo,kind==='image'?color(slide.imageTint2,'#e5e7eb'):'#e5e7eb')
  const gradient1=color(slide.gradientFrom,primary)
  const opacity1=clamp(kind==='image'?slide.imageTintOpacity1:slide.videoTintOpacity,0,1,.6)
  const opacity2=clamp(kind==='image'?slide.imageTintOpacity2:slide.videoTintOpacity2,0,1,.6)
  const mix=(c:string,o:number)=>`color-mix(in srgb,${c} ${Math.round(o*100)}%,transparent)`
  if(overlayType!=='gradient')return {style:{backgroundColor:primary,opacity:opacity1} as CSSProperties,gradient:false}
  const start=clamp(slide.gradientStart,0,100,0),end=clamp(slide.gradientEnd,0,100,100)
  const rawDirection=String(slide.gradientDirection||'right');const direction=(rawDirection==='135deg'||rawDirection==='diag')?'right':rawDirection
  const g1=mix(gradient1,opacity1),g2=mix(secondary,opacity2)
  const background=direction==='radial'
    ?`radial-gradient(circle,${g1} ${start}%,${g2} ${end}%)`
    :direction==='bottom'
      ?`linear-gradient(to bottom,${g1} ${start}%,${g2} ${end}%)`
      :direction==='135deg'
        ?`linear-gradient(135deg,${g1} ${start}%,${g2} ${end}%)`
        :`linear-gradient(to right,${g1} ${start}%,${g2} ${end}%)`
  return {style:{background} as CSSProperties,gradient:true}
}

function Background({slide,active}:{slide:HeroSlide;active:boolean}){
  const type=String(slide.backgroundType||'gradient')
  if(type==='transparent')return <div className="bhx-hero-bg" aria-hidden="true"/>
  if(type==='color')return <div className="bhx-hero-bg" style={{backgroundColor:color(slide.backgroundColor,'#0F172A')}} aria-hidden="true"/>
  if(type==='gradient'){
    const from=color(slide.gradientFrom,'#f8fafc'),to=color(slide.gradientTo,'#e5e7eb')
    const start=clamp(slide.gradientStart,0,100,0),end=clamp(slide.gradientEnd,0,100,100)
    const rawDirection=String(slide.gradientDirection||'right');const direction=(rawDirection==='135deg'||rawDirection==='diag')?'right':rawDirection
    const background=direction==='radial'?`radial-gradient(circle,${from} ${start}%,${to} ${end}%)`:direction==='bottom'?`linear-gradient(to bottom,${from} ${start}%,${to} ${end}%)`:direction==='right'?`linear-gradient(to right,${from} ${start}%,${to} ${end}%)`:`linear-gradient(to right,${from} ${start}%,${to} ${end}%)`
    return <div className="bhx-hero-bg" style={{background}} aria-hidden="true"/>
  }
  if(type==='image'){
    const image=safeHref(slide.backgroundImageUrl)
    const mobile=safeHref(slide.mobileBackgroundImageUrl)
    const imageStyle=String(slide.imageStyle==='fixed'?'parallax':slide.imageStyle==='repeat'?'tiling':slide.imageStyle||'cover')
    const overlay=overlayGradient(slide,'image')
    return <div className={`bhx-hero-bg bhx-hero-bg-image bhx-bg-image-${token(imageStyle)}`} aria-hidden="true">
      {image!=='#'&&imageStyle==='cover'&&<picture>{mobile!=='#'&&<source media="(max-width:768px)" srcSet={mobile}/>}<img src={image} alt="" loading={active?'eager':'lazy'} fetchPriority={active?'high':'auto'} decoding="async"/></picture>}
      {image!=='#'&&imageStyle!=='cover'&&<span className="bhx-hero-bg-css-image" style={{backgroundImage:`url("${image.replace(/"/g,'%22')}")`}}/>}
      <span className={`bhx-hero-bg-overlay ${overlay.gradient?'is-gradient':''}`} style={overlay.style}/>
    </div>
  }
  if(type==='video'){
    const url=safeHref(slide.backgroundVideoUrl)
    const yid=url==='#'?'':youtubeId(url),vid=url==='#'?'':vimeoId(url)
    const overlay=overlayGradient(slide,'video')
    const loop=slide.videoLoop!==false&&slide.videoLoop!=='0'
    return <div className="bhx-hero-bg bhx-hero-bg-video" style={{backgroundColor:color(slide.backgroundColor,'#0F172A')}} aria-hidden="true">
      {active&&url!=='#'&&yid&&<iframe className="bhx-hero-bg-iframe" src={`https://www.youtube.com/embed/${yid}?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&playsinline=1&loop=1&playlist=${yid}`} allow="autoplay; fullscreen" tabIndex={-1} title=""/>}
      {active&&url!=='#'&&!yid&&vid&&<iframe className="bhx-hero-bg-iframe" src={`https://player.vimeo.com/video/${vid}?background=1&autoplay=1&muted=1&loop=1`} allow="autoplay; fullscreen" tabIndex={-1} title=""/>}
      {active&&url!=='#'&&!yid&&!vid&&(
        <video
          className="bhx-hero-bg-video-el"
          autoPlay
          muted
          loop={loop}
          playsInline
          preload="metadata"
          onLoadedMetadata={(event)=>{
            const start=Math.max(0,Number(slide.videoStart||0))
            if(start>0)event.currentTarget.currentTime=start
          }}
          onTimeUpdate={(event)=>{
            const end=Number(slide.videoEnd||0)
            if(end<=0||event.currentTarget.currentTime<end)return
            if(loop){
              event.currentTarget.currentTime=Math.max(0,Number(slide.videoStart||0))
              void event.currentTarget.play().catch(()=>{})
              return
            }
            event.currentTarget.pause()
          }}
        >
          <source src={url}/>
        </video>
      )}
      <span className={`bhx-hero-bg-overlay ${overlay.gradient?'is-gradient':''}`} style={overlay.style}/>
    </div>
  }
  if(type==='split'){
    const c1=color(slide.splitColor1,'#0F172A'),c2=color(slide.splitColor2,'#2563EB')
    const vars:CssVars={'--bhx-split-ratio-d':`${clamp(slide.splitRatioDesktop,10,90,50)}%`,'--bhx-split-ratio-m':`${clamp(slide.splitRatioMobile,10,90,50)}%`,'--bhx-split-depth-d':`${clamp(slide.splitShapeDepthDesktop,0,50,8)}vw`,'--bhx-split-depth-m':`${clamp(slide.splitShapeDepthMobile,0,50,4)}vw`,'--bhx-split-c1':c1,'--bhx-split-c2':c2}
    return <div className={`bhx-hero-bg bhx-hero-bg-split bhx-split-d-${token(slide.splitDirectionDesktop||'lr')} bhx-split-m-${token(slide.splitDirectionMobile||'tb')} bhx-split-edge-d-${token(slide.splitEdgeShapeDesktop||slide.splitEdgeShape||'straight')} bhx-split-edge-m-${token(slide.splitEdgeShapeMobile||slide.splitEdgeShape||'straight')}`} style={vars} aria-hidden="true">
      {slide.splitFillType==='image'?<>
        <span className="bhx-split-panel bhx-split-panel-1" style={slide.splitImage1Url?{backgroundImage:`linear-gradient(color-mix(in srgb,${c1} ${clamp(slide.splitTintOpacity1,0,1,.6)*100}%,transparent),color-mix(in srgb,${c1} ${clamp(slide.splitTintOpacity1,0,1,.6)*100}%,transparent)),url("${String(slide.splitImage1Url).replace(/"/g,'%22')}")`}:{backgroundColor:c1}}/>
        <span className="bhx-split-panel bhx-split-panel-2" style={slide.splitImage2Url?{backgroundImage:`linear-gradient(color-mix(in srgb,${c2} ${clamp(slide.splitTintOpacity2,0,1,.6)*100}%,transparent),color-mix(in srgb,${c2} ${clamp(slide.splitTintOpacity2,0,1,.6)*100}%,transparent)),url("${String(slide.splitImage2Url).replace(/"/g,'%22')}")`}:{backgroundColor:c2}}/>
      </>:<span className="bhx-split-color"/>}
    </div>
  }
  return null
}

function Layer({layer,name,active}:{layer?:HeroLayer;name:string;active:boolean}){
  if(!layer?.enabled||!layer.imageUrl)return null
  const desktopWidth=clamp(layer.widthDesktop,1,2000,320),mobileWidth=clamp(layer.widthMobile,1,1200,220)
  const style:CssVars={
    '--bhx-layer-x-d':`${clamp(layer.anchorXDesktop,-50,150,50)}%`,'--bhx-layer-y-d':`${clamp(layer.anchorYDesktop,-50,150,50)}%`,'--bhx-layer-x-m':`${clamp(layer.anchorXMobile,-50,150,50)}%`,'--bhx-layer-y-m':`${clamp(layer.anchorYMobile,-50,150,50)}%`,
    '--bhx-layer-ox-d':`${Number(layer.offsetXDesktop||0)}px`,'--bhx-layer-oy-d':`${Number(layer.offsetYDesktop||0)}px`,'--bhx-layer-ox-m':`${Number(layer.offsetXMobile||0)}px`,'--bhx-layer-oy-m':`${Number(layer.offsetYMobile||0)}px`,
    '--bhx-layer-w-d':`${desktopWidth}px`,'--bhx-layer-w-m':`${mobileWidth}px`,'--bhx-layer-max-d':`${clamp(layer.maxWidthDesktop,1,100,100)}%`,'--bhx-layer-max-m':`${clamp(layer.maxWidthMobile,1,100,100)}%`,
    '--bhx-layer-rot-d':`${Number(layer.rotateDesktop||0)}deg`,'--bhx-layer-rot-m':`${Number(layer.rotateMobile||0)}deg`,'--bhx-layer-opacity-d':clamp(layer.opacityDesktop,0,100,100)/100,'--bhx-layer-opacity-m':clamp(layer.opacityMobile,0,100,100)/100,
    '--bhx-layer-enter-duration':`${clamp(layer.entranceDuration,.1,4,.8)}s`,'--bhx-layer-enter-delay':`${clamp(layer.entranceDelay,0,8,0)}s`,'--bhx-layer-loop-duration':`${clamp(layer.loopDuration,.5,30,5)}s`,'--bhx-layer-intensity-d':`${Number(layer.intensityDesktop||14)}px`,'--bhx-layer-intensity-m':`${Number(layer.intensityMobile||8)}px`,
    '--bhx-layer-radius-d':`${clamp(layer.radiusDesktop,0,999,18)}px`,'--bhx-layer-radius-m':`${clamp(layer.radiusMobile,0,999,14)}px`,'--bhx-layer-pad-d':`${Math.max(0,Number(layer.paddingDesktop||0))}px`,'--bhx-layer-pad-m':`${Math.max(0,Number(layer.paddingMobile||0))}px`,'--bhx-layer-bg-d':color(layer.backgroundDesktop,'transparent'),'--bhx-layer-bg-m':color(layer.backgroundMobile,'transparent'),
  }
  const borderD=String(layer.borderTypeDesktop||'none'),borderM=String(layer.borderTypeMobile||'none')
  const borderDesktop=borderD==='gradient'?`linear-gradient(${gradientDirection(layer.borderDirectionDesktop)},${color(layer.borderColorDesktop,'#fff')},${color(layer.borderColor2Desktop,'#4f46e5')})`:''
  const borderMobile=borderM==='gradient'?`linear-gradient(${gradientDirection(layer.borderDirectionMobile)},${color(layer.borderColorMobile,'#fff')},${color(layer.borderColor2Mobile,'#4f46e5')})`:''
  style['--bhx-layer-border-d']=borderDesktop||color(layer.borderColorDesktop,'transparent')
  style['--bhx-layer-border-m']=borderMobile||color(layer.borderColorMobile,'transparent')
  style['--bhx-layer-border-width-d']=`${Math.max(0,Number(layer.borderWidthDesktop||0))}px`
  style['--bhx-layer-border-width-m']=`${Math.max(0,Number(layer.borderWidthMobile||0))}px`
  style['--bhx-layer-object-d']=String(layer.objectPositionDesktop||'center center').replace(/_/g,' ')
  style['--bhx-layer-object-m']=String(layer.objectPositionMobile||'center center').replace(/_/g,' ')
  const target=layer.linkTarget==='_blank'?'_blank':undefined
  const image=<div className={`bhx-hero-layer-frame bhx-layer-shape-d-${token(layer.shapeDesktop||'none')} bhx-layer-shape-m-${token(layer.shapeMobile||'none')} bhx-layer-border-d-${token(borderD)} bhx-layer-border-m-${token(borderM)} bhx-layer-hover-${token(layer.hoverMode||'none')}`}>
    <picture>{layer.mobileImageUrl&&<source media="(max-width:768px)" srcSet={layer.mobileImageUrl}/>}<img className="bhx-hero-layer-image bhx-layer-image-base" src={layer.imageUrl} alt={String(layer.alt||'')} loading={active&&layer.loading==='eager'?'eager':'lazy'} fetchPriority={active&&layer.fetchPriority==='high'?'high':'auto'} decoding="async"/></picture>
    {layer.hoverImageUrl&&<picture className="bhx-layer-hover-picture">{layer.hoverMobileImageUrl&&<source media="(max-width:768px)" srcSet={layer.hoverMobileImageUrl}/>}<img className="bhx-hero-layer-image" src={layer.hoverImageUrl} alt="" loading="lazy" decoding="async"/></picture>}
    {layer.hoverTintOpacity>0&&<span className="bhx-layer-hover-tint" style={{backgroundColor:color(layer.hoverTintColor,'#000'),opacity:clamp(layer.hoverTintOpacity,0,1,0)}}/>}
    {layer.overlayEnable&&<div className={`bhx-layer-overlay bhx-layer-overlay-${token(layer.overlayVisibility||'hover')} bhx-layer-overlay-mobile-${token(layer.overlayMobile||'always')} bhx-layer-overlay-pos-${token(layer.overlayPosition||'center')} bhx-layer-overlay-align-${token(layer.overlayAlign||'center')} bhx-layer-overlay-effect-${token(layer.overlayEffect||'fade_up')}`} style={{color:color(layer.overlayTextColor,'#fff'),'--bhx-overlay-padding-d':`${Math.max(0,Number(layer.overlayPaddingDesktop||24))}px`,'--bhx-overlay-padding-m':`${Math.max(0,Number(layer.overlayPaddingMobile||18))}px`,'--bhx-overlay-tint':layer.overlayTintType==='gradient'?`linear-gradient(${Number(layer.overlayTintAngle||135)}deg,${color(layer.overlayTintColor,'#000')},${color(layer.overlayTintColor2,'#4f46e5')})`:color(layer.overlayTintColor,'#000'),'--bhx-overlay-opacity':clamp(layer.overlayTintOpacity,0,1,.58)} as CssVars}><span className="bhx-layer-overlay-bg"/>{layer.overlayBadge&&<small>{layer.overlayBadge}</small>}{layer.overlayTitle&&<strong>{layer.overlayTitle}</strong>}{layer.overlayText&&<span>{layer.overlayText}</span>}{layer.overlayButtonText&&layer.overlayButtonUrl&&<span className="bhx-layer-overlay-button">{layer.overlayButtonText}</span>}</div>}
  </div>
  const rel=String(layer.linkRel||'').trim()||(target?'noopener noreferrer':undefined)
  const content=layer.linkUrl?<a href={safeHref(layer.linkUrl)} target={target} rel={rel}>{image}</a>:image
  return <div className={`bhx-hero-layer bhx-hero-layer-${token(name)} bhx-layer-pos-${token(layer.positionMode||'absolute')} bhx-layer-align-d-${token(layer.alignDesktop||'center')} bhx-layer-align-m-${token(layer.alignMobile||'center')} bhx-layer-enter-d-${token(layer.entranceDesktop||'none')} bhx-layer-enter-m-${token(layer.entranceMobile||'none')} bhx-layer-loop-d-${token(layer.loopDesktop||'none')} bhx-layer-loop-m-${token(layer.loopMobile||'none')} bhx-layer-parallax-${token(layer.parallaxMode||'none')} ${layer.hideDesktop?'bhx-layer-hide-d':''} ${layer.hideMobile?'bhx-layer-hide-m':''} ${layer.mobileDisableAnimation?'bhx-layer-no-motion-m':''}`} style={{...style,zIndex:Number(layer.zIndex||1)}} data-scroll-motion={Object.keys(layer).some(k=>k.startsWith('scroll')&&k.endsWith('DesktopEnabled')&&layer[k]===true)?'1':undefined}>{content}</div>
}

function AnimatedLayers({layers,active}:{layers?:AnyMap;active:boolean}){
  if(!layers)return null
  return <div className="bhx-hero-layers">
    <Layer layer={layers.main} name="main" active={active}/><Layer layer={layers.textArt} name="text-art" active={active}/><Layer layer={layers.accent1} name="accent-1" active={active}/><Layer layer={layers.accent2} name="accent-2" active={active}/><Layer layer={layers.accent3} name="accent-3" active={active}/><Layer layer={layers.accent4} name="accent-4" active={active}/>
  </div>
}

function slideContentPosition(slide:HeroSlide,mobile=false){
  const raw=String(mobile?slide.contentPositionMobile:slide.contentPositionDesktop||'auto')
  if(raw!=='auto')return raw
  const main=slide.layers?.main
  if(!main?.enabled)return 'normal'
  const x=Number(mobile?main.anchorXMobile:main.anchorXDesktop)
  if(Number.isFinite(x))return x>=56?'left':x<=44?'right':'center'
  return 'normal'
}

function Slide({slide,index,active,layoutStyle,headlineFontFamily,headlineFontWeight,subFontFamily,subFontWeight}:{slide:HeroSlide;index:number;active:boolean;layoutStyle:string;headlineFontFamily?:string;headlineFontWeight?:string;subFontFamily?:string;subFontWeight?:string}){
  const posD=slideContentPosition(slide,false),posM=slideContentPosition(slide,true)
  const main=slide.layers?.main
  const vars:CssVars={
    '--bhx-slide-pt-d':`${Number(slide.paddingTopDesktop??0)}px`,'--bhx-slide-pb-d':`${Number(slide.paddingBottomDesktop??0)}px`,'--bhx-slide-pl-d':`${Number(slide.paddingLeftDesktop??10)}%`,'--bhx-slide-pr-d':`${Number(slide.paddingRightDesktop??10)}%`,
    '--bhx-slide-pt-m':`${Number(slide.paddingTopMobile??36)}px`,'--bhx-slide-pb-m':`${Number(slide.paddingBottomMobile??36)}px`,'--bhx-slide-pl-m':`${Number(slide.paddingLeftMobile??18)}px`,'--bhx-slide-pr-m':`${Number(slide.paddingRightMobile??18)}px`,
    '--bhx-title-size-d':`${clamp(slide.headlineSizeDesktop,10,200,64)}px`,'--bhx-title-size-m':`${clamp(slide.headlineSizeMobile,10,160,36)}px`,'--bhx-sub-size-d':`${clamp(slide.subHeadlineSizeDesktop,8,100,24)}px`,'--bhx-sub-size-m':`${clamp(slide.subHeadlineSizeMobile,8,80,18)}px`,
    '--bhx-title-color':color(slide.headlineColor,'#fff'),'--bhx-sub-color':color(slide.subHeadlineColor,'#e5e7eb'),'--bhx-text-anim-duration':`${clamp(slide.animationDuration,.1,3,1)}s`,'--bhx-text-anim-delay':`${clamp(slide.animationDelay,0,3,0)}s`,
    '--bhx-button-gap-d':`${Math.max(0,Number(slide.buttonTopGapDesktop||0))}px`,'--bhx-button-gap-m':`${Math.max(0,Number(slide.buttonTopGapMobile??slide.buttonTopGapDesktop??0))}px`,
  }
  const hFont=fontFamily(headlineFontFamily),sFont=fontFamily(subFontFamily)
  if(hFont)vars['--bhx-title-font']=hFont
  if(sFont)vars['--bhx-sub-font']=sFont
  vars['--bhx-title-weight']=headlineFontWeight&&headlineFontWeight!=='normal'?headlineFontWeight:'800'
  vars['--bhx-sub-weight']=subFontWeight&&subFontWeight!=='normal'?subFontWeight:'400'
  const alignD=String(slide.textAlignDesktop||'center'),alignM=String(slide.textAlignMobile||'center')
  const buttonCount=Number(slide.buttonCount||1)===2?2:1
  const customMobile=slide.buttonMobileOverride===true
  const mobilePrimary=customMobile?slide.primaryButtonMobile:{fontSize:slide.primaryButtonDesktop?.fontSize,paddingY:slide.primaryButtonDesktop?.paddingY,paddingX:slide.primaryButtonDesktop?.paddingX}
  const mobileSecondary=customMobile?slide.secondaryButtonMobile:{fontSize:slide.secondaryButtonDesktop?.fontSize,paddingY:slide.secondaryButtonDesktop?.paddingY,paddingX:slide.secondaryButtonDesktop?.paddingX}
  const buttonLayoutD=buttonCount===2?String(slide.buttonLayoutDesktop||'inline'):'inline'
  const buttonLayoutM=customMobile&&buttonCount===2?String(slide.buttonLayoutMobile||buttonLayoutD):buttonLayoutD
  const headlineVisible=slide.headlineEnabled!==false&&Boolean(slide.heading)
  const subVisible=slide.subHeadlineEnabled!==false&&Boolean(slide.text)
  return <article className={`bhx-hero-slide ${active?'is-active':''} bhx-content-pos-d-${token(posD)} bhx-content-pos-m-${token(posM)} ${main?.enabled?'has-layer-main-desk has-layer-main-mob':''}`} style={vars} role="group" aria-roledescription="slide" aria-label={`Slide ${index+1}`} aria-hidden={!active}>
    <Background slide={slide} active={active}/>
    {layoutStyle==='layered'&&<AnimatedLayers layers={slide.layers} active={active}/>} 
    <div className={`bhx-hero-content bhx-align-d-${token(alignD)} bhx-align-m-${token(alignM)} bhx-text-anim-d-${token(slide.animationDesktop||'fadeUp')} bhx-text-anim-m-${token(slide.animationMobile||slide.animationDesktop||'fadeUp')}`}>
      {headlineVisible&&<h1 className="bhx-hero-title">{slide.heading}</h1>}
      {subVisible&&<p className="bhx-hero-sub">{slide.text}</p>}
      {slide.buttonsEnabled!==false&&<div className={`bhx-hero-btn-container bhx-btn-layout-d-${token(buttonLayoutD)} bhx-btn-layout-m-${token(buttonLayoutM)}`}>
        <HeroButton kind="primary" content={slide.primaryButton} desktop={slide.primaryButtonDesktop} mobile={mobilePrimary}/>
        {buttonCount===2&&<HeroButton kind="secondary" content={slide.secondaryButton} desktop={slide.secondaryButtonDesktop} mobile={mobileSecondary}/>} 
      </div>}
    </div>
  </article>
}

export default function WebSectionHeroSlider({slides,layoutStyle='classic',autoSlideSeconds=5,pauseOnHover=true,showArrows=true,showDots=true,enableDrag=true,dotSize=12,heightDesktop=700,heightMobile=560,paddingTopDesktop=0,paddingBottomDesktop=0,paddingTopMobile=0,paddingBottomMobile=0,headlineFontFamily,headlineFontWeight,subFontFamily,subFontWeight,shapeTop,shapeBottom}:HeroProps){
  const usable=useMemo(()=>Array.isArray(slides)?slides.filter(Boolean):[],[slides])
  const [active,setActive]=useState(0)
  const [paused,setPaused]=useState(false)
  const rootRef=useRef<HTMLElement|null>(null)
  const dragRef=useRef<{id:number;x:number;y:number;dragged:boolean}|null>(null)

  useEffect(()=>{if(active>=usable.length)setActive(Math.max(0,usable.length-1))},[active,usable.length])
  useEffect(()=>{
    if(paused||usable.length<2||Number(autoSlideSeconds)<=0)return
    const timer=window.setTimeout(()=>setActive(v=>(v+1)%usable.length),Math.max(100,Number(autoSlideSeconds)*1000))
    return()=>window.clearTimeout(timer)
  },[active,autoSlideSeconds,paused,usable.length])
  useEffect(()=>{
    if(!pauseOnHover)return
    const root=rootRef.current
    if(!root)return
    root.querySelectorAll<HTMLVideoElement>('.bhx-hero-bg-video-el').forEach(video=>{
      if(paused&&!video.paused){video.dataset.bhxHoverPaused='1';video.pause()}
      else if(!paused&&video.dataset.bhxHoverPaused==='1'){delete video.dataset.bhxHoverPaused;void video.play().catch(()=>{})}
    })
  },[paused,pauseOnHover,active])
  useEffect(()=>{
    const root=rootRef.current
    if(!root||layoutStyle!=='layered')return
    let raf=0
    const onPointer=(event:PointerEvent)=>{
      if(!root.querySelector('.bhx-layer-parallax-mouse'))return
      const r=root.getBoundingClientRect();const x=((event.clientX-r.left)/Math.max(1,r.width)-.5)*2;const y=((event.clientY-r.top)/Math.max(1,r.height)-.5)*2
      root.style.setProperty('--bhx-parallax-x',x.toFixed(3));root.style.setProperty('--bhx-parallax-y',y.toFixed(3))
    }
    const onScroll=()=>{
      if(raf)return
      raf=requestAnimationFrame(()=>{raf=0;const r=root.getBoundingClientRect();const p=Math.max(-1,Math.min(1,(window.innerHeight/2-(r.top+r.height/2))/Math.max(window.innerHeight,r.height)));root.style.setProperty('--bhx-scroll-progress',p.toFixed(3))})
    }
    root.addEventListener('pointermove',onPointer,{passive:true});window.addEventListener('scroll',onScroll,{passive:true});onScroll()
    return()=>{root.removeEventListener('pointermove',onPointer);window.removeEventListener('scroll',onScroll);if(raf)cancelAnimationFrame(raf)}
  },[layoutStyle])

  if(!usable.length)return <div className="bhx-hero-empty">Add at least one Hero Slide in the Web Section editor.</div>
  const go=(index:number)=>setActive((index+usable.length)%usable.length)
  const goPrev=()=>go(active-1),goNext=()=>go(active+1)
  const rootVars:CssVars={
    '--bhx-hero-height-d':`${Math.max(120,Number(heightDesktop||700))}px`,'--bhx-hero-height-m':`${Math.max(120,Number(heightMobile||560))}px`,'--bhx-hero-outer-pt-d':`${Math.max(0,Number(paddingTopDesktop||0))}px`,'--bhx-hero-outer-pb-d':`${Math.max(0,Number(paddingBottomDesktop||0))}px`,'--bhx-hero-outer-pt-m':`${Math.max(0,Number(paddingTopMobile||0))}px`,'--bhx-hero-outer-pb-m':`${Math.max(0,Number(paddingBottomMobile||0))}px`,'--bhx-hero-dot-size':`${clamp(dotSize,6,30,12)}px`,
  }
  const onPointerDown=(event:ReactPointerEvent<HTMLElement>)=>{
    if(!enableDrag||usable.length<2||(event.target as HTMLElement).closest('a,button,input,textarea,select'))return
    dragRef.current={id:event.pointerId,x:event.clientX,y:event.clientY,dragged:false};event.currentTarget.setPointerCapture?.(event.pointerId);event.currentTarget.classList.add('is-dragging')
  }
  const onPointerMove=(event:ReactPointerEvent<HTMLElement>)=>{const d=dragRef.current;if(!d||d.id!==event.pointerId)return;if(Math.abs(event.clientX-d.x)>10)d.dragged=true}
  const onPointerUp=(event:ReactPointerEvent<HTMLElement>)=>{
    const d=dragRef.current;dragRef.current=null;event.currentTarget.classList.remove('is-dragging');if(!d||d.id!==event.pointerId)return
    const dx=event.clientX-d.x,dy=event.clientY-d.y;if(Math.abs(dx)>=45&&Math.abs(dx)>Math.abs(dy)){dx<0?goNext():goPrev()}
  }

  return <section ref={rootRef} className={`bhx-hero-slider layout-${token(layoutStyle)} ${paused?'is-hover-paused':''} ${enableDrag?'is-draggable':''}`} style={rootVars} role="region" aria-roledescription="carousel" aria-label="BigHostX hero slider" tabIndex={0} onMouseEnter={()=>pauseOnHover&&setPaused(true)} onMouseLeave={()=>pauseOnHover&&setPaused(false)} onKeyDown={(event)=>{if(event.key==='ArrowLeft'){event.preventDefault();goPrev()}else if(event.key==='ArrowRight'){event.preventDefault();goNext()}}} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={(e)=>{dragRef.current=null;e.currentTarget.classList.remove('is-dragging')}}>
    <ShapeDivider position="top" config={shapeTop}/>
    <div className="bhx-hero-scroller" aria-live="polite">
      {usable.map((slide,index)=><Slide key={slide.key||index} slide={slide} index={index} active={index===active} layoutStyle={layoutStyle} headlineFontFamily={headlineFontFamily} headlineFontWeight={headlineFontWeight} subFontFamily={subFontFamily} subFontWeight={subFontWeight}/>) }
    </div>
    {usable.length>1&&showDots&&<div className="bhx-hero-nav" role="tablist" aria-label="Hero slide navigation">{usable.map((slide,index)=><button key={slide.key||index} type="button" className={`bhx-hero-dot ${index===active?'active':''}`} onClick={()=>go(index)} aria-label={`Go to slide ${index+1}`} aria-selected={index===active} role="tab"/>)}</div>}
    {usable.length>1&&showArrows&&<><button type="button" className="bhx-hero-arrow bhx-hero-prev" onClick={goPrev} aria-label="Previous slide"><svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg></button><button type="button" className="bhx-hero-arrow bhx-hero-next" onClick={goNext} aria-label="Next slide"><svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg></button></>}
    <ShapeDivider position="bottom" config={shapeBottom}/>
  </section>
}
