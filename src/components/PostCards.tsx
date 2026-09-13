import Image from 'next/image'
import {urlFor} from '@/sanity/lib/image'

export default function PostCards({posts}: {posts: any[]}) {
  if (!posts?.length) return <p>No posts found.</p>
  return (
    <div className="post-grid">
      {posts.map((post) => (
        <a className="post-card" href={`/blog/${post.slug?.current}`} key={post._id} style={{borderColor: post.category?.accentColor?.hex || undefined}}>
          {post.mainImage?.asset && <Image src={urlFor(post.mainImage).width(800).height(500).url()} alt={post.title || ''} width={800} height={500} />}
          <div className="post-card-copy">
            {post.category?.title && <div className="eyebrow">{post.category.title}</div>}
            <h3>{post.title}</h3>
            {post.excerpt && <p>{post.excerpt}</p>}
            <span>Read more →</span>
          </div>
        </a>
      ))}
    </div>
  )
}
