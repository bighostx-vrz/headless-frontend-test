import Image from 'next/image'
import {PortableText} from '@portabletext/react'
import {createDataAttribute, stegaClean} from 'next-sanity'
import {urlFor} from '@/sanity/lib/image'
import WebSectionHeroSlider from './WebSectionHeroSlider'
import WebSectionStaticV1 from './WebSectionStaticV1'
import SectionBackgroundChromeV1 from './SectionBackgroundChromeV1'
import {sectionBackgroundCss} from './sectionBackgroundV1'
import {textTextV1Css} from './textTextV1Css'
import TimelineV1 from './TimelineV1'
import TextSliderV1 from './TextSliderV1'
import TestimonialsV1 from './TestimonialsV1'
import PricingV1 from './PricingV1'
import PricingComparisonV1 from './PricingComparisonV1'
import CtaV1 from './CtaV1'
import {ctaV1Css} from './ctaV1Css'
import ImageAccentCtaV1 from './ImageAccentCtaV1'
import {imageAccentCtaV1Css} from './imageAccentCtaV1Css'
import FaqV1 from './FaqV1'
import {faqV1Css} from './faqV1Css'
import FlexibleV1 from './FlexibleV1'
import {flexibleV1Css} from './flexibleV1Css'
import GalleryV1 from './GalleryV1'
import {galleryV1Css} from './galleryV1Css'
import AlbumV1 from './AlbumV1'
import ContentFilterV1 from './ContentFilterV1'
import ContactV1 from './ContactV1'
import StickyNavV1 from './StickyNavV1'
import {stickyNavV1Css} from './stickyNavV1Css'
import VideoChannelV1 from './VideoChannelV1'
import {videoChannelV1Css} from './videoChannelV1Css'
import BenefitsV1 from './BenefitsV1'
import {benefitsV1Css} from './benefitsV1Css'
import CountdownV1 from './CountdownV1'
import {countdownV1Css} from './countdownV1Css'
import SocialMediaV1 from './SocialMediaV1'
import {socialMediaV1Css} from './socialMediaV1Css'
import TextCardsV1 from './TextCardsV1'
import {textCardsV1Css} from './textCardsV1Css'
import TabsV1 from './TabsV1'
import {tabsV1Css} from './tabsV1Css'
import ListTypesV1 from './ListTypesV1'
import {listTypesV1Css} from './listTypesV1Css'
import FormsV1 from './FormsV1'
import {formsV1Css} from './formsV1Css'
import {contactV1Css} from './contactV1Css'
import {contentFilterV1Css} from './contentFilterV1Css'
import {albumV1Css} from './albumV1Css'
import SectionStudioLink from './SectionStudioLink'
import {frontendModules,disabledFrontendWebSectionTypes} from '@/modules/generated'
import {dataset,projectId,studioUrl} from '@/sanity/env'

function clean(value:any){return stegaClean(value == null ? '' : String(value))}
function webSectionDataAttribute(data:any){
  const id=clean(data?._id||'').replace(/^drafts\./,'')
  if(!id)return undefined
  const type=clean(data?._type)==='bhxConnectedSection'?'bhxConnectedSection':'webSection'
  return createDataAttribute({projectId,dataset,baseUrl:studioUrl,id,type,path:'title'}).toString()
}
function token(value:any){return clean(value).toLowerCase().replace(/[^a-z0-9_-]+/g,'-')}
function color(value:any){return value?.hex ? clean(value.hex) : ''}
function imageUrl(image:any,w=1600,h=1000){return image?.asset ? urlFor(image).width(w).height(h).url() : ''}
function button(item:any,key:string){if(!item?.label||!item?.url)return null;return <a key={key} className={`button button-${token(item.style||'primary')}`} href={clean(item.url)} target={item.newWindow?'_blank':undefined} rel={`${item.newWindow?'noopener noreferrer ':''}${item.nofollow?'nofollow':''}`.trim()||undefined}>{item.label}</a>}
function buttons(items:any[]|undefined,prefix='btn'){return items?.length?<div className="bhx-v1-buttons">{items.map((x,i)=>button(x,`${prefix}-${i}`))}</div>:null}

function ItemCard({item,type}:{item:any,type:string}){
  if(item?.enabled===false)return null
  const href=item?.link?.url?clean(item.link.url):''
  const content=<>
    {item.image?.asset&&<Image className="bhx-v1-item-image" src={imageUrl(item.image,900,600)} alt={clean(item.title||'')} width={900} height={600}/>} 
    <div className="bhx-v1-item-body">
      {item.iconText&&<span className="bhx-v1-icon-label">{item.iconText}</span>}
      {item.eyebrow&&<span className="eyebrow">{item.eyebrow}</span>}
      {(item.value||item.secondaryValue)&&<div className="bhx-v1-values">{item.value&&<strong>{item.value}</strong>}{item.secondaryValue&&<span>{item.secondaryValue}</span>}</div>}
      {item.title&&<h3>{item.title}</h3>}
      {type==='testimonials'&&item.quote?<blockquote>{item.quote}</blockquote>:item.text&&<p>{item.text}</p>}
      {item.role&&<small>{item.role}</small>}
      {item.features?.length>0&&<ul>{item.features.map((f:string,i:number)=><li key={i}>{f}</li>)}</ul>}
      {item.link?.label&&<span className="text-link">{item.link.label} →</span>}
    </div>
  </>
  return href?<a className={`bhx-v1-item bhx-v1-item-${type}`} href={href} target={item.link?.newWindow?'_blank':undefined} rel={item.link?.nofollow?'nofollow':undefined}>{content}</a>:<div className={`bhx-v1-item bhx-v1-item-${type}`}>{content}</div>
}

function SectionHeader({data}:{data:any}){return <div className="bhx-v1-section-header">{data.eyebrow&&<span className="eyebrow">{data.eyebrow}</span>}{data.heading&&<h2>{data.heading}</h2>}{data.paragraph&&<p className="lead">{data.paragraph}</p>}{Array.isArray(data.richText)&&<div className="rich-text"><PortableText value={data.richText}/></div>}{data.readMoreLabel&&data.readMoreUrl&&<p><a className="text-link" href={clean(data.readMoreUrl)}>{data.readMoreLabel} →</a></p>}</div>}

function heroLayer(data:any){
  if(!data)return undefined
  return {
    ...data,
    imageUrl:data.image?.asset?imageUrl(data.image,1800,1800):undefined,
    mobileImageUrl:data.mobileImage?.asset?imageUrl(data.mobileImage,1000,1200):undefined,
    hoverImageUrl:data.hoverImage?.asset?imageUrl(data.hoverImage,1800,1800):undefined,
    hoverMobileImageUrl:data.hoverMobileImage?.asset?imageUrl(data.hoverMobileImage,1000,1200):undefined,
  }
}
function heroLegacyButton(item:any,index:number){
  if(!item)return undefined
  const style=clean(item.style||'primary')
  return {
    content:{contentMode:'text',text:clean(item.label||''),linkType:'custom',link:clean(item.url||''),target:item.newWindow?'blank':'self'},
    desktop:index===0
      ?{style:style==='outline'?'outline':'solid',color:'#ffffff',background:'#4f46e5',radiusMode:'all',radius:50,borderType:style==='outline'?'solid':'none',borderWidth:style==='outline'?2:0,borderColor:'#ffffff',fontSize:18,paddingY:15,paddingX:40,hoverType:'simple',hoverColor:'#ffffff',hoverBackground:'#4338ca',hoverTextMotion:'up',hoverDuration:450}
      :{style:style==='outline'?'outline':'solid',color:'#333333',background:'#ffffff',radiusMode:'all',radius:100,borderType:'solid',borderWidth:2,borderColor:'#333333',fontSize:18,paddingY:10,paddingX:10,hoverType:'simple',hoverColor:'#ffffff',hoverBackground:'#333333',hoverTextMotion:'up',hoverDuration:450},
    mobile:index===0?{fontSize:16,paddingY:12,paddingX:30}:{fontSize:16,paddingY:10,paddingX:10},
  }
}
function Hero({data}:{data:any}){
  const legacy={
    _key:'legacy-hero',heading:data.heading,text:data.paragraph,buttons:data.buttons,
    backgroundType:data.backgroundType,backgroundColor:data.backgroundColor,backgroundColor2:data.backgroundColor2,
    gradientFrom:data.gradientFrom,gradientTo:data.gradientTo,gradientAngle:data.gradientAngle,backgroundImage:data.backgroundImage,backgroundVideoUrl:data.backgroundVideoUrl,overlayOpacity:data.overlayOpacity,
  }
  // v6.2.0/v6.2.1 per-slide `enabled` data is preserved but not used: verified WP Hero has no per-slide Enabled control.
  const source=Array.isArray(data.heroSlides)?data.heroSlides.filter(Boolean):[]
  const ownedSlides=source.length?source:[legacy]
  const slides=ownedSlides.map((slide:any,i:number)=>{
    const legacyButtons=Array.isArray(slide.buttons)?slide.buttons:[]
    const legacyPrimary=heroLegacyButton(legacyButtons[0],0)
    const legacySecondary=heroLegacyButton(legacyButtons[1],1)
    const backgroundType=clean(slide.backgroundType||((slide.image?.asset||slide.backgroundImage?.asset)?'image':data.backgroundType||'gradient'))
    return {
      ...slide,
      key:clean(slide._key||`hero-${i}`),headlineEnabled:slide.headlineEnabled!==false,heading:clean(slide.heading||''),subHeadlineEnabled:slide.subHeadlineEnabled!==false,text:clean(slide.text||''),
      buttonsEnabled:slide.buttonsEnabled!==false,buttonCount:Number(slide.buttonCount||legacyButtons.length||1)>=2?2:1,
      primaryButton:slide.primaryButton||legacyPrimary?.content,secondaryButton:slide.secondaryButton||legacySecondary?.content,
      primaryButtonDesktop:slide.primaryButtonDesktop||legacyPrimary?.desktop,secondaryButtonDesktop:slide.secondaryButtonDesktop||legacySecondary?.desktop,
      primaryButtonMobile:slide.primaryButtonMobile||legacyPrimary?.mobile,secondaryButtonMobile:slide.secondaryButtonMobile||legacySecondary?.mobile,
      backgroundType,backgroundColor:color(slide.backgroundColor)||color(data.backgroundColor)||'#0f172a',
      gradientFrom:color(slide.gradientFrom)||color(data.gradientFrom)||'#f8fafc',gradientTo:color(slide.gradientTo)||color(data.gradientTo)||'#e5e7eb',
      gradientStart:Number.isFinite(slide.gradientStart)?Number(slide.gradientStart):0,gradientEnd:Number.isFinite(slide.gradientEnd)?Number(slide.gradientEnd):100,
      gradientDirection:['135deg','diag'].includes(clean(slide.gradientDirection||'right'))?'right':clean(slide.gradientDirection||'right'),
      backgroundImageUrl:slide.backgroundImage?.asset?imageUrl(slide.backgroundImage,2400,1500):(slide.image?.asset?imageUrl(slide.image,2400,1500):(data.backgroundImage?.asset?imageUrl(data.backgroundImage,2400,1500):undefined)),
      mobileBackgroundImageUrl:slide.mobileBackgroundImage?.asset?imageUrl(slide.mobileBackgroundImage,1000,1300):(slide.mobileImage?.asset?imageUrl(slide.mobileImage,1000,1300):undefined),
      imageTint1:color(slide.imageTint1)||color(slide.overlayColor)||'#0f172a',imageTint2:color(slide.imageTint2)||'#7c3aed',
      backgroundVideoUrl:clean(slide.backgroundVideoUrl||data.backgroundVideoUrl||slide.videoUrl||''),videoTint:color(slide.videoTint)||'#000000',
      splitColor1:color(slide.splitColor1)||color(slide.backgroundColor)||'#0F172A',splitColor2:color(slide.splitColor2)||color(slide.backgroundColor2)||'#2563EB',
      splitImage1Url:slide.splitImage1?.asset?imageUrl(slide.splitImage1,2000,1400):undefined,splitImage2Url:slide.splitImage2?.asset?imageUrl(slide.splitImage2,2000,1400):undefined,
      headlineColor:color(slide.headlineColor)||color(slide.headingColor)||'#ffffff',subHeadlineColor:color(slide.subHeadlineColor)||color(slide.textColor)||'#e5e7eb',
      layers:slide.layers?{main:heroLayer(slide.layers.main),textArt:heroLayer(slide.layers.textArt),accent1:heroLayer(slide.layers.accent1),accent2:heroLayer(slide.layers.accent2),accent3:heroLayer(slide.layers.accent3),accent4:heroLayer(slide.layers.accent4)}:undefined,
    }
  })
  const legacySeconds=data.heroAutoplay===false?0:(Number.isFinite(Number(data.heroAutoplayDelay))?Number(data.heroAutoplayDelay)/1000:5)
  const legacyHeight=clean(data.heroHeight||'')
  const legacyHeightPx=legacyHeight==='compact'?420:legacyHeight==='standard'?560:legacyHeight==='tall'?720:700
  return <WebSectionHeroSlider slides={slides} layoutStyle={clean(data.heroLayoutStyle||'classic')}
    autoSlideSeconds={Number.isFinite(Number(data.heroAutoSlideSeconds))?Number(data.heroAutoSlideSeconds):legacySeconds}
    pauseOnHover={data.heroPauseOnHover!==false} showArrows={data.heroShowArrows!==false} showDots={data.heroShowDots!==false} enableDrag={data.heroEnableDrag!==false}
    dotSize={Number.isFinite(Number(data.heroDotSize))?Number(data.heroDotSize):12}
    heightDesktop={Number.isFinite(Number(data.heroHeightDesktop))?Number(data.heroHeightDesktop):legacyHeightPx} heightMobile={Number.isFinite(Number(data.heroHeightMobile))?Number(data.heroHeightMobile):560}
    paddingTopDesktop={Number(data.heroPaddingTopDesktop||0)} paddingBottomDesktop={Number(data.heroPaddingBottomDesktop||0)} paddingTopMobile={Number(data.heroPaddingTopMobile||0)} paddingBottomMobile={Number(data.heroPaddingBottomMobile||0)}
    headlineFontFamily={clean(data.heroHeadlineFontFamily||'Use Global Heading Font')} headlineFontWeight={clean(data.heroHeadlineFontWeight||'normal')}
    subFontFamily={clean(data.heroSubFontFamily||'Use Global Body Font')} subFontWeight={clean(data.heroSubFontWeight||'normal')}
    shapeTop={{style:clean(data.heroShapeTopStyle||'none'),color:color(data.heroShapeTopColor)||'#ffffff',height:Number(data.heroShapeTopHeight||100),mobileHeight:Number.isFinite(Number(data.heroShapeTopMobileHeight))?Number(data.heroShapeTopMobileHeight):undefined,direction:clean(data.heroShapeTopDirection||'normal'),opacity:Number.isFinite(Number(data.heroShapeTopOpacity))?Number(data.heroShapeTopOpacity):1}}
    shapeBottom={{style:clean(data.heroShapeBottomStyle||'none'),color:color(data.heroShapeBottomColor)||'#ffffff',height:Number(data.heroShapeBottomHeight||100),mobileHeight:Number.isFinite(Number(data.heroShapeBottomMobileHeight))?Number(data.heroShapeBottomMobileHeight):undefined,direction:clean(data.heroShapeBottomDirection||'normal'),opacity:Number.isFinite(Number(data.heroShapeBottomOpacity))?Number(data.heroShapeBottomOpacity):1}}/>
}

function TwoColumn({data,type}:{data:any,type:string}){
  const media=data.media?.asset?<Image src={imageUrl(data.media,1200,900)} alt={clean(data.heading||'')} width={1200} height={900}/>:data.videoUrl?<a className="bhx-v1-video-link" href={clean(data.videoUrl)} target="_blank" rel="noopener noreferrer">Open video ↗</a>:null
  const text=<div className="bhx-v1-column bhx-v1-text"><SectionHeader data={data}/>{buttons(data.buttons,'main')}</div>
  const mediaCol=<div className="bhx-v1-column bhx-v1-media">{media}</div>
  const hideText=data.columnVisibility==='column2'
  const hideMedia=data.columnVisibility==='column1'
  return <div className={`bhx-v1-two-column bhx-v1-layout-${token(data.desktopLayout||'text-media')} bhx-v1-balance-${token(data.widthBalance||'50-50')}`}>{!hideText&&(data.desktopLayout==='media-text'?null:text)}{!hideMedia&&mediaCol}{!hideText&&data.desktopLayout==='media-text'&&text}{type==='contact'&&data.mapUrl&&<a className="bhx-v1-map-link" href={clean(data.mapUrl)} target="_blank" rel="noopener noreferrer">Open map ↗</a>}</div>
}

function CodeSection({data}:{data:any}){const allow=process.env.ALLOW_ADVANCED_CODE==='true';return <div className="bhx-v1-code-section"><SectionHeader data={data}/>{allow&&data.codeHtml?<div dangerouslySetInnerHTML={{__html:clean(data.codeHtml)}}/>:<div className="bhx-v1-code-disabled">Advanced HTML/embed output is disabled. Set ALLOW_ADVANCED_CODE=true only on trusted deployments.</div>}</div>}

function ItemSection({data,type}:{data:any,type:string}){
  const items=(data.items||[]).filter((x:any)=>x?.enabled!==false)
  if(type==='tabs')return <><SectionHeader data={data}/><div className={`bhx-v1-items bhx-v1-${type}`}>{items.map((item:any,i:number)=><details key={i}><summary>{item.title||item.eyebrow||`Item ${i+1}`}</summary><div>{item.text&&<p>{item.text}</p>}{item.features?.length>0&&<ul>{item.features.map((f:string,j:number)=><li key={j}>{f}</li>)}</ul>}</div></details>)}</div>{buttons(data.buttons,'section')}</>
  if(type==='countdown')return <><SectionHeader data={data}/>{data.countdownTarget&&<time className="bhx-v1-countdown" dateTime={clean(data.countdownTarget)}>{new Date(clean(data.countdownTarget)).toLocaleString()}</time>}{buttons(data.buttons,'section')}</>
  return <><SectionHeader data={data}/><div className={`bhx-v1-items bhx-v1-items-${type}`}>{items.map((item:any,i:number)=><ItemCard key={i} item={item} type={type}/>)}</div>{buttons(data.buttons,'section')}</>
}


function shadowPreset(value:any){
  const v=clean(value||'none')
  if(v==='soft')return '0 10px 25px rgba(15,23,42,.08)'
  if(v==='medium')return '0 14px 32px rgba(15,23,42,.14)'
  if(v==='strong')return '0 20px 44px rgba(15,23,42,.20)'
  return 'none'
}
function wpParityCss(id:string,data:any,type:string){
  const c=(value:any,fallback:string)=>color(value)||fallback
  const n=(value:any,fallback:number,min=0,max=9999)=>Math.max(min,Math.min(max,Number.isFinite(Number(value))?Number(value):fallback))
  switch(type){
    case 'texttext': return textTextV1Css(id,data)
    case 'cta': return ctaV1Css(id,data)
    case 'image_accent_cta': return imageAccentCtaV1Css(id,data)
    case 'services': {const desk=n(data.servicesColumnsDesktopV1,3,1,6);const tabRaw=clean(data.servicesColumnsTabletModeV1||data.servicesColumnsTabletV1||'inherit');const tab=tabRaw==='inherit'?(desk===1?1:desk>=4?3:2):n(tabRaw,2,1,6);const mob=n(data.servicesColumnsMobileV1,1,1,4);const bgType=clean(data.servicesCardBackgroundTypeDesktopV1||'solid');const cardBg=bgType==='transparent'?'transparent':bgType==='gradient'?`linear-gradient(${n(data.servicesCardGradientAngleV1,135,0,360)}deg,${c(data.servicesCardGradient1V1,'#ffffff')},${c(data.servicesCardGradient2V1,'#f8fafc')})`:c(data.servicesCardBackgroundDesktopV1,'#ffffff');const font=(v:any)=>{const x=clean(v||'inherit');return x==='inherit'?'inherit':x};const line=clean(data.servicesGridLineStyleV1||'none');return `#${id}{--bhx-services-cols:${desk};--bhx-services-cols-tablet:${tab};--bhx-services-cols-mobile:${mob};--bhx-service-icon-btn-size:${n(data.servicesIconButtonSizeDesktopV1,46,24,100)}px;--bhx-service-icon-btn-size-mobile:${n(data.servicesIconButtonSizeMobileV1,42,24,100)}px}#${id} .bhx-services-grid{display:flex;flex-wrap:wrap;gap:${n(data.servicesGapDesktopV1,30,0,100)}px;align-items:stretch;justify-content:${clean(data.servicesLastRowAlignDesktopV1||'start')==='center'?'center':clean(data.servicesLastRowAlignDesktopV1||'start')==='end'?'flex-end':clean(data.servicesLastRowAlignDesktopV1||'start')==='stretch'?'space-between':'flex-start'}#${id} .bhx-service-card{position:relative;flex:0 0 calc((100% - ${(n(data.servicesColumnsDesktopV1,3,1,6)-1)} * ${n(data.servicesGapDesktopV1,30,0,100)}px)/${n(data.servicesColumnsDesktopV1,3,1,6)});border-style:${clean(data.servicesCardBorderStyleDesktopV1||'solid')};border-width:${n(data.servicesCardBorderWidthDesktopV1,1,0,20)}px;border-color:${c(data.servicesCardBorderColorDesktopV1,'#e5e7eb')};border-top-width:${data.servicesCardBorderTopDesktopV1===false?0:n(data.servicesCardBorderWidthDesktopV1,1,0,20)}px;border-right-width:${data.servicesCardBorderRightDesktopV1===false?0:n(data.servicesCardBorderWidthDesktopV1,1,0,20)}px;border-bottom-width:${data.servicesCardBorderBottomDesktopV1===false?0:n(data.servicesCardBorderWidthDesktopV1,1,0,20)}px;border-left-width:${data.servicesCardBorderLeftDesktopV1===false?0:n(data.servicesCardBorderWidthDesktopV1,1,0,20)}px;border-radius:${n(data.servicesCardRadiusDesktopV1,12,0,100)}px;padding:${n(data.servicesCardPaddingDesktopV1,30,0,120)}px;text-align:${clean(data.servicesContentAlignDesktopV1||'center')};align-content:${clean(data.servicesContentVAlignDesktopV1||'start')};box-shadow:${shadowPreset(data.servicesShadowV1)};background:${cardBg};transform:scale(${n(data.servicesCardScaleDesktopV1,100,50,150)/100});transform-origin:center}#${id} .bhx-service-card .bhx-service-visual img{width:100%;object-fit:cover}${clean(data.servicesCardImageLayoutV1||data.servicesImageLayoutV1||'content')==='full'?`#${id} .bhx-service-card .bhx-service-visual{margin-left:-${n(data.servicesCardPaddingDesktopV1,30,0,120)}px;margin-right:-${n(data.servicesCardPaddingDesktopV1,30,0,120)}px;margin-top:-${n(data.servicesCardPaddingDesktopV1,30,0,120)}px}`:''}#${id} .bhx-service-card .bhx-image-shape-circle img{border-radius:50%}#${id} .bhx-service-card .bhx-image-shape-rounded img{border-radius:16px}#${id} .bhx-service-card .bhx-v1-card-icon{display:grid;place-items:center;margin-bottom:16px}${data.servicesCardDecorEnabledV1?`#${id} .bhx-service-card:after{content:"";position:absolute;background:${c(data.servicesCardDecorColorV1,'#4f46e5')};${['top','bottom'].includes(clean(data.servicesCardDecorPositionV1||'top'))?`width:${n(data.servicesCardDecorLengthV1,40,5,100)}%;height:${n(data.servicesCardDecorThicknessV1,3,1,20)}px;left:50%;transform:translateX(-50%);${clean(data.servicesCardDecorPositionV1||'top')==='bottom'?'bottom:0':'top:0'}`:`height:${n(data.servicesCardDecorLengthV1,40,5,100)}%;width:${n(data.servicesCardDecorThicknessV1,3,1,20)}px;top:50%;transform:translateY(-50%);${clean(data.servicesCardDecorPositionV1||'top')==='right'?'right:0':'left:0'}`}}`:''}#${id} .bhx-service-card .bhx-icon-shape-circle{border-radius:50%}#${id} .bhx-service-card .bhx-icon-shape-rounded{border-radius:16px}#${id} .bhx-service-card h3{font-size:${n(data.servicesTitleSizeDesktopV1,22,10,80)}px;color:${c(data.servicesTitleColorV1,'#111827')};font-family:${font(data.servicesTitleFontFamilyV1)};font-weight:${clean(data.servicesTitleFontWeightV1||'normal')}}#${id} .bhx-service-card p{font-size:${n(data.servicesTextSizeDesktopV1,15,10,50)}px;color:${c(data.servicesTextColorV1,'#4b5563')};font-family:${font(data.servicesTextFontFamilyV1)};font-weight:${clean(data.servicesTextFontWeightV1||'normal')}}#${id} .bhx-service-price{font-size:${n(data.servicesPriceSizeDesktopV1,18,10,60)}px;font-weight:800;margin-top:10px;color:${c(data.servicesPriceColorV1,'#db2777')}}#${id} .bhx-service-rating{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-top:8px;color:${c(data.servicesStarColorV1,'#fbbf24')};font-size:${n(data.servicesStarSizeDesktopV1,16,10,50)}px}#${id} .bhx-service-rating strong{font-size:${n(data.servicesRatingValueSizeDesktopV1,16,10,50)}px}#${id} .bhx-service-rating small{font-size:${n(data.servicesReviewSizeDesktopV1,14,10,50)}px;color:${c(data.servicesReviewColorV1,'#64748b')}}#${id} .bhx-service-icon-buttons{display:flex;gap:8px;align-items:center;margin-top:16px;flex-wrap:wrap}#${id} .bhx-service-icon-buttons a{width:auto;min-width:var(--bhx-service-icon-btn-size);height:var(--bhx-service-icon-btn-size);display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:0 12px;border-radius:999px;color:${c(data.servicesIconButtonColorV1,'#111827')};background:${c(data.servicesIconButtonBackgroundV1,'#ffffff')};border:1px solid rgba(128,128,128,.22);text-decoration:none}#${id} .bhx-service-icon-buttons a:hover,#${id} .bhx-service-icon-buttons a:focus-visible{color:${c(data.servicesIconButtonHoverColorV1,'#ffffff')};background:${c(data.servicesIconButtonHoverBackgroundV1,'#111827')}}#${id} .bhx-service-icon-buttons-top_right{position:absolute;top:12px;right:12px;margin:0}#${id} .bhx-service-icon-buttons-bottom_right{justify-content:flex-end}#${id} .bhx-service-icon-buttons-overlay{position:absolute;right:12px;bottom:12px;margin:0}${line!=='none'?`#${id} .bhx-service-card{border-style:${line};border-width:${n(data.servicesGridLineWidthV1,1,1,10)}px;border-color:${c(data.servicesGridLineColorV1,'#e5e7eb')}}#${id} .bhx-services-grid{background:linear-gradient(to right,transparent 0,transparent ${Math.max(0,(100-n(data.servicesGridLineSizeV1,100,10,100))/2)}%,${c(data.servicesGridLineColorV1,'#e5e7eb')} ${Math.max(0,(100-n(data.servicesGridLineSizeV1,100,10,100))/2)}%,transparent ${100-Math.max(0,(100-n(data.servicesGridLineSizeV1,100,10,100))/2)}%)}`:''}#${id} .bhx-last-row-center{justify-content:center}#${id} .bhx-last-row-end{justify-content:end}.bhx-last-row-stretch{}@media(max-width:900px){#${id}{--bhx-services-cols-tablet:${tab}}#${id} .bhx-services-grid{display:flex;gap:${clean(data.servicesGapTabletV1||'inherit')==='inherit'?n(data.servicesGapDesktopV1,30,0,100):n(data.servicesGapTabletV1,30,0,100)}px}#${id} .bhx-service-card{flex-basis:calc((100% - ${(tab-1)} * ${clean(data.servicesGapTabletV1||'inherit')==='inherit'?n(data.servicesGapDesktopV1,30,0,100):n(data.servicesGapTabletV1,30,0,100)}px)/${tab});padding:${clean(data.servicesCardPaddingTabletV1||'inherit')==='inherit'?n(data.servicesCardPaddingDesktopV1,30,0,120):n(data.servicesCardPaddingTabletV1,30,0,120)}px;border-radius:${clean(data.servicesCardRadiusTabletV1||'inherit')==='inherit'?n(data.servicesCardRadiusDesktopV1,12,0,100):n(data.servicesCardRadiusTabletV1,12,0,100)}px}#${id} .bhx-service-card h3{font-size:${clean(data.servicesTitleSizeTabletV1||'inherit')==='inherit'?n(data.servicesTitleSizeDesktopV1,22,10,80):n(data.servicesTitleSizeTabletV1,22,10,80)}px}#${id} .bhx-service-card p{font-size:${clean(data.servicesTextSizeTabletV1||'inherit')==='inherit'?n(data.servicesTextSizeDesktopV1,15,10,50):n(data.servicesTextSizeTabletV1,15,10,50)}px}}@media(max-width:767px){#${id}{--bhx-service-icon-btn-size:var(--bhx-service-icon-btn-size-mobile)}#${id} .bhx-services-grid{display:flex;gap:${n(data.servicesGapMobileV1,15,0,100)}px;justify-content:${clean(data.servicesLastRowAlignMobileV1||'start')==='center'?'center':clean(data.servicesLastRowAlignMobileV1||'start')==='end'?'flex-end':clean(data.servicesLastRowAlignMobileV1||'start')==='stretch'?'space-between':'flex-start'}#${id} .bhx-service-card{flex-basis:calc((100% - ${(mob-1)} * ${n(data.servicesGapMobileV1,15,0,100)}px)/${mob});padding:${n(data.servicesCardPaddingMobileV1,20,0,120)}px;border-style:${clean(data.servicesCardBorderStyleMobileV1||'inherit')==='inherit'?clean(data.servicesCardBorderStyleDesktopV1||'solid'):clean(data.servicesCardBorderStyleMobileV1||'solid')};border-width:${n(data.servicesCardBorderWidthMobileV1,1,0,20)}px;border-color:${c(data.servicesCardBorderColorMobileV1,'#e5e7eb')};border-radius:${n(data.servicesCardRadiusMobileV1,12,0,100)}px;text-align:${clean(data.servicesContentAlignMobileV1||'center')};align-content:${clean(data.servicesContentVAlignMobileV1||'start')};background:${c(data.servicesCardBackgroundMobileV1,'#ffffff')};transform:scale(${n(data.servicesCardScaleMobileV1,100,50,150)/100})}#${id} .bhx-last-row-mobile-center{justify-content:center}#${id} .bhx-last-row-mobile-end{justify-content:end}#${id} .bhx-service-card h3{font-size:${n(data.servicesTitleSizeMobileV1,20,10,80)}px}#${id} .bhx-service-card p{font-size:${n(data.servicesTextSizeMobileV1,14,10,50)}px}#${id} .bhx-service-card .bhx-v1-card-icon{width:${n(data.servicesIconSizeMobileV1,80,20,300)}px!important;height:${n(data.servicesIconSizeMobileV1,80,20,300)}px!important}}`}
    case 'textmedia': {const shape=clean(data.textMediaShapeV1||'rounded');const mobShape=clean(data.textMediaShapeMobileV1||'inherit');const divider=clean(data.textMediaDividerStyleV1||'solid');return `#${id} .bhx-v1-two-column{gap:${n(data.textMediaColumnGapV1,50,0,160)}px;align-items:center}#${id} .bhx-v1-text{text-align:${clean(data.textMediaTextAlignDesktopV1||'left')}}#${id} .bhx-v1-media{display:grid;grid-template-columns:repeat(${n(data.textMediaMediaColumnsDesktopV1,1,1,2)},minmax(0,1fr));gap:16px;transform:scale(${n(data.textMediaSizeDesktopV1,100,20,150)/100});transform-origin:center}#${id} .bhx-v1-media img,#${id} .bhx-v1-media iframe,#${id} .bhx-v1-media video{width:100%;max-width:100%;aspect-ratio:16/9;border:0;border-radius:${shape==='circle'?'50%':shape==='none'?'0':n(data.textMediaRadiusV1,16,0,100)+'px'};object-fit:${clean(data.textMediaFitV1||'cover')};box-shadow:${data.textMediaShadowEnabledV1===false?'none':shadowPreset(data.textMediaShadowV1)}}${data.textMediaDividerV1?`#${id} .bhx-v1-media{border-left:${n(data.textMediaDividerThicknessV1,1,1,10)}px ${divider} ${c(data.textMediaDividerColorV1,'#e5e7eb')};min-height:${n(data.textMediaDividerHeightDesktopV1,100,10,100)}%;padding-left:${Math.max(16,n(data.textMediaColumnGapV1,50)/2)}px}`:''}#${id} .bhx-textmedia-readmore{margin-top:18px}#${id} .bhx-textmedia-readmore summary{cursor:pointer;font-weight:700}#${id} .bhx-textmedia-readmore-trigger{margin-top:18px}#${id} .bhx-textmedia-readmore-modal{position:fixed;inset:0;z-index:99999;background:rgba(2,6,23,.64);display:grid;place-items:center;padding:20px}#${id} .bhx-textmedia-readmore-dialog{position:relative;width:min(680px,100%);max-height:80vh;overflow:auto;background:var(--page-bg,#fff);color:inherit;border-radius:16px;padding:28px;box-shadow:0 24px 80px rgba(2,6,23,.35)}#${id} .bhx-textmedia-readmore-close{position:absolute;right:10px;top:8px;border:0;background:transparent;font-size:28px;cursor:pointer}@media(max-width:767px){#${id} .bhx-v1-two-column{gap:${n(data.textMediaColumnGapMobileV1,24,0,120)}px;--bhx-textmedia-mobile-ratio:${clean(data.textMediaSplitRatioMobileV1||'50/50')};grid-template-columns:1fr}#${id} .bhx-v1-text{text-align:${clean(data.textMediaTextAlignMobileV1||'left')}}#${id} .bhx-v1-media{grid-template-columns:repeat(${n(data.textMediaMediaColumnsMobileV1,1,1,2)},minmax(0,1fr));transform:scale(${n(data.textMediaSizeMobileV1,100,20,150)/100})}${data.textMediaDividerV1?`#${id} .bhx-v1-media{border-left:0;padding-left:0;border-top:${n(data.textMediaDividerThicknessV1,1,1,10)}px ${divider} ${c(data.textMediaDividerColorV1,'#e5e7eb')};width:${n(data.textMediaDividerWidthMobileV1,100,10,100)}%;padding-top:${Math.max(12,n(data.textMediaColumnGapMobileV1,24)/2)}px}`:''}#${id} .bhx-v1-media img,#${id} .bhx-v1-media iframe,#${id} .bhx-v1-media video{border-radius:${mobShape==='inherit'?(shape==='circle'?'50%':shape==='none'?'0':n(data.textMediaRadiusV1,16,0,100)+'px'):mobShape==='circle'?'50%':mobShape==='none'?'0':n(data.textMediaRadiusV1,16,0,100)+'px'}}#${id} .bhx-v1-mobile-media-text .bhx-v1-media{order:-1}}`}
    case 'timeline': return ''
    case 'testimonials': return ''
    case 'pricing': return ''
    case 'comp': return ''
    case 'faq': return faqV1Css(id,data)
    case 'flexible': return flexibleV1Css(id,data)
    case 'gallery': return galleryV1Css(id,data)
    case 'album': return albumV1Css(id,data)
    case 'content_filter': return contentFilterV1Css(id,data)
    case 'contact': return contactV1Css(id,data)
    case 'sticky_nav': return stickyNavV1Css(id,data)
    case 'video_channel': return videoChannelV1Css(id,data)
    case 'benefits': return benefitsV1Css(id,data)
    case 'countdown': return countdownV1Css(id,data)
    case 'social_media': return socialMediaV1Css(id,data)
    case 'text_cards': return textCardsV1Css(id,data)
    case 'tabs': return tabsV1Css(id,data)
    case 'list_types': return listTypesV1Css(id,data)
    case 'forms': return formsV1Css(id,data)
    default:return ''
  }
}

function scopedCss(id:string,data:any){
  const bg=sectionBackgroundCss(data)
  const isCode=clean(data.sectionType)==='code'
  const isTimeline=clean(data.sectionType)==='timeline'
  const desktopTop=isCode?data.codePaddingTopDesktopV1:(Number.isFinite(Number(data.paddingTop))?data.paddingTop:(isTimeline?80:undefined))
  const desktopBottom=isCode?data.codePaddingBottomDesktopV1:(Number.isFinite(Number(data.paddingBottom))?data.paddingBottom:(isTimeline?80:undefined))
  const mobileTop=isCode?data.codePaddingTopMobileV1:(Number.isFinite(Number(data.mobilePaddingTop))?data.mobilePaddingTop:(isTimeline?50:desktopTop))
  const mobileBottom=isCode?data.codePaddingBottomMobileV1:(Number.isFinite(Number(data.mobilePaddingBottom))?data.mobilePaddingBottom:(isTimeline?50:desktopBottom))
  const pt=Number.isFinite(Number(desktopTop))?`${desktopTop}px`:''
  const pb=Number.isFinite(Number(desktopBottom))?`${desktopBottom}px`:''
  const mobilePt=Number.isFinite(Number(mobileTop))?`${mobileTop}px`:pt
  const mobilePb=Number.isFinite(Number(mobileBottom))?`${mobileBottom}px`:pb
  const cols=Math.max(1,Math.min(6,Number(data.itemsColumnsDesktop||3)))
  const mcols=Math.max(1,Math.min(2,Number(data.itemsColumnsMobile||1)))
  const headingSizes:Record<string,string>={Small:'clamp(1.6rem,2vw,2rem)',Medium:'clamp(2rem,3vw,3rem)',Large:'clamp(2.5rem,4.5vw,4.5rem)',Display:'clamp(3rem,7vw,7rem)'}
  const bodySizes:Record<string,string>={Small:'.9rem',Medium:'1rem',Large:'1.2rem'}
  const h=headingSizes[clean(data.headingSize)]||''
  const b=bodySizes[clean(data.bodySize)]||''
  const mobileH=data.mobileHeadingSize!=='Use Desktop'?(headingSizes[clean(data.mobileHeadingSize)]||h):h
  const mobileB=data.mobileBodySize!=='Use Desktop'?(bodySizes[clean(data.mobileBodySize)]||b):b
  const align=clean(data.textAlign||'Left').toLowerCase()
  const mobileAlign=clean(data.mobileTextAlign||'Use Desktop')==='Use Desktop'?align:clean(data.mobileTextAlign).toLowerCase()
  const custom=!isCode&&process.env.ALLOW_ADVANCED_CODE==='true'&&data.customCss?clean(data.customCss):''
  const codeMobileBg=isCode&&data.backgroundType==='image'&&data.codeBackgroundImageMobileV1?.asset?imageUrl(data.codeBackgroundImageMobileV1,1200,1500):''
  const mobileMax=['texttext','timeline','text_slider'].includes(clean(data.sectionType))?768:767
  const codeMobileBgCss=codeMobileBg?`@media(max-width:767px){#${id}{background-image:url(\"${codeMobileBg}\")!important;background-position:center;background-repeat:${clean(data.codeBackgroundImageStyleV1||'cover')==='tiling'?'repeat':'no-repeat'};background-size:${clean(data.codeBackgroundImageStyleV1||'cover')==='tiling'?'auto':'cover'};background-attachment:scroll;}}`:''
  return `#${id}{${bg}${color(data.textColor)?`color:${color(data.textColor)};`:''}${pt?`padding-top:${pt};`:''}${pb?`padding-bottom:${pb};`:''}text-align:${align};--bhx-item-cols:${cols};--bhx-item-cols-mobile:${mcols};--bhx-accent:${color(data.accentColor)||'var(--accent-color,#ffbf00)'};--bhx-media-scale:${Math.max(25,Math.min(150,Number(data.mediaScale||100))) / 100};--bhx-mobile-media-scale:${Math.max(25,Math.min(150,Number(data.mobileMediaScale||data.mediaScale||100))) / 100};--bhx-animation-duration:${Math.max(0,Number(data.animationDuration||700))}ms;--bhx-animation-delay:${Math.max(0,Number(data.animationDelay||0))}ms;--bhx-split-ratio:${Math.max(10,Math.min(90,Number(data.splitRatioDesktopV1||50)))}%;--bhx-split-depth:${Math.max(0,Math.min(30,Number(data.splitShapeDepthDesktopV1||8)))}vw;}#${id} h1,#${id} h2,#${id} h3{${color(data.headingColor)?`color:${color(data.headingColor)};`:''}}#${id} h1,#${id} h2{${h?`font-size:${h};`:''}}#${id} p,#${id} li{${b?`font-size:${b};`:''}}#${id} a{--accent-color:var(--bhx-accent)}@media(max-width:${mobileMax}px){#${id}{text-align:${mobileAlign};--bhx-split-ratio:${Math.max(10,Math.min(90,Number(data.splitRatioMobileV1||50)))}%;--bhx-split-depth:${Math.max(0,Math.min(30,Number(data.splitShapeDepthMobileV1||4)))}vw;${mobilePt?`padding-top:${mobilePt};`:''}${mobilePb?`padding-bottom:${mobilePb};`:''}${data.mobileBackgroundOverride&&color(data.mobileBackgroundColor)?`background:${color(data.mobileBackgroundColor)};`:''}}#${id} h1,#${id} h2{${mobileH?`font-size:${mobileH};`:''}}#${id} p,#${id} li{${mobileB?`font-size:${mobileB};`:''}}}${wpParityCss(id,data,token(data.sectionType||''))}${codeMobileBgCss}${custom}`
}


export default function WebSectionRenderer({row}:{row:any}){
  const data=row?.section||row
  if(!data||data.enabled===false)return null
  if(disabledFrontendWebSectionTypes.includes(String(data.sectionType||'')))return null
  const type=token(data.sectionType||'textmedia')
  const instanceKey=token(row?._key||data?._id||'section')
  const rawId=data.anchorId?token(data.anchorId):`bhx-section-${token(data._id||'section')}-${instanceKey}`
  const id=rawId||`bhx-section-${instanceKey}`
  const classes=(type==='hero'?[
    'bhx-web-section','bhx-v1-section','bhx-v1-hero',
    data.hideDesktop?'bhx-hero-hide-desktop':'',data.hideTablet?'bhx-hero-hide-tablet':'',data.hideMobile?'bhx-hero-hide-mobile':'',
  ]:type==='code'?[
    'bhx-web-section','bhx-v1-section','bhx-v1-code',
    data.hideDesktop?'bhx-hide-desktop':'',data.hideMobile?'bhx-hide-mobile':'',
  ]:[
    'bhx-web-section','bhx-v1-section',`bhx-v1-${type}`,
    data.hideDesktop?'bhx-hide-desktop':'',type!=='code'&&type!=='texttext'&&data.hideTablet?'bhx-hide-tablet':'',data.hideMobile?'bhx-hide-mobile':'',
    `bhx-spacing-${token(data.spacingPreset||'standard')}`,
    `bhx-mobile-spacing-${token(data.mobileSpacingPreset||'use-desktop')}`,
    `bhx-animation-${token(data.animation||'none')}`,
    `bhx-mobile-animation-${token(data.mobileAnimation||'use-desktop')}`,
    `bhx-button-preset-${token(data.buttonStyle||'global')}`,
    `bhx-media-shape-${token(data.mediaShape||'none')}`,
    data.mediaBorder?'bhx-media-border':'',data.decorLine?'bhx-decor-line':'',
    data.backgroundType==='split'?`bhx-split-dir-${token(data.splitDirectionDesktopV1||'lr')}`:'',
    data.backgroundType==='split'?`bhx-split-edge-${token(data.splitEdgeShapeDesktopV1||'straight')}`:'',
    data.backgroundType==='split'?`bhx-split-dir-mobile-${token(data.splitDirectionMobileV1||'tb')}`:'',
    data.backgroundType==='split'?`bhx-split-edge-mobile-${token(data.splitEdgeShapeMobileV1||'straight')}`:'',
    `bhx-mobile-button-${token(data.mobileButtonLayout||'use-desktop')}`,`bhx-mobile-layout-${token(data.mobileLayout||'desktop')}`,
    `bhx-col1-position-${token(data.column1Position||'default')}`,`bhx-col2-position-${token(data.column2Position||'default')}`,clean(data.customClass||''),
  ]).filter(Boolean).join(' ')

  const chrome=type==='hero'?null:<SectionBackgroundChromeV1 data={data}/>
  for(const module of frontendModules){if(module.webSectionTypes?.includes(data.sectionType)&&module.renderWebSection){return <section id={id} className={classes} data-sanity-edit-target data-sanity={webSectionDataAttribute(data)} data-bhx-section-type={type} data-bhx-section-id={clean(data._id||'')}><span className="bhx-visual-edit-source" aria-hidden="true">{data.title}</span><SectionStudioLink documentId={clean(data._id||'')} documentType={clean(data._type||'webSection')}/><style dangerouslySetInnerHTML={{__html:scopedCss(id,data)}}/>{chrome}<div className="bhx-v1-section-inner">{module.renderWebSection(data,{instanceKey:row?._key})}</div></section>}}

  let body:any
  const staticV1Types=['services','textmedia','code','texttext']
  if(type==='hero')body=<Hero data={data}/>
  else if(type==='flexible')body=<FlexibleV1 data={data} ownerId={id}/>
  else if(type==='forms')body=<FormsV1 data={data}/>
  else if(type==='timeline')body=<TimelineV1 data={data} ownerId={id}/>
  else if(type==='text_slider')body=<TextSliderV1 data={data} ownerId={id}/>
  else if(type==='testimonials')body=<TestimonialsV1 data={data} ownerId={id}/>
  else if(type==='pricing')body=<PricingV1 data={data} ownerId={id}/>
  else if(type==='comp')body=<PricingComparisonV1 data={data} ownerId={id}/>
  else if(type==='cta')body=<CtaV1 data={data} ownerId={id}/>
  else if(type==='image_accent_cta')body=<ImageAccentCtaV1 data={data} ownerId={id}/>
  else if(type==='faq')body=<FaqV1 data={data} ownerId={id}/>
  else if(type==='gallery')body=<GalleryV1 data={data} ownerId={id}/>
  else if(type==='album')body=<AlbumV1 data={data} ownerId={id}/>
  else if(type==='content_filter')body=<ContentFilterV1 data={data}/>
  else if(type==='contact')body=<ContactV1 data={data}/>
  else if(type==='sticky_nav')body=<StickyNavV1 data={data}/>
  else if(type==='video_channel')body=<VideoChannelV1 data={data}/>
  else if(type==='benefits')body=<BenefitsV1 data={data}/>
  else if(type==='countdown')body=<CountdownV1 data={data}/>
  else if(type==='social_media')body=<SocialMediaV1 data={data}/>
  else if(type==='text_cards')body=<TextCardsV1 data={data}/>
  else if(type==='tabs')body=<TabsV1 data={data} instanceKey={instanceKey}/>
  else if(type==='list_types')body=<ListTypesV1 data={data}/>
  else if(staticV1Types.includes(type))body=<WebSectionStaticV1 data={data} type={type} instanceKey={instanceKey}/>
  else body=<ItemSection data={data} type={type}/>

  return <section id={id} className={classes} data-sanity-edit-target data-sanity={webSectionDataAttribute(data)} data-bhx-section-type={type} data-bhx-section-id={clean(data._id||'')}><span className="bhx-visual-edit-source" aria-hidden="true">{data.title}</span><SectionStudioLink documentId={clean(data._id||'')} documentType={clean(data._type||'webSection')}/>{type!=='hero'&&<style dangerouslySetInnerHTML={{__html:scopedCss(id,data)}}/>}{chrome}{type==='hero'?<div className="bhx-v1-hero-section-owned">{body}</div>:<div className="bhx-v1-section-inner">{body}</div>}</section>
}
