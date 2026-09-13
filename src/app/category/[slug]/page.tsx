import type {Metadata} from 'next'
import type {CSSProperties} from 'react'
import Image from 'next/image'
import {notFound} from 'next/navigation'
import PostCards from '@/components/PostCards'
import PageBuilder from '@/components/PageBuilder'
import WebPageSections from '@/components/WebPageSections'
import {sanityFetch} from '@/sanity/lib/fetch'
import {categoryBySlugQuery, postsByCategoryQuery} from '@/sanity/lib/queries'
import {urlFor} from '@/sanity/lib/image'
import {stegaClean} from 'next-sanity'

type Props = {params: Promise<{slug: string}>}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {slug} = await params
  const category = await sanityFetch<any>(categoryBySlugQuery, {slug}, {stega:false})
  return {
    title: stegaClean(category?.seoTitle || category?.title || ''),
    description: stegaClean(category?.seoDescription || category?.description || ''),
    alternates: category?.canonicalUrl ? {canonical: stegaClean(category.canonicalUrl)} : undefined,
    openGraph: category?.ogImage?.asset ? {images: [urlFor(category.ogImage).width(1200).height(630).url()]} : undefined,
    robots: category?.noIndex ? {index: false, follow: true} : undefined,
  }
}

export default async function CategoryPage({params}: Props) {
  const {slug} = await params
  const [category, posts] = await Promise.all([
    sanityFetch<any>(categoryBySlugQuery, {slug}),
    sanityFetch<any[]>(postsByCategoryQuery, {slug}),
  ])
  if (!category) notFound()

  const categoryImage = category.image || category.categoryImage
  const legacyLayoutMap: Record<string, string> = {standard: 'list', centered: 'feature', magazine: 'grid'}
  const listingLayout = stegaClean(category.listingLayout || legacyLayoutMap[stegaClean(category.pageLayout || '')] || 'grid')

  const style = {
    backgroundColor: category.bgColor?.hex || undefined,
    color: category.textColor?.hex || undefined,
    '--category-cols': category.columns || 3,
  } as CSSProperties

  return <main className={`category-page archive-theme-${stegaClean(category.archiveTheme || 'light')} category-${listingLayout}`} style={style}>
    {category.archiveSections?.length?<WebPageSections sections={category.archiveSections}/>:<PageBuilder blocks={category.archiveBuilder} />}
    <section className="category-main"><div className="section-inner width-contained">
      <div className="category-heading">
        <div><span className="eyebrow">Category</span><h1 style={{color: category.titleColor?.hex || undefined}}>{category.title}</h1>{category.description && <p>{category.description}</p>}</div>
        {categoryImage?.asset && <Image src={urlFor(categoryImage).width(700).height(440).url()} alt={category.title || ''} width={700} height={440}/>}      
      </div>
      <div className={`category-grid layout-${listingLayout}`}><PostCards posts={posts.map((post) => ({...post, category}))}/></div>
    </div></section>
  </main>
}
