import { client, urlFor } from "../../../sanity";
import DynamicForm from "../../../components/DynamicForm"; 
import Hero from "../../../components/Hero"; 
import HtmlBlock from "../../../components/HtmlBlock";

export const revalidate = 0;

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  // 1. UPDATED QUERY: We added 'pageLayout' to the theme object!
  const sanityData = await client.fetch(`
    *[_type == "post" && slug.current == "${slug}"][0]{
      title,
      body,
      mainImage,
      pageBuilder,
      "theme": category->{
        bgColor,
        textColor,
        accentColor,
        title,
        pageLayout 
      }
    }
  `);

  if (!sanityData) {
    return <div style={{ padding: "50px", textAlign: "center" }}>Blog Post not found! (Searched for: {slug})</div>;
  }

  // ==========================================
  // 2. THEMATIC ROUTER LOGIC
  // ==========================================
  const selectedLayout = sanityData.theme?.pageLayout || "standard";

  // --- OPTION A: THE "CENTERED" LAYOUT ---
  if (selectedLayout === 'centered') {
    // If "Centered" is selected in Sanity, Next.js ignores your normal code and returns this entirely different structure!
    return (
      <main style={{ backgroundColor: "#111827", color: "white", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "50px" }}>
        <p style={{ color: "#3B82F6", fontWeight: "bold", textTransform: "uppercase" }}>{sanityData.theme?.title}</p>
        <h1 style={{ fontSize: "4rem", maxWidth: "800px" }}>{sanityData.title}</h1>
        <p style={{ fontSize: "1.2rem", color: "#9CA3AF" }}>This is the Centered Layout view!</p>
      </main>
    );
  }

  // --- OPTION B: YOUR STANDARD LAYOUT ---
  // (If 'standard' is selected, or if nothing is selected, it falls back to your normal design below)

  // 3. COLOR PICKER FIX: We added `.hex` just in case you installed the Sanity Color Picker Plugin! 
  // (It safely falls back to a regular string if you didn't).
  const bg = sanityData.theme?.bgColor?.hex || sanityData.theme?.bgColor || "#ffffff";
  const text = sanityData.theme?.textColor?.hex || sanityData.theme?.textColor || "#111827";
  const accent = sanityData.theme?.accentColor?.hex || sanityData.theme?.accentColor || "#3B82F6";

  return (
    <div style={{ backgroundColor: bg, color: text, minHeight: "100vh", transition: "all 0.3s ease" }}>
      
      <main style={{ maxWidth: "800px", margin: "0 auto", padding: "50px" }}>
        
        <p style={{ color: accent, fontWeight: "bold", marginBottom: "10px", textTransform: "uppercase" }}>
          {sanityData.theme?.title || "Blog Post"}
        </p>
        
        <h1 style={{ color: text }}>{sanityData.title}</h1>
        
        {sanityData.mainImage && (
          <img 
            src={urlFor(sanityData.mainImage).width(800).url()} 
            alt="Blog Post Image"
            style={{ width: "100%", borderRadius: "10px", marginTop: "20px", marginBottom: "20px" }}
          />
        )}

        {sanityData.body && (
          <p>{sanityData.body}</p>
        )}

        {/* THE TRAFFIC COP: Your drag-and-drop page builder blocks */}
        <div style={{ marginTop: "60px" }}>
          {sanityData?.pageBuilder?.map((block: any, index: number) => {
            switch (block._type) {
              case 'heroSection':
                return <Hero key={index} data={block} />;
              case 'formComponent':
                return <DynamicForm key={index} formData={block} />;
              case 'htmlBlock':
                return <HtmlBlock key={index} data={block} />;
              default:
                return <div key={index}>Component {block._type} missing!</div>;
            }
          })}
        </div>

      </main>
    </div>
  );
}