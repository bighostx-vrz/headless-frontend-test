import Image from 'next/image'
import {stegaClean} from 'next-sanity'
import {urlFor} from '@/sanity/lib/image'
import V1SectionButton from './V1SectionButton'
import TextTextMotionV1 from './TextTextMotionV1'
import TextTextPopupV1 from './TextTextPopupV1'
import {textTextReadMoreSegments} from './textTextReadMoreV1'

type AnyMap=Record<string,any>
const clean=(v:any)=>stegaClean(v==null?'':String(v))
const token=(v:any,f='')=>clean(v||f).toLowerCase().replace(/[^a-z0-9_-]+/g,'-')||f
const safeImage=(image:any)=>image?.asset?urlFor(image).width(1200).height(760).url():''

/** Render the verified WP legacy Read More subset without raw HTML injection. */
function LegacyReadMoreContent({value}:{value:string}){
 const segments=textTextReadMoreSegments(clean(value))
 return <>{segments.map((segment,index)=>segment.kind==='break'
   ?<br key={`br-${index}`}/>
   :segment.bold?<strong key={`strong-${index}`}>{segment.text}</strong>:<span key={`text-${index}`}>{segment.text}</span>
 )}</>
}

function visibilityClass(desktop:any,mobile:any){
 if(desktop===false&&mobile===false)return 'bhx-tt-hidden-all'
 if(desktop===false)return 'bhx-tt-desktop-hidden'
 if(mobile===false)return 'bhx-tt-mobile-hidden'
 return ''
}
function TextButtons({data,column}:{data:AnyMap;column:1|2}){
 const second=column===2
 const enabled=second?data.textTextCol2ButtonsEnabledV1===true:data.sectionButtonsEnabledV1===true
 if(!enabled)return null
 const count=Math.max(1,Math.min(2,Number(second?data.textTextCol2ButtonCountV1:data.sectionButtonCountV1)||1))
 const primary=second?data.textTextCol2PrimaryButtonV1:data.sectionPrimaryButtonV1
 const secondary=second?data.textTextCol2SecondaryButtonV1:data.sectionSecondaryButtonV1
 const primaryDesktop=second?data.textTextCol2PrimaryButtonDesktopV1:data.sectionPrimaryButtonDesktopV1
 const secondaryDesktop=second?data.textTextCol2SecondaryButtonDesktopV1:data.sectionSecondaryButtonDesktopV1
 const override=second?data.textTextCol2ButtonMobileOverrideV1===true:data.sectionButtonMobileOverrideV1===true
 const primaryMobile=override?(second?data.textTextCol2PrimaryButtonMobileV1:data.sectionPrimaryButtonMobileV1):undefined
 const secondaryMobile=override?(second?data.textTextCol2SecondaryButtonMobileV1:data.sectionSecondaryButtonMobileV1):undefined
 const layout=token(second?data.textTextCol2ButtonLayoutDesktopV1:data.sectionButtonLayoutDesktopV1,'inline')
 // WP V1 mobile button styling follows Desktop unless the explicit mobile override is ON.
 const mobileLayout=override?token(second?data.textTextCol2ButtonLayoutMobileV1:data.sectionButtonLayoutMobileV1,'inherit'):'inherit'
 const gap=Math.max(0,Math.min(80,Number(second?data.textTextCol2ButtonGapDesktopV1:data.sectionButtonGapDesktopV1)||12))
 return <div className={`bhx-tt-buttons bhx-tt-buttons-col-${column} bhx-tt-buttons-${layout} bhx-tt-buttons-mobile-${mobileLayout}`} style={{gap:`${gap}px`}}>
   <V1SectionButton content={primary} desktop={primaryDesktop} mobile={primaryMobile} kind="primary"/>
   {count>=2?<V1SectionButton content={secondary} desktop={secondaryDesktop} mobile={secondaryMobile} kind="secondary"/>:null}
 </div>
}

function PopupReadMore({data,column,label,content,scopeId}:{data:AnyMap;column:1|2;label:string;content:string;scopeId:string}){
 const prefix=`textTextCol${column}`
 const headline=column===1?clean(data.heading):clean(data.textTextRightHeadingV1)
 const paragraph=column===1?clean(data.paragraph):clean(data.textTextRightBodyV1)
 const mediaEnabled=data[`${prefix}ReadMorePopupMediaV1`]===true
 const headlineEnabled=data[`${prefix}ReadMorePopupHeadlineV1`]===true
 const paragraphEnabled=data[`${prefix}ReadMorePopupParagraphV1`]===true
 const buttonEnabled=data[`${prefix}ReadMorePopupButtonV1`]===true
 const media=safeImage(data.media)||safeImage(data.backgroundImage)
 const popupId=`${scopeId}-popup-${column}`
 return <TextTextPopupV1 popupId={popupId} ownerId={scopeId} label={label}>
   {mediaEnabled&&media?<figure className="bhx-tt-popup-media"><Image src={media} alt="" width={1200} height={760} sizes="(max-width: 768px) calc(100vw - 64px), 680px"/></figure>:null}
   {headlineEnabled&&headline?<h3>{headline}</h3>:null}
   {paragraphEnabled&&paragraph?<p>{paragraph}</p>:null}
   {content?<div className="bhx-tt-readmore-content"><LegacyReadMoreContent value={content}/></div>:null}
   {buttonEnabled?<div className="bhx-tt-popup-actions"><TextButtons data={data} column={column}/></div>:null}
 </TextTextPopupV1>
}

function ReadMore({data,column,scopeId}:{data:AnyMap;column:1|2;scopeId:string}){
 const prefix=`textTextCol${column}`
 if(data[`${prefix}ReadMoreEnabledV1`]!==true)return null
 const label=clean(column===1?data.readMoreLabel:data.textTextCol2ReadMoreTextV1)
 const content=clean(data[`${prefix}ReadMoreContentV1`])
 if(!label||!content)return null
 const style=token(data[`${prefix}ReadMoreStyleV1`],'inline')
 if(style==='popup')return <PopupReadMore data={data} column={column} label={label} content={content} scopeId={scopeId}/>
 return <details className="bhx-tt-readmore"><summary>{label}</summary><div className="bhx-tt-readmore-content"><LegacyReadMoreContent value={content}/></div></details>
}

function TextColumn({data,column,scopeId}:{data:AnyMap;column:1|2;scopeId:string}){
 const p=`textTextCol${column}`
 const kicker=clean(column===1?data.eyebrow:data.textTextRightKickerV1)
 const headline=clean(column===1?data.heading:data.textTextRightHeadingV1)
 const paragraph=clean(column===1?data.paragraph:data.textTextRightBodyV1)
 const showText=data[`${p}ShowTextContentV1`]!==false
 const blockStyle=token(data[`${p}BlockStyleDesktopV1`],'plain')
 const blockHover=token(data[`${p}BlockHoverDesktopV1`],'none')
 const pos=`${p}Position`
 const posHover=token(data[`${pos}HoverDesktopV1`],'none'),posHoverMobile=token(data[`${pos}HoverMobileV1`],posHover)
 const desktopAnim=token(data[`${pos}AnimationDesktopV1`],column===1?'slide_right':'slide_left')
 const mobileAnim=token(data[`${pos}AnimationMobileV1`],'fade_up')
 const trigger=token(data[`${pos}TriggerDesktopV1`],'scroll'),mobileTrigger=token(data[`${pos}TriggerMobileV1`],trigger)
 const noAnimation=desktopAnim==='none'&&mobileAnim==='none'
 return <div className={`bhx-texttext-slot bhx-texttext-slot-${column} bhx-tt-position-hover-${posHover} bhx-tt-position-hover-${posHoverMobile}-mobile`} data-bhx-tt-anim data-bhx-tt-trigger={trigger} data-bhx-tt-trigger-mobile={mobileTrigger} data-bhx-visible={noAnimation?'true':'false'} data-bhx-no-animation={noAnimation?'true':'false'}>
   <div className={`bhx-texttext-col bhx-texttext-col-${column} bhx-tt-block-${blockStyle} bhx-tt-block-hover-${blockHover}`}>
     {showText?<div className="bhx-tt-text-content">
       {kicker?<span className={`bhx-tt-kicker ${visibilityClass(data[`${p}ShowKickerDesktopV1`],data[`${p}ShowKickerMobileV1`])}`}>{kicker}</span>:null}
       {headline?<h2 className={`bhx-tt-headline ${visibilityClass(data[`${p}ShowHeadlineDesktopV1`],data[`${p}ShowHeadlineMobileV1`])}`}>{headline}</h2>:null}
       {paragraph?<p className={`bhx-tt-paragraph ${visibilityClass(data[`${p}ShowParagraphDesktopV1`],data[`${p}ShowParagraphMobileV1`])}`}>{paragraph}</p>:null}
       {data[`${p}DecorLineEnabledV1`]===true?<span className={`bhx-tt-decor bhx-tt-decor-${token(data[`${p}DecorLineStyleV1`],'solid')}`} aria-hidden="true"/>:null}
       <ReadMore data={data} column={column} scopeId={scopeId}/>
     </div>:null}
     <TextButtons data={data} column={column}/>
   </div>
 </div>
}

export default function TextTextV1({data,instanceKey}:{data:AnyMap;instanceKey?:string}){
 const desktopAnim=token(data.textTextSectionAnimationDesktopV1,'none'),mobileAnim=token(data.textTextSectionAnimationMobileV1,'fade_up')
 const desktopTrigger=token(data.textTextSectionAnimationTriggerDesktopV1,'scroll'),mobileTrigger=token(data.textTextSectionAnimationTriggerMobileV1,desktopTrigger)
 const layout=token(data.textTextLayoutDesktopV1,'text_left')
 const legacyMobileOrder=clean(data.textTextMobileOrderV1)
 const mobileLayout=token(data.textTextLayoutMobileV1||(legacyMobileOrder==='21'?'media_top':legacyMobileOrder==='12'?'text_top':'follow_desktop'),'follow_desktop')
 const show1=data.textTextShowColumn1V1!==false,show2=data.textTextShowColumn2V1!==false
 const noSectionAnimation=desktopAnim==='none'&&mobileAnim==='none'
 const col1Desktop=token(data.textTextCol1PositionAnimationDesktopV1,'slide_right'),col1Mobile=token(data.textTextCol1PositionAnimationMobileV1,'fade_up')
 const col2Desktop=token(data.textTextCol2PositionAnimationDesktopV1,'slide_left'),col2Mobile=token(data.textTextCol2PositionAnimationMobileV1,'fade_up')
 const motionEnabled=!noSectionAnimation||(show1&&(col1Desktop!=='none'||col1Mobile!=='none'))||(show2&&(col2Desktop!=='none'||col2Mobile!=='none'))
 const scopeId=`bhx-tt-${token(data?._id||'section','section')}-${token(instanceKey||data?._id||'instance','instance')}`
 const hasDivider=data.textTextColumnDividerEnabledV1===true&&show1&&show2
 return <div id={scopeId} className={`bhx-texttext-shell bhx-texttext-layout-${layout} bhx-texttext-mobile-${mobileLayout}`} data-bhx-tt-anim data-bhx-tt-trigger={desktopTrigger} data-bhx-tt-trigger-mobile={mobileTrigger} data-bhx-visible={noSectionAnimation?'true':'false'} data-bhx-no-animation={noSectionAnimation?'true':'false'}>
   <div className={`bhx-texttext-grid bhx-texttext-layout-${layout} bhx-texttext-mobile-${mobileLayout}`}>
     {show1?<TextColumn data={data} column={1} scopeId={scopeId}/>:null}
     {hasDivider?<span className="bhx-texttext-divider" aria-hidden="true"/>:null}
     {show2?<TextColumn data={data} column={2} scopeId={scopeId}/>:null}
   </div>
   {motionEnabled?<TextTextMotionV1 scopeId={scopeId}/>:null}
 </div>
}
