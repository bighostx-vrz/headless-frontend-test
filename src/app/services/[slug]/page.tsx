import type {Metadata} from 'next'
import {notFound} from 'next/navigation'
import {stegaClean} from 'next-sanity'
import DetailPage from '@/components/DetailPage'
import {sanityFetch} from '@/sanity/lib/fetch'
import {contentByTypeAndSlugQuery} from '@/sanity/lib/queries'
import {urlFor} from '@/sanity/lib/image'
type Props={params:Promise<{slug:string}>}
export async function generateMetadata({params}:Props):Promise<Metadata>{const{slug}=await params;const item=await sanityFetch<any>(contentByTypeAndSlugQuery,{type:'service',slug});return{title:stegaClean(item?.seoTitle||item?.title||''),description:stegaClean(item?.seoDescription||item?.excerpt||''),alternates:item?.canonicalUrl?{canonical:stegaClean(item.canonicalUrl)}:undefined,openGraph:item?.image?.asset?{images:[urlFor(item.image).width(1200).height(630).url()]}:undefined,robots:item?.noIndex?{index:false,follow:false}:undefined}}
export default async function Page({params}:Props){const{slug}=await params;const item=await sanityFetch<any>(contentByTypeAndSlugQuery,{type:'service',slug});if(!item)notFound();return <DetailPage item={item}/>}
