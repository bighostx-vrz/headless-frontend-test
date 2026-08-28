import { client, urlFor } from "../../../sanity";
import { draftMode } from 'next/headers';

export const revalidate = 0;

export default async function BlogPost({ params }: { params: { slug: string } }) {
  // 1. Check for Draft Mode
  const draft = await draftMode();
  const isEnabled = draft.isEnabled;

  // 2. Fetch the specific blog post based on the URL parameter
  const postData = await client.fetch(
    `*[_type == "post" && slug.current == $slug][0]`,
    { slug: params.slug },
    {
      stega: true,
      cache: 'no-store',
      perspective: isEnabled ? 'previewDrafts' : 'published'
    }
  );

  if (!postData) {
    return <div style={{ padding: "50px", textAlign: "center" }}>Post not found!</div>;
  }

  return (
    <main style={{ maxWidth: "800px", margin: "0 auto", padding: "50px" }}>
      
      {/* Draft Mode Banner for specific Blog Post */}
      {isEnabled && (
        <div style={{ backgroundColor: "#FEF08A", color: "#854D0E", padding: "10px 20px", borderRadius: "6px", marginBottom: "20px", fontWeight: "bold" }}>
          ⚡ You are viewing an unpublished draft! 
          <a href={`/api/disable-draft?slug=/blog/${params.slug}`} style={{ color: "#854D0E", marginLeft: "10px" }}>[Exit]</a>
        </div>
      )}

      {/* Blog Post Content */}
      <article>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "20px" }}>{postData.title}</h1>
        
        {postData.mainImage && (
          <img 
            src={urlFor(postData.mainImage).width(1200).url()} 
            alt={postData.title}
            style={{ width: "100%", borderRadius: "12px", marginBottom: "40px" }}
          />
        )}

        {/* Basic fallback for block content body */}
        <div style={{ lineHeight: "1.8", fontSize: "1.1rem" }}>
          {/* Note: In a production app, you would use @portabletext/react here to render rich text blocks! */}
          <p>
            {postData.body 
              ? "Your PortableText component goes here to render the rich text blocks." 
              : "No content available."}
          </p>
        </div>
      </article>

    </main>
  );
}