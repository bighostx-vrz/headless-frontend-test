import Image from 'next/image'
import {PortableText} from '@portabletext/react'
import {stegaClean} from 'next-sanity'
import {urlFor} from '@/sanity/lib/image'
import DynamicForm from './DynamicForm'
import CodeSectionV1 from './CodeSectionV1'
import {menuHref} from './MenuRenderer'

const clean=(value:any)=>String(stegaClean(value==null?'':value))
const clamp=(value:any,min:number,max:number,fallback:number)=>{const n=Number(value);return Number.isFinite(n)?Math.max(min,Math.min(max,n)):fallback}
const safeToken=(value:any)=>clean(value).toLowerCase().replace(/[^a-z0-9_-]+/g,'-').replace(/^-+|-+$/g,'')
const safeId=(value:any)=>clean(value).replace(/^#/,'').replace(/[^A-Za-z0-9_-]+/g,'-').replace(/^-+|-+$/g,'')
const safeClasses=(value:any)=>clean(value).split(/\s+/).map(safeToken).filter(Boolean).slice(0,8).join(' ')
const color=(value:any,fallback='')=>value?.hex?clean(value.hex):fallback
const gapValue=(value:any)=>value==='small'?12:value==='large'?36:24
const padValue=(value:any)=>value==='small'?12:value==='medium'?24:value==='large'?40:0
const alignValue=(value:any)=>value==='center'?'center':value==='end'?'flex-end':value==='stretch'?'stretch':'flex-start'
const spacingValue=(value:any)=>value==='none'?0:value==='compact'?16:value==='spacious'?56:value==='standard'?32:0
const widthValue=(value:any)=>value==='narrow'?'800px':value==='wide'?'1440px':value==='full'?'100%':'1200px'

function selectedContentHref(item:any){
  if(item?._type==='post')return `/blog/${safeToken(item?.slug?.current||'')}`
  if(item?._type==='category')return `/category/${safeToken(item?.slug?.current||'')}`
  if(item?._type==='page')return item?.slug?.current==='home'?'/':`/${safeToken(item?.slug?.current||'')}`
  const raw=clean(item?.fileUrl||'').trim();return /^https?:\/\//i.test(raw)?raw:'#'
}

function SandboxedHtmlWidget({html}:{html:any}){
  const allow=process.env.ALLOW_ADVANCED_CODE==='true'
  return <div className="bhx-flex-html-widget"><CodeSectionV1 data={{
    codeHtml:clean(html),codeJsEnabledV1:false,codeAutoHeightV1:true,codeContentWidthV1:'full',codeMaxWidthDesktopV1:2200,codeMaxWidthMobileV1:100,
    codeFrameHeightDesktopV1:320,codeFrameHeightMobileV1:280,codeMinHeightDesktopV1:0,codeMinHeightMobileV1:0,codeOverflowV1:'visible',codeAlignDesktopV1:'left',codeAlignMobileV1:'left',
    codeSectionAnimationDesktopV1:'none',codeSectionAnimationMobileV1:'none',codeOutputAnimationDesktopV1:'none',codeOutputAnimationMobileV1:'none',
  }} allow={allow}/></div>
}

function Widget({widget}:{widget:any}){
  if(!widget||widget.enabled===false)return null
  const type=clean(widget.widgetType||'text')
  const align=['left','center','right'].includes(clean(widget.textAlign))?clean(widget.textAlign):'left'
  const custom=safeClasses(widget.cssClass)
  const wrap=(node:any,extra='')=><div className={`bhx-flex-widget bhx-flex-widget-${safeToken(type)} ${extra} ${custom}`.trim()} style={{textAlign:align as any}}>{node}</div>
  if(type==='heading'){
    const level=['h2','h3','h4','p'].includes(clean(widget.headingLevel))?clean(widget.headingLevel):'h2'
    const Tag=level as 'h2'|'h3'|'h4'|'p'
    return wrap(<Tag>{widget.heading}</Tag>)
  }
  if(type==='text')return wrap(Array.isArray(widget.richText)&&widget.richText.length?<PortableText value={widget.richText}/>:null)
  if(type==='image'&&widget.image?.asset)return wrap(<Image src={urlFor(widget.image).width(1400).height(900).fit('max').url()} alt={clean(widget.alt||'')} width={1400} height={900} sizes="(max-width: 640px) 100vw, (max-width: 900px) 80vw, 60vw" style={{width:'100%',height:'auto'}}/>)
  if(type==='button'){
    const href=menuHref(widget.buttonLink)
    const isNone=clean(widget.buttonLink?.linkType)==='none'
    const button=isNone?<span className={`button button-${safeToken(widget.buttonStyle||'primary')}`}>{widget.buttonLabel||'Learn more'}</span>:<a className={`button button-${safeToken(widget.buttonStyle||'primary')}`} href={href} target={widget.buttonLink?.openNewTab?'_blank':undefined} rel={widget.buttonLink?.openNewTab?'noopener noreferrer':undefined} aria-label={widget.buttonLink?.ariaLabel||undefined}>{widget.buttonLabel||'Learn more'}</a>
    return wrap(button,`bhx-flex-widget-button align-${align}`)
  }
  if(type==='stat')return wrap(<div className="bhx-flex-stat"><strong>{widget.statValue}</strong><span>{widget.statLabel}</span></div>)
  if(type==='feature')return wrap(<div className="bhx-feature">{widget.iconText&&<div className="feature-icon" aria-hidden="true">{widget.iconText}</div>}{widget.heading&&<h3>{widget.heading}</h3>}{widget.text&&<p>{widget.text}</p>}</div>)
  if(type==='form'&&widget.form)return wrap(<DynamicForm form={widget.form}/>)
  if(['linkedContent','latestPosts','categoryPosts'].includes(type))return wrap(<div className="bhx-flex-selected-content">{widget.linkedContent?.map((item:any,i:number)=>{const href=selectedContentHref(item);return <a className="content-card" key={item._id||i} href={href}><div className="card-body"><span className="eyebrow">{item._type}</span><h3>{item.title}</h3>{item.excerpt&&<p>{item.excerpt}</p>}</div></a>})}</div>)
  if(type==='spacer')return wrap(<div className={`bhx-spacer spacer-${safeToken(widget.spacerSize||'medium')}`} aria-hidden="true"/>)
  if(type==='divider')return wrap(<hr className="bhx-flex-divider"/>)
  if(type==='html')return wrap(<SandboxedHtmlWidget html={widget.html}/>)
  return null
}

function rowStyle(row:any){
  const d=row?.design||{}
  const bgType=clean(d.backgroundType||'solid')
  const bgColor=color(d.backgroundColor,'transparent')
  let background:any=bgColor
  if(bgType==='gradient')background=`linear-gradient(${clamp(d.gradientAngle,0,360,135)}deg,${color(d.gradientFrom,'#ffffff')},${color(d.gradientTo,'#f3f4f6')})`
  if(bgType==='image'&&d.backgroundImage?.asset){
    const image=urlFor(d.backgroundImage).width(2200).height(1400).fit('max').url()
    const opacity=clamp(d.overlayOpacity,0,.95,.35)
    background=`linear-gradient(rgba(0,0,0,${opacity}),rgba(0,0,0,${opacity})),url("${image}") center/cover no-repeat`
  }
  const borderStyle=clean(d.borderStyle||'none')
  const border=borderStyle==='none'?'none':`1px solid ${color(d.borderColor,borderStyle==='accent'?color(d.accentColor,'#4f46e5'):'#d1d5db')}`
  const shadow=clean(d.shadow)==='strong'?'0 18px 50px rgba(15,23,42,.20)':clean(d.shadow)==='soft'?'0 10px 30px rgba(15,23,42,.10)':'none'
  const minHeight=clean(d.minHeight||'auto')
  const gap=gapValue(clean(d.gap||'medium'))
  const spacing=spacingValue(clean(d.spacing||'global'))
  return {
    maxWidth:widthValue(clean(d.width||'contained')),width:'100%',marginInline:'auto',background,color:color(d.textColor)||undefined,
    border,borderRadius:clean(d.radius||'8px'),boxShadow:shadow,minHeight:minHeight==='auto'?undefined:minHeight,textAlign:(['left','center','right'].includes(clean(d.textAlign))?clean(d.textAlign):'left') as any,
    paddingBlock:spacing||undefined,['--bhx-flex-gap' as any]:`${gap}px`,['--bhx-flex-row-align' as any]:alignValue(d.verticalAlign),['--bhx-flex-heading' as any]:color(d.headingColor)||'inherit',['--bhx-flex-accent' as any]:color(d.accentColor)||'var(--bhx-accent,#ffbf00)'
  }
}

export default function RowsColumns({rows,ownerId='bhx-flex'}:{rows:any[];ownerId?:string}){
  return <div className="bhx-flex-rows">{rows?.slice(0,40).map((row:any,ri:number)=>{
    const rowId=safeId(row.anchorId)||`${safeId(ownerId)}-row-${ri+1}`
    const design=row?.design||{}
    const rowClasses=['bhx-flex-row',design.hideDesktop?'bhx-flex-hide-desktop':'',design.hideTablet?'bhx-flex-hide-tablet':'',design.hideMobile?'bhx-flex-hide-mobile':'',safeClasses(row.customClass)].filter(Boolean).join(' ')
    return <div id={rowId} key={row._key||ri} className={rowClasses} style={rowStyle(row)} data-bhx-flex-row="true"><div className="bhx-flex-row-grid">{row.columns?.slice(0,6).map((col:any,ci:number)=>{
      const colStyle:any={['--bhx-col-d']:clamp(col.widthDesktop,1,12,12),['--bhx-col-t']:clamp(col.widthTablet,1,12,12),['--bhx-col-m']:clamp(col.widthMobile,1,12,12),['--bhx-flex-col-align']:alignValue(col.verticalAlign),['--bhx-flex-col-bg']:color(col.backgroundColor,'transparent'),['--bhx-flex-col-pad']:`${padValue(clean(col.padding||'none'))}px`}
      return <div key={col._key||ci} className="bhx-flex-column" style={colStyle}>{col.widgets?.slice(0,50).map((widget:any,wi:number)=><Widget widget={widget} key={widget._key||wi}/>)}</div>
    })}</div></div>
  })}</div>
}
