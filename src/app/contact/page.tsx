import { client } from "../../sanity";
// 1. Import your new component at the top!
import ContactForm from "../../components/ContactForm";

export const revalidate = 0;

export default async function Contact() {
  const sanityData = await client.fetch(`*[_type == "page" && slug.current == "contact"][0]`);

  return (
    <main style={{ maxWidth: "800px", margin: "0 auto", padding: "50px", fontFamily: "Arial, sans-serif" }}>
      
      <h1 style={{ fontSize: "3rem", color: "#111827", marginBottom: "10px" }}>
        {sanityData?.heading || "Contact Us"}
      </h1>
      <p style={{ fontSize: "1.2rem", color: "#4B5563", lineHeight: "1.6", marginBottom: "40px" }}>
        {sanityData?.body || "Please fill out the form below."}
      </p>

      {/* 2. Drop the component right here! */}
      <ContactForm />

    </main>
  );
}