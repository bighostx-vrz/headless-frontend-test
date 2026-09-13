import type {Metadata} from 'next'
import Script from 'next/script'
import {stegaClean} from 'next-sanity'
import {notFound} from 'next/navigation'
import PageBuilder from '@/components/PageBuilder'
import WebPageSections from '@/components/WebPageSections'
import {sanityFetch} from '@/sanity/lib/fetch'
import {pageBySlugQuery} from '@/sanity/lib/queries'
import {urlFor} from '@/sanity/lib/image'

type Props={params:Promise<{slug:string}>}
export async function generateMetadata({params}:Props):Promise<Metadata>{const{slug}=await params;const p=await sanityFetch<any>(pageBySlugQuery,{slug},{stega:false});return{title:stegaClean(p?.seoTitle||p?.title||''),description:stegaClean(p?.seoDescription||''),alternates:(p?.canonicalUrl||p?.hreflang?.length)?{canonical:p?.canonicalUrl?stegaClean(p.canonicalUrl):undefined,languages:Object.fromEntries((p?.hreflang||[]).filter((x:any)=>x.locale&&x.url).map((x:any)=>[stegaClean(x.locale),stegaClean(x.url)]))}:undefined,openGraph:p?.ogImage?.asset?{images:[urlFor(p.ogImage).width(1200).height(630).url()]}:undefined,robots:p?.noIndex||p?.noFollow?{index:!p?.noIndex,follow:!p?.noFollow}:undefined}}
export default async function GenericPage({params}:Props){const{slug}=await params;const p=await sanityFetch<any>(pageBySlugQuery,{slug});if(!p)notFound();const allowCode=process.env.ALLOW_ADVANCED_CODE==='true';return <>{p.customCss&&<style dangerouslySetInnerHTML={{__html:stegaClean(p.customCss)}}/>}{allowCode&&p.headScripts&&<div className="legacy-head-code" dangerouslySetInnerHTML={{__html:stegaClean(p.headScripts)}}/>}{allowCode&&p.beforeContentHtml&&<div dangerouslySetInnerHTML={{__html:stegaClean(p.beforeContentHtml)}}/>}{p.structuredData&&<script type="application/ld+json" dangerouslySetInnerHTML={{__html:stegaClean(p.structuredData)}}/>}{p.sections?.length?<WebPageSections sections={p.sections}/>:<PageBuilder blocks={p.pageBuilder}/>}{allowCode&&p.afterContentHtml&&<div dangerouslySetInnerHTML={{__html:stegaClean(p.afterContentHtml)}}/>}{p.enableQr&&<div className="qr-link"><a href={`/api/qr?url=${encodeURIComponent(`/${slug}`)}`}>Generate QR for this page</a></div>}{allowCode&&p.pageScript&&<Script id={`page-code-${slug}`} strategy="afterInteractive" dangerouslySetInnerHTML={{__html:stegaClean(p.pageScript)}}/>}</>}
