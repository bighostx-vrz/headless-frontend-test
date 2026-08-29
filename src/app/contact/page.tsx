import { client } from "../../sanity";
import Hero from "../../components/Hero";
import DynamicForm from "../../components/DynamicForm";
import HtmlBlock from "../../components/HtmlBlock";
import SectionBlock from "../../components/SectionBlock"; // 1. IMPORT THE SECTION BLOCK
import { draftMode } from 'next/headers';

export const revalidate = 0;

export default async function Contact() {
  const draft = await draftMode();
  const isEnabled = draft.isEnabled;

  const pageData = await client.fetch(
    `*[_type == "page" && slug.current == "contact"][0]`,
    {},
    {
      stega: isEnabled, // Tied to Draft Mode
      cache: 'no-store',
      perspective: isEnabled ? 'previewDrafts' : 'published',
      token: process.env.SANITY_API_READ_TOKEN // 2. ADD TOKEN FOR DRAFTS
    }
  );

  if (!pageData) {
    return <div style={{ padding: "50px", textAlign: "center" }}>Contact page not found in Sanity yet!</div>;
  }

  return (
    <main style={{ maxWidth: "1000px", margin: "0 auto", padding: "50px" }}>
      
      {isEnabled && (
        <div style={{ backgroundColor: "#FEF08A", color: "#854D0E", padding: "10px 20px", borderRadius: "6px", marginBottom: "20px", fontWeight: "bold" }}>
          ⚡ You are viewing unpublished drafts! 
          <a href="/api/disable-draft?slug=/contact" style={{ color: "#854D0E", marginLeft: "10px" }}>[Exit]</a>
        </div>
      )}

      {pageData?.customCss && (
        <style dangerouslySetInnerHTML={{ __html: pageData.customCss }} />
      )}
      {pageData?.headScripts && (
        <div dangerouslySetInnerHTML={{ __html: pageData.headScripts }} />
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

    </main>
  );
}