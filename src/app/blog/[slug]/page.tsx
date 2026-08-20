import { client, urlFor } from "../../../sanity";

// 1. Tell Next.js NOT to cache this page (always fetch fresh data from Sanity)
export const revalidate = 0;

// 2. In Next.js 15, params is a Promise, so we must define it as one
export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  
  // 3. We 'await' the params to extract the URL slug correctly
  const { slug } = await params;

  // Now we pass the exact slug into the Sanity query
  const sanityData = await client.fetch(`*[_type == "post" && slug.current == "${slug}"][0]`);

  if (!sanityData) {
    // I added the exact slug to this error so you can see what it's searching for!
    return <div style={{ padding: "50px", textAlign: "center" }}>Blog Post not found! (Searched for: {slug})</div>;
  }

  return (
    <main style={{ maxWidth: "800px", margin: "0 auto", padding: "50px", fontFamily: "Arial, sans-serif" }}>
      <p style={{ color: "#3B82F6", fontWeight: "bold", marginBottom: "10px" }}>Blog Post</p>
      
      <h1 style={{ fontSize: "3rem", color: "#111827", marginBottom: "10px" }}>
        {sanityData.title}
      </h1>
      
      {sanityData.mainImage && (
        <img 
          src={urlFor(sanityData.mainImage).width(800).url()} 
          alt="Blog Post Image"
          style={{ width: "100%", borderRadius: "10px", marginTop: "20px", marginBottom: "20px" }}
        />
      )}

      <p style={{ fontSize: "1.2rem", color: "#4B5563", lineHeight: "1.6" }}>
        {sanityData.body}
      </p>
    </main>
  );
}