import type {CSSProperties, ReactNode} from 'react'
import type {Metadata} from 'next'
import Script from 'next/script'
import {draftMode} from 'next/headers'
import {VisualEditing} from 'next-sanity/visual-editing'
import {stegaClean} from 'next-sanity'
import './globals.css'
import {sanityFetch,SanityLive} from '@/sanity/lib/fetch'
import {siteSettingsQuery,popupQuery} from '@/sanity/lib/queries'
import {urlFor} from '@/sanity/lib/image'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import DisableDraftMode from '@/components/DisableDraftMode'
import Analytics from '@/components/Analytics'
import CookieBanner from '@/components/CookieBanner'
import PopupManager from '@/components/PopupManager'

function clean(value: unknown, fallback='') {return String(stegaClean(value ?? fallback))}
function sizeValue(size:string|undefined, kind:'h1'|'h2'|'body') {const map:any={h1:{small:'2.4rem',medium:'3rem',large:'3.8rem',xlarge:'4.8rem'},h2:{small:'1.8rem',medium:'2.2rem',large:'2.8rem',xlarge:'3.4rem'},body:{small:'.95rem',medium:'1.05rem',large:'1.15rem',xlarge:'1.25rem'}};return map[kind][size||'medium']||map[kind].medium}
export async function generateMetadata(): Promise<Metadata> {const s=await sanityFetch<any>(siteSettingsQuery,{}, {stega:false});return {title:{default:clean(s?.siteTitle,'BigHostX Sanity Site Builder'),template:`%s | ${clean(s?.siteTitle,'BigHostX Sanity Site Builder')}`},metadataBase:s?.siteUrl?new URL(clean(s.siteUrl)):undefined,icons:s?.favicon?.asset?[{url:urlFor(s.favicon).width(128).height(128).url()}]:undefined,verification:{google:s?.googleSiteVerification||undefined,other:s?.bingSiteVerification?{'msvalidate.01':[s.bingSiteVerification]}:undefined},robots:s?.siteNoIndex?{index:false,follow:false}:undefined}}
export default async function RootLayout({children}:{children:ReactNode}) {
  const [settings,popup]=await Promise.all([sanityFetch<any>(siteSettingsQuery),sanityFetch<any>(popupQuery)]); const {isEnabled}=await draftMode(); const alwaysPreviewDrafts=process.env.SANITY_ALWAYS_PREVIEW_DRAFTS==='true'; const visualEditingEnabled=isEnabled||alwaysPreviewDrafts; const allowCode=process.env.ALLOW_ADVANCED_CODE==='true'
  const cssVariables={
    '--heading-font':clean(settings?.headingFont,'Inter, Arial, sans-serif'),'--body-font':clean(settings?.bodyFont,'Inter, Arial, sans-serif'),'--heading-weight':clean(settings?.headingWeight,'700'),
    '--heading-color':settings?.headingColor?.hex||'#101828','--text-color':settings?.textColor?.hex||'#344054','--accent-color':settings?.accentColor?.hex||'#ffc400','--accent-2':settings?.secondaryAccentColor?.hex||'#6f2cff',
    '--page-bg':settings?.pageBackground?.hex||'#fff','--dark-bg':settings?.darkBackground?.hex||'#050817','--light-bg':settings?.lightBackground?.hex||'#f5f7fb','--content-width':clean(settings?.contentWidth,'1200px'),'--article-width':clean(settings?.articleWidth,'840px'),
    '--button-radius':clean(settings?.buttonRadius,'8px'),'--card-radius':clean(settings?.cardRadius,'12px'),'--h1-size':sizeValue(clean(settings?.h1Size,'xlarge'),'h1'),'--h1-mobile-size':sizeValue(clean(settings?.h1MobileSize,'large'),'h1'),
    '--h2-size':sizeValue(clean(settings?.h2Size,'large'),'h2'),'--h2-mobile-size':sizeValue(clean(settings?.h2MobileSize,'medium'),'h2'),'--body-size':sizeValue(clean(settings?.bodySize,'medium'),'body'),
    '--global-section-space':clean(settings?.sectionSpacing,'standard')==='compact'?'48px':clean(settings?.sectionSpacing,'standard')==='spacious'?'104px':'72px','--footer-mobile-cols':settings?.footerMobileColumns||2,
  } as CSSProperties
  return <html lang="en" style={cssVariables} data-bhx-preview={visualEditingEnabled?'true':undefined}><head>{settings?.globalCss&&<style dangerouslySetInnerHTML={{__html:clean(settings.globalCss)}}/>}{allowCode&&settings?.headScript&&<Script id="global-head-code" strategy="beforeInteractive" dangerouslySetInnerHTML={{__html:clean(settings.headScript)}}/>}</head><body>{allowCode&&settings?.bodyStartHtml&&<div dangerouslySetInnerHTML={{__html:clean(settings.bodyStartHtml)}}/>}<Analytics settings={settings}/><SiteHeader settings={settings}/><main>{children}</main><SiteFooter settings={settings}/><CookieBanner settings={settings}/><PopupManager popup={popup}/>{allowCode&&settings?.bodyEndHtml&&<div dangerouslySetInnerHTML={{__html:clean(settings.bodyEndHtml)}}/>}{settings?.showBackToTop&&<a className="back-to-top" href="#top" aria-label="Back to top">↑</a>}{allowCode&&settings?.bodyEndScript&&<Script id="global-footer-code" strategy="afterInteractive" dangerouslySetInnerHTML={{__html:clean(settings.bodyEndScript)}}/>}<SanityLive/>{visualEditingEnabled&&<><VisualEditing/>{isEnabled&&<DisableDraftMode/>}</>}</body></html>
}
