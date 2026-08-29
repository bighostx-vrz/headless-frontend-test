import { draftMode } from 'next/headers';
import { client, urlFor } from "../sanity";
import DynamicForm from "../components/DynamicForm";
import Hero from "../components/Hero"; 
import HtmlBlock from "../components/HtmlBlock";
import SectionBlock from "../components/SectionBlock"; // 1. IMPORT THE SECTION BLOCK

export const revalidate = 0;

export default async function Home() {
  const draft = await draftMode();
  const isEnabled = draft.isEnabled;

  const pageData = await client.fetch(
    `*[_type == "page" && slug.current == "home"][0]`,
    {},
    { 
      stega: isEnabled, 
      cache: 'no-store', 
      perspective: isEnabled ? 'previewDrafts' : 'published',
      token: process.env.SANITY_API_READ_TOKEN // 2. ADD TOKEN FOR DRAFTS
    }
  );

  const postsData = await client.fetch(
    `*[_type == "post" && isFeatured == true] | order(_createdAt desc){
      ...,
      category->{ title, bgColor, textColor, accentColor, titleColor }
    }`,
    {},
    { 
      stega: isEnabled, 
      cache: 'no-store', 
      perspective: isEnabled ? 'previewDrafts' : 'published',
      token: process.env.SANITY_API_READ_TOKEN // 2. ADD TOKEN FOR DRAFTS (Posts need it too!)
    }
  );

  return (
    <main style={{ maxWidth: "1000px", margin: "0 auto", padding: "50px" }}>
      
      {isEnabled && (
        <div style={{ backgroundColor: "#FEF08A", color: "#854D0E", padding: "10px 20px", borderRadius: "6px", marginBottom: "20px", fontWeight: "bold" }}>
          ⚡ You are viewing unpublished drafts! <a href="/api/disable-draft?slug=/" style={{ color: "#854D0E", marginLeft: "10px" }}>[Exit]</a>
        </div>
      )}

      {pageData?.pageBuilder?.map((block: any, index: number) => {
        switch (block._type) {
          case 'heroSection': return <Hero key={index} data={block} />;
          case 'formComponent': return <DynamicForm key={index} formData={block} />;
          case 'htmlBlock': return <HtmlBlock key={index} data={block} />;
          case 'sectionBlock': return <SectionBlock key={index} data={block} />; // 3. ADD TO SWITCH STATEMENT
          default: return null;
        }
      })}

      <div style={{ marginTop: "60px" }}>
        <h2>Featured Articles</h2>
        
        {postsData.length === 0 && (
          <p style={{ color: "#6b7280", fontStyle: "italic" }}>
            No featured posts yet! Go to Sanity, turn on the "Feature on Homepage" toggle for a post, and hit Publish.
          </p>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginTop: "20px" }}>
          {postsData.map((post: any) => {
            // Mapping the exact schema color fields
            const borderHex = post.category?.accentColor?.hex || '#e5e7eb';
            const textHex = post.category?.titleColor?.hex || post.category?.textColor?.hex || '#111827';
            const bgHex = post.category?.bgColor?.hex || '#ffffff';
            
            return (
              <a href={`/blog/${post.slug?.current}`} key={post._id} style={{ backgroundColor: bgHex, border: `2px solid ${borderHex}`, borderRadius: "8px", padding: "15px", color: textHex, textDecoration: "none" }}>
                
                {post.category && (
                  <div style={{ fontSize: "0.75rem", fontWeight: "bold", color: borderHex, marginBottom: "10px", textTransform: "uppercase" }}>
                    {post.category.title}
                  </div>
                )}

                {post.mainImage?.asset && (
                  <img 
                    src={urlFor(post.mainImage).width(400).url()} 
                    alt={post.title}
                    style={{ width: "100%", height: "150px", objectFit: "cover", borderRadius: "5px", marginBottom: "15px" }}
                  />
                )}
                
                <h3 style={{ margin: "0 0 10px 0", color: textHex }}>{post.title}</h3>
                <p style={{ color: borderHex, fontSize: "0.9rem", margin: 0, marginTop: "auto" }}>Read more →</p>
              </a>
            );
          })}
        </div>
      </div>
    </main>
  );
}