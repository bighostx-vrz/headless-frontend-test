import Image from 'next/image'
import {PortableText} from '@portabletext/react'
import {stegaClean} from 'next-sanity'
import {urlFor} from '@/sanity/lib/image'
import V1Icon from './V1Icon'
import TimelineRuntimeV1 from './TimelineRuntimeV1'
import {timelineV1Css} from './timelineV1Css'

const clean=(v:any)=>stegaClean(v==null?'':String(v))
const token=(v:any,f='')=>clean(v||f).toLowerCase().replace(/[^a-z0-9_-]+/g,'-')||f
const imageUrl=(image:any,w=1000,h=750)=>image?.asset?urlFor(image).width(w).height(h).fit('max').auto('format').url():''
const safeHref=(v:any)=>{const raw=clean(v).trim();if(!raw)return '';if(raw.startsWith('#')||raw.startsWith('/')||/^(https?:|mailto:|tel:)/i.test(raw))return raw;return ''}
const oneOf=(v:any,allowed:string[],fallback:string)=>{const x=clean(v).toLowerCase();return allowed.includes(x)?x:fallback}
const designPreset=(v:any)=>{const x=clean(v).toLowerCase();if(['soft','glass','corporate'].includes(x))return 'clean';if(x==='neon')return 'outline';return ['clean','ribbon','editorial','outline'].includes(x)?x:'clean'}
const blankTarget=(v:any)=>['new','_blank','blank'].includes(clean(v).toLowerCase())

function Rich({value}:{value:any}){
  if(Array.isArray(value)&&value.length)return <PortableText value={value}/>
  const text=clean(value).trim()
  return text?<p>{text}</p>:null
}
function legacyItems(data:any){return Array.isArray(data?.items)?data.items.filter((x:any)=>x?.enabled!==false).map((x:any,i:number)=>({_key:x._key||`legacy-${i}`,enabled:true,label:x.eyebrow||x.value||'',markerIcon:x.iconText||'outline-check-circle',eyebrow:x.eyebrow,title:x.title,text:x.text,image:x.image,url:x.link?.url,linkText:x.link?.label,linkTarget:x.link?.newWindow?'new':'same'})):[]}
function normaliseItem(item:any,index:number){
  return {
    ...item,
    _key:item?._key||`timeline-${index}`,
    enabled:item?.enabled!==false,
    label:clean(item?.label||item?.date||''),
    markerType:clean(item?.markerType||'icon'),
    markerIcon:clean(item?.markerIcon||item?.icon||'outline-check-circle'),
    markerImage:item?.markerImage,
    markerImageAlt:clean(item?.markerImageAlt||item?.label||item?.date||item?.title||''),
    showKicker:item?.showKicker!==false,
    showTitle:item?.showTitle!==false,
    eyebrow:clean(item?.eyebrow||''),
    title:clean(item?.title||''),
    body:Array.isArray(item?.body)&&item.body.length?item.body:item?.text,
    readMoreEnabled:item?.readMoreEnabled===true,
    readMoreLabel:clean(item?.readMoreLabel||item?.linkText||'Read More'),
    readMoreBody:item?.readMoreBody,
    visualEnabled:item?.visualEnabled===true||Boolean(item?.image?.asset),
    visualType:clean(item?.visualType||(item?.image?.asset?'image':'icon')),
    visualIcon:clean(item?.visualIcon||'outline-image'),
    visualImage:item?.visualImage||item?.image,
    visualImageAlt:clean(item?.visualImageAlt||item?.title||''),
    cardLinkUrl:safeHref(item?.cardLinkUrl||(!item?.linkText?item?.url:'')),
    cardLinkTarget:clean(item?.cardLinkTarget||item?.linkTarget||'same'),
    legacyLinkUrl:item?.linkText?safeHref(item?.url):'',
    legacyLinkText:clean(item?.linkText||''),
  }
}
function Dialog({id,title,body}:{id:string;title:string;body:any}){const titleId=`${id}-title`;return <dialog id={id} className="bhx-timeline-dialog" data-bhx-timeline-dialog aria-labelledby={title?titleId:undefined}><div className="bhx-timeline-dialog-inner"><button type="button" className="bhx-timeline-dialog-close" data-bhx-timeline-close aria-label="Close dialog">×</button>{title&&<h3 id={titleId}>{title}</h3>}<div className="bhx-timeline-dialog-copy"><Rich value={body}/></div></div></dialog>}

export default function TimelineV1({data,ownerId}:{data:any;ownerId:string}){
  const source=Array.isArray(data.timelineItemsV1)&&data.timelineItemsV1.length?data.timelineItemsV1:legacyItems(data)
  const items=source.slice(0,50).map(normaliseItem).filter((x:any)=>x.enabled)
  if(!items.length)return null
  const legacyLayout=clean(data.timelineLayoutV1||'')
  const desktopDirection=oneOf(data.timelineDirectionDesktopV1||(legacyLayout==='horizontal'?'horizontal':'vertical'),['horizontal','vertical'],'horizontal')
  const mobileDirection=oneOf(data.timelineDirectionMobileV1||'vertical',['vertical','horizontal_scroll'],'vertical')
  // Legacy v6.6.0 `vertical` was a single left rail; `alternating` keeps center rail.
  const legacyVerticalPreset=legacyLayout==='vertical'?'left_rail':'alternating'
  const verticalPreset=oneOf(data.timelineVerticalPresetV1||legacyVerticalPreset,['alternating','left_rail','right_rail'],legacyVerticalPreset)
  const alternateStart=oneOf(data.timelineAlternateStartV1||'left',['left','right'],'left')
  const design=designPreset(data.timelineDesignPresetV1||'clean')
  const showHeader=data.timelineShowIntroV1!==false
  const showRail=data.timelineShowRailV1!==false
  const showLabels=data.timelineShowLabelsV1!==false
  const revealDesktop=clean(data.timelineRevealDesktopV1||'fade_up')||'fade_up'
  const revealMobile=clean(data.timelineRevealMobileV1||'fade_up')||'fade_up'
  const visualDesk=clean(data.timelineVisualPositionDesktopV1||'badge_top_left')||'badge_top_left'
  const visualMobile=clean(data.timelineVisualPositionMobileV1||'above_center')||'above_center'
  const autoCompact=data.timelineAutoCompactDesktopV1!==false&&Number(data.timelineHorizontalItemsPerViewDesktopV1||6)>=5
  const headerDialog=`${ownerId}-timeline-header-dialog`
  const scrollId=`${ownerId}-timeline-scroll`
  const revealKicker=data.timelineMilestoneShowKickerDesktopV1!==false
  const revealHeadline=data.timelineMilestoneShowHeadlineDesktopV1!==false
  const revealParagraph=data.timelineMilestoneShowParagraphDesktopV1!==false
  return <div className={`bhx-timeline-v1 is-design-${token(design,'clean')} ${autoCompact?'is-auto-compact':''}`} data-desktop-direction={desktopDirection} data-mobile-direction={mobileDirection} data-vertical-preset={verticalPreset} data-show-intro={showHeader?'true':'false'} data-animate-markers={data.timelineAnimateMarkersV1!==false?'true':'false'} data-bhx-timeline-root style={{'--bhx-progress':data.timelineAnimateProgressV1===false?1:0} as any}>
    <style dangerouslySetInnerHTML={{__html:timelineV1Css(ownerId,data)}}/>
    {showHeader?<div className="bhx-timeline-header">
      {data.eyebrow&&<span className="eyebrow">{data.eyebrow}</span>}
      {data.heading&&<h2>{data.heading}</h2>}
      {data.paragraph&&<p className="lead">{data.paragraph}</p>}
      {Array.isArray(data.richText)&&data.richText.length?<div className="rich-text"><PortableText value={data.richText}/></div>:null}
      {data.timelineHeaderReadMoreEnabledV1===true&&data.readMoreLabel?<><button type="button" className="bhx-timeline-readmore" data-bhx-timeline-open={headerDialog} aria-controls={headerDialog}>{data.readMoreLabel}</button><Dialog id={headerDialog} title={clean(data.heading)} body={data.timelineHeaderReadMoreBodyV1}/><noscript><div className="bhx-timeline-noscript"><Rich value={data.timelineHeaderReadMoreBodyV1}/></div></noscript></>:null}
    </div>:null}
    <div className="bhx-timeline-track" data-bhx-timeline-track>
      <div className="bhx-timeline-nav" aria-label="Timeline navigation"><button type="button" data-bhx-timeline-prev aria-label="Previous milestones" aria-controls={scrollId}>←</button><button type="button" data-bhx-timeline-next aria-label="Next milestones" aria-controls={scrollId}>→</button></div>
      <div id={scrollId} className="bhx-timeline-scroll" data-bhx-timeline-scroll tabIndex={desktopDirection==='horizontal'||mobileDirection==='horizontal_scroll'?0:-1} role="region" aria-label="Timeline milestones">
        {showRail?<><span className="bhx-timeline-rail" aria-hidden="true"/><span className="bhx-timeline-progress" aria-hidden="true"/></>:null}
        <ol className="bhx-timeline-list" data-bhx-timeline-list>
          {items.map((item:any,index:number)=>{
            const markerImage=item.markerType==='image'&&item.markerImage?.asset
            const visualImage=item.visualEnabled&&item.visualType==='image'&&item.visualImage?.asset
            const readDialog=`${ownerId}-timeline-item-${token(item._key,String(index))}`
            const sideLeft=((index+(alternateStart==='right'?1:0))%2===0)
            const delay=Math.max(0,Number(data.timelineRevealStaggerV1||110))*index
            return <li key={item._key} className={`bhx-timeline-item ${sideLeft?'is-side-left':'is-side-right'}`} data-bhx-timeline-item data-reveal-effect={revealDesktop} data-reveal-mobile={revealMobile} style={{transitionDelay:`${Math.min(delay,1800)}ms`} as any}>
              <div className="bhx-timeline-marker-wrap">
                <span className="bhx-timeline-marker" data-bhx-timeline-marker>{markerImage?<Image src={imageUrl(item.markerImage,160,160)} alt={item.markerImageAlt} width={160} height={160} loading="lazy"/>:<V1Icon name={item.markerIcon} size={22}/>}</span>
                {showLabels&&item.label?<span className="bhx-timeline-label">{item.label}</span>:null}
              </div>
              <article className="bhx-timeline-card">
                {item.visualEnabled?<div className={`bhx-timeline-visual is-hover-${token(data.timelineVisualHoverV1,'none')}`} data-position={visualDesk} data-position-mobile={visualMobile}>{visualImage?<Image src={imageUrl(item.visualImage,960,720)} alt={item.visualImageAlt} width={960} height={720} loading="lazy"/>:<V1Icon name={item.visualIcon} size={32}/>}</div>:null}
                {revealKicker&&item.showKicker&&item.eyebrow?<span className="eyebrow">{item.eyebrow}</span>:null}
                {revealHeadline&&item.showTitle&&item.title?<h3>{item.title}</h3>:null}
                {revealParagraph&&item.body?<div className="bhx-timeline-copy"><Rich value={item.body}/></div>:null}
                {item.readMoreEnabled&&item.readMoreBody?<><button type="button" className="bhx-timeline-readmore" data-bhx-timeline-open={readDialog} aria-controls={readDialog}>{item.readMoreLabel}</button><Dialog id={readDialog} title={item.title} body={item.readMoreBody}/><noscript><div className="bhx-timeline-noscript"><Rich value={item.readMoreBody}/></div></noscript></>:null}
                {item.legacyLinkUrl&&item.legacyLinkText?<a className="bhx-timeline-legacy-link" href={item.legacyLinkUrl} target={blankTarget(item.cardLinkTarget)?'_blank':undefined} rel={blankTarget(item.cardLinkTarget)?'noopener noreferrer':undefined}>{item.legacyLinkText} →</a>:null}
                {item.cardLinkUrl?<a className="bhx-timeline-card-link" href={item.cardLinkUrl} target={blankTarget(item.cardLinkTarget)?'_blank':undefined} rel={blankTarget(item.cardLinkTarget)?'noopener noreferrer':undefined} aria-label={item.title||item.label||'Open milestone'}/>:null}
              </article>
            </li>
          })}
        </ol>
      </div>
    </div>
    <TimelineRuntimeV1 ownerId={ownerId} revealThreshold={Number(data.timelineRevealThresholdV1||18)} revealOnce={data.timelineRevealOnceV1!==false} animateProgress={data.timelineAnimateProgressV1!==false} animateMarkers={data.timelineAnimateMarkersV1!==false}/>
  </div>
}
