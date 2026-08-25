import { client, urlFor } from "../../sanity";
import DynamicForm from "../../components/DynamicForm"; 

export default async function About() {
  const sanityData = await client.fetch(`*[_type == "page" && slug.current == "about"][0]`);

  if (!sanityData) {
    return <div style={{ padding: "50px", textAlign: "center" }}>Page not found in Sanity yet!</div>;
  }

  return (
    <main style={{ maxWidth: "800px", margin: "0 auto", padding: "50px" }}>
      
      <h1>{sanityData.heading}</h1>
      
      {sanityData.mainImage && (
        <img 
          src={urlFor(sanityData.mainImage).width(800).url()} 
          alt="About Page Image"
          style={{ width: "100%", borderRadius: "10px", marginTop: "20px", marginBottom: "20px" }}
        />
      )}

      <p>{sanityData.body}</p>

      <div style={{ marginTop: "60px" }}>
        {/* We add a quick border-none override here just in case you don't want the H2 underline above the form! */}
        <h2 style={{ borderBottom: "none" }}>Have Questions?</h2>
        
        <DynamicForm formData={sanityData?.leadForm} />
      </div>

    </main>
  );
}