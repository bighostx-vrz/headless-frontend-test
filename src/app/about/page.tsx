import { client, urlFor } from "../../sanity";
import ContactForm from "../../components/ContactForm";

export default async function About() {
  // Notice the query change here: We are specifically asking for the page where the slug is "about"
  const sanityData = await client.fetch(`*[_type == "page" && slug.current == "about"][0]`);

  // A safety check: If you haven't hit publish in Sanity yet, show an error instead of breaking the site
  if (!sanityData) {
    return <div style={{ padding: "50px", textAlign: "center" }}>Page not found in Sanity yet!</div>;
  }

  return (
    <main style={{ maxWidth: "800px", margin: "0 auto", padding: "50px", fontFamily: "Arial, sans-serif" }}>
      
      <h1 style={{ fontSize: "3rem", color: "#111827", marginBottom: "10px" }}>
        {sanityData.heading}
      </h1>
      
      {/* We use a conditional statement so the image only tries to load if you actually uploaded one */}
      {sanityData.mainImage && (
        <img 
          src={urlFor(sanityData.mainImage).width(800).url()} 
          alt="About Page Image"
          style={{ width: "100%", borderRadius: "10px", marginTop: "20px", marginBottom: "20px" }}
        />
      )}

      <p style={{ fontSize: "1.2rem", color: "#4B5563", lineHeight: "1.6" }}>
        {sanityData.body}
      </p>

      <div style={{ marginTop: "60px" }}>
        <h2 style={{ fontSize: "2rem", marginBottom: "20px" }}>Have Questions?</h2>
        <ContactForm />
      </div>

    </main>
  );
}