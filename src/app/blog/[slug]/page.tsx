import type {Metadata} from 'next'
import type {CSSProperties} from 'react'
import Image from 'next/image'
import {PortableText} from '@portabletext/react'
import {stegaClean} from 'next-sanity'
import {notFound} from 'next/navigation'
import PageBuilder from '@/components/PageBuilder'
import WebPageSections from '@/components/WebPageSections'
import DynamicForm from '@/components/DynamicForm'
import PostCards from '@/components/PostCards'
import {sanityFetch} from '@/sanity/lib/fetch'
import {postBySlugQuery, relatedPostsQuery} from '@/sanity/lib/queries'
import {urlFor} from '@/sanity/lib/image'

type Props = {params: Promise<{slug: string}>}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {slug} = await params
  const post = await sanityFetch<any>(postBySlugQuery, {slug}, {stega:false})
  return {
    title: stegaClean(post?.seoTitle || post?.title || ''),
    description: stegaClean(post?.seoDescription || post?.excerpt || ''),
    alternates: post?.canonicalUrl ? {canonical: stegaClean(post.canonicalUrl)} : undefined,
    openGraph: post?.ogImage?.asset ? {images: [urlFor(post.ogImage).width(1200).height(630).url()]} : undefined,
    robots: post?.noIndex || post?.noFollow ? {index: !post?.noIndex, follow: !post?.noFollow} : undefined,
  }
}

export default async function BlogPost({params}: Props) {
  const {slug} = await params
  const post = await sanityFetch<any>(postBySlugQuery, {slug})
  if (!post) notFound()

  const category = post.primaryCategory || post.legacyCategory || {}
  const useTemplate = post.useCategoryTemplate !== false
  const related = useTemplate && category.showRelatedPosts && category._id
    ? await sanityFetch<any[]>(relatedPostsQuery, {id: post._id, categoryId: category._id})
    : []

  const style = {
    '--category-bg': category.bgColor?.hex || (stegaClean(category.postTheme) === 'dark' ? '#080b16' : '#ffffff'),
    '--category-text': category.textColor?.hex || (stegaClean(category.postTheme) === 'dark' ? '#e8eaf1' : '#344054'),
    '--category-title': category.titleColor?.hex || (stegaClean(category.postTheme) === 'dark' ? '#ffffff' : '#101828'),
    '--category-accent': category.accentColor?.hex || 'var(--accent-color)',
    '--post-width': stegaClean(category.contentWidth || '960px'),
  } as CSSProperties

  const heroLayout = stegaClean(category.postHeroLayout || 'stacked')
  const showImage = !useTemplate || category.showFeaturedImage !== false
  const showCategory = !useTemplate || category.showCategoryLabel !== false

  return (
    <article className={`blog-post post-theme-${stegaClean(category.postTheme || 'light')} post-hero-${heroLayout}`} style={style}>
      {useTemplate && (category.templateBeforeSections?.length?<WebPageSections sections={category.templateBeforeSections}/>:<PageBuilder blocks={category.templateBefore} />)}

      <div className="post-hero">
        <div className={`post-width post-hero-layout-${heroLayout}`}>
          <div className="post-hero-copy">
            {showCategory && category.title && <a className="eyebrow" href={`/category/${stegaClean(category.slug?.current || '')}`}>{category.title}</a>}
            <h1>{post.title}</h1>
            {post.excerpt && <p className="lead">{post.excerpt}</p>}
          </div>
          {showImage && post.mainImage?.asset && <Image className="post-featured-image" src={urlFor(post.mainImage).width(1600).height(900).url()} alt={post.title || ''} width={1600} height={900} priority />}
        </div>
      </div>

      <div className="post-body post-width rich-text">
        {Array.isArray(post.richBody) ? <PortableText value={post.richBody} /> : post.body ? <p>{post.body}</p> : null}
      </div>

      {post.sections?.length?<WebPageSections sections={post.sections}/>:<PageBuilder blocks={post.pageBuilder} />}
      {useTemplate && (category.templateAfterSections?.length?<WebPageSections sections={category.templateAfterSections}/>:<PageBuilder blocks={category.templateAfter} />)}
      {useTemplate && category.defaultForm && <DynamicForm form={category.defaultForm} />}

      {related?.length > 0 && <section className="content-section related-posts"><div className="section-inner width-contained"><h2>Related posts</h2><PostCards posts={related.map((item) => ({...item, category}))} /></div></section>}
      {post.enableQr && <div className="qr-link"><a href={`/api/qr?url=${encodeURIComponent(`/blog/${slug}`)}`}>Generate QR for this post</a></div>}
    </article>
  )
}
