import { client } from "../../sanity";
import Hero from "../../components/Hero";
import DynamicForm from "../../components/DynamicForm";
import HtmlBlock from "../../components/HtmlBlock";
import { draftMode } from 'next/headers';

export const revalidate = 0;

export default async function Contact() {
  // 1. Check for Draft Mode
  const draft = await draftMode();
  const isEnabled = draft.isEnabled;

  // 2. Fetch the data with the dynamic perspective
  const pageData = await client.fetch(
    `*[_type == "page" && slug.current == "contact"][0]`,
    {},
    {
      stega: true,
      cache: 'no-store',
      perspective: isEnabled ? 'previewDrafts' : 'published'
    }
  );

  if (!pageData) {
    return <div style={{ padding: "50px", textAlign: "center" }}>Contact page not found in Sanity yet!</div>;
  }

  return (
    <main style={{ maxWidth: "1000px", margin: "0 auto", padding: "50px" }}>
      
      {/* Draft Mode Banner for Contact Page */}
      {isEnabled && (
        <div style={{ backgroundColor: "#FEF08A", color: "#854D0E", padding: "10px 20px", borderRadius: "6px", marginBottom: "20px", fontWeight: "bold" }}>
          ⚡ You are viewing unpublished drafts! 
          <a href="/api/disable-draft?slug=/contact" style={{ color: "#854D0E", marginLeft: "10px" }}>[Exit]</a>
        </div>
      )}

      {/* Inject Custom Code Blocks */}
      {pageData?.customCss && (
        <style dangerouslySetInnerHTML={{ __html: pageData.customCss }} />
      )}
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

    </main>
  );
}