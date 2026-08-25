import { client, urlFor } from "../sanity";
import DynamicForm from "../components/DynamicForm";
import Hero from "../components/Hero"; 
import HtmlBlock from "../components/HtmlBlock";

export const revalidate = 0;

export default async function Home() {
// Update this block inside your Home() component:
  const pageData = await client.fetch(
    `*[_type == "page" && slug.current == "home"][0]`,
    {}, 
    { 
      stega: true, 
      cache: 'no-store',
      perspective: 'previewDrafts' // <--- Tell it to look at the private drafts!
    } 
  );
  const postsData = await client.fetch(`*[_type == "post"] | order(_createdAt desc)`);


  
  return (
    <main style={{ maxWidth: "1000px", margin: "0 auto", padding: "50px" }}>

      {/* --- INJECT CUSTOM CSS --- */}
      {pageData?.customCss && (
        <style dangerouslySetInnerHTML={{ __html: pageData.customCss }} />
      )}

      {/* --- INJECT HEADER SCRIPTS --- */}
      {pageData?.headScripts && (
        <div dangerouslySetInnerHTML={{ __html: pageData.headScripts }} />
      )}

      {/* THE TRAFFIC COP (Page Builder Loop) */}
      {pageData?.pageBuilder?.map((block: any, index: number) => {
        switch (block._type) {
          case 'heroSection':
            return <Hero key={index} data={block} />;
          case 'formComponent':
            return <DynamicForm key={index} formData={block} />;
          case 'htmlBlock':
            return <HtmlBlock key={index} data={block} />;
          default:
            return <div key={index}>Component {block._type} is missing!</div>;
        }
      })}

      {/* YOUR LATEST ARTICLES (Kept exactly as you had it!) */}
      <div style={{ marginTop: "60px" }}>
        <h2>Latest Articles</h2>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginTop: "20px" }}>
          
          {postsData.map((post: any) => (
            <a href={`/blog/${post.slug.current}`} key={post._id} style={{ border: "1px solid #e5e7eb", borderRadius: "8px", padding: "15px", color: "inherit", display: "flex", flexDirection: "column" }}>
              
              {post.mainImage && (
                <img 
                  src={urlFor(post.mainImage).width(400).url()} 
                  alt={post.title}
                  style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "5px", marginBottom: "15px" }}
                />
              )}
              
              <h3 style={{ margin: "0 0 10px 0" }}>{post.title}</h3>
              <p style={{ color: "#3B82F6", fontSize: "0.9rem", margin: 0, marginTop: "auto" }}>Read more →</p>
              
            </a>
          ))}

        </div>
      </div>
      
    </main>
  );
}