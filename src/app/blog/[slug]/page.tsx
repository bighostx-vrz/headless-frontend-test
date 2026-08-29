import { client, urlFor } from "../../../sanity";
import { draftMode } from 'next/headers';
import Hero from "../../../components/Hero";
import DynamicForm from "../../../components/DynamicForm";
import HtmlBlock from "../../../components/HtmlBlock";

export const revalidate = 0;

export default async function BlogPost(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const slug = params.slug;

  const draft = await draftMode();
  const isEnabled = draft.isEnabled;

  const postData = await client.fetch(
    `*[_type == "post" && slug.current == $slug][0]{
      ...,
      category->
    }`,
    { slug: slug },
    // FIXED: Stega is now tied to isEnabled!
    {
      stega: isEnabled, 
      cache: 'no-store',
      perspective: isEnabled ? 'previewDrafts' : 'published'
    }
  );

  if (!postData) {
    return <div style={{ padding: "50px", textAlign: "center" }}>Post not found!</div>;
  }

  // Exact schema match for colors
  const bgColor = postData.category?.bgColor?.hex || '#ffffff'; 
  const textColor = postData.category?.textColor?.hex || '#111827'; 
  const accentColor = postData.category?.accentColor?.hex || '#3B82F6'; 
  const titleColor = postData.category?.titleColor?.hex || textColor;

  const renderBody = () => {
    if (!postData.body) return null;
    if (typeof postData.body === 'string') {
      return <p>{postData.body}</p>;
    }
    return (
      <div style={{ padding: "20px", backgroundColor: "#f3f4f6", color: "#000", borderRadius: "8px" }}>
        <p>⚠️ <strong>Legacy Rich Text Detected</strong></p>
      </div>
    );
  };

  return (
    <main style={{ backgroundColor: bgColor, color: textColor, minHeight: "100vh" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "50px" }}>
        
        {isEnabled && (
          <div style={{ backgroundColor: "#FEF08A", color: "#854D0E", padding: "10px 20px", borderRadius: "6px", marginBottom: "20px", fontWeight: "bold" }}>
            ⚡ You are viewing an unpublished draft! 
            <a href={`/api/disable-draft?slug=/blog/${slug}`} style={{ color: "#854D0E", marginLeft: "10px" }}>[Exit]</a>
          </div>
        )}

        <article style={{ borderTop: `8px solid ${accentColor}`, paddingTop: "20px" }}>
          
          {postData.category && (
            <span style={{ backgroundColor: accentColor, color: bgColor, padding: "4px 12px", borderRadius: "20px", fontSize: "0.8rem", fontWeight: "bold" }}>
              {postData.category.title}
            </span>
          )}

          <h1 style={{ fontSize: "2.5rem", margin: "15px 0 20px 0", color: titleColor }}>
            {postData.title}
          </h1>
          
          {postData.mainImage?.asset && (
            <img 
              src={urlFor(postData.mainImage).width(1200).url()} 
              alt={postData.title}
              style={{ width: "100%", borderRadius: "12px", marginBottom: "40px" }}
            />
          )}

          <div style={{ lineHeight: "1.8", fontSize: "1.1rem", marginBottom: "40px" }}>
            {renderBody()}
          </div>
          
          {/* Page Builder */}
          {postData?.pageBuilder?.map((block: any, index: number) => {
            switch (block._type) {
              case 'heroSection': return <Hero key={index} data={block} />;
              case 'formComponent': return <DynamicForm key={index} formData={block} />;
              case 'htmlBlock': return <HtmlBlock key={index} data={block} />;
              default: return null;
            }
          })}
        </article>
      </div>
    </main>
  );
}