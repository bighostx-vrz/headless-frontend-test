import { client, urlFor } from "../sanity";

// We tell the Home page not to cache, so your new posts show up instantly!
export const revalidate = 0;

export default async function Home() {
  // 1. Fetch the Home Page text/images
  const pageData = await client.fetch(`*[_type == "page" && slug.current == "home"][0]`);
  
  // 2. Fetch ALL Blog Posts, ordered by the date they were created (newest first)
  const postsData = await client.fetch(`*[_type == "post"] | order(_createdAt desc)`);

  return (
    <main style={{ maxWidth: "1000px", margin: "0 auto", padding: "50px", fontFamily: "Arial, sans-serif" }}>
      
      {/* --- HERO SECTION (From your Page Blueprint) --- */}
      <h1 style={{ fontSize: "3rem", color: "#111827", marginBottom: "10px" }}>
        {pageData?.heading || "Welcome"}
      </h1>
      
      {pageData?.mainImage && (
        <img 
          src={urlFor(pageData.mainImage).width(1000).url()} 
          alt="Main Page Image"
          style={{ width: "100%", maxHeight: "400px", objectFit: "cover", borderRadius: "10px", marginTop: "20px" }}
        />
      )}

      <p style={{ fontSize: "1.2rem", color: "#4B5563", lineHeight: "1.6", marginBottom: "50px" }}>
        {pageData?.body}
      </p>

      {/* --- LATEST POSTS GRID SECTION --- */}
      <h2 style={{ fontSize: "2rem", borderBottom: "2px solid #e5e7eb", paddingBottom: "10px" }}>Latest Articles</h2>
      
      {/* This div creates the 3-column CSS Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginTop: "20px" }}>
        
        {/* The .map() function loops through your posts and creates a card for each one */}
        {postsData.map((post: any) => (
          
          <a href={`/blog/${post.slug.current}`} key={post._id} style={{ border: "1px solid #e5e7eb", borderRadius: "8px", padding: "15px", textDecoration: "none", color: "inherit", display: "flex", flexDirection: "column" }}>
            
            {post.mainImage && (
              <img 
                src={urlFor(post.mainImage).width(400).url()} 
                alt={post.title}
                style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "5px", marginBottom: "15px" }}
              />
            )}
            
            <h3 style={{ fontSize: "1.2rem", margin: "0 0 10px 0" }}>{post.title}</h3>
            <p style={{ color: "#3B82F6", fontSize: "0.9rem", margin: 0, marginTop: "auto" }}>Read more →</p>
            
          </a>
        ))}

      </div>

    </main>
  );
}