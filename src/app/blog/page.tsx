import PostCards from '@/components/PostCards'
import {sanityFetch} from '@/sanity/lib/fetch'
import {postsQuery} from '@/sanity/lib/queries'

export default async function BlogIndex() {
  const posts = await sanityFetch<any[]>(postsQuery)
  return <section className="content-section"><div className="section-inner width-contained"><h1>Insights</h1><PostCards posts={posts} /></div></section>
}
