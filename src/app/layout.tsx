import './globals.css';
import { VisualEditing } from 'next-sanity/visual-editing'
import { client } from '../sanity' 

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  
  // 1. Fetch the Site Settings document from Sanity
  const settings = await client.fetch(`*[_type == "siteSettings"][0]`);

  // 2. Set Fallback Fonts (just in case the editor hasn't saved settings yet)
  const hFont = settings?.headingFont || 'Arial, sans-serif';
  const hWeight = settings?.headingWeight || 'bold';
  const bFont = settings?.bodyFont || 'Arial, sans-serif';

  return (
    <html lang="en">
      <head>
        {/* 3. THE GLOBAL TYPOGRAPHY ENGINE */}
        <style dangerouslySetInnerHTML={{
          __html: `
            :root {
              --heading-font: ${hFont};
              --heading-weight: ${hWeight};
              --body-font: ${bFont};
            }
            
            h1, h2, h3, h4, h5, h6 {
              font-family: var(--heading-font);
              font-weight: var(--heading-weight);
            }
            
            body, p, a, span, input, button {
              font-family: var(--body-font);
            }
          `
        }} />
      </head>
      <body>
        
        {/* GLOBAL HEADER */}
        <header style={{ backgroundColor: "#111827", color: "white", padding: "20px 50px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          
          <div style={{ fontWeight: "bold", fontSize: "1.5rem" }}>
            {settings?.siteTitle || "My Default Headless Site"}
          </div>
          
          <nav>
            {settings?.mainNav?.map((menuItem: any, index: number) => (
              <a 
                key={index} 
                href={menuItem.link} 
                style={{ color: "white", marginRight: "20px", textDecoration: "none" }}
              >
                {menuItem.label}
              </a>
            ))}
          </nav>
        </header> 

        {/* PAGE CONTENT */}
        <div style={{ minHeight: "80vh" }}>
          {children}
        </div>

        {/* GLOBAL FOOTER */}
        <footer style={{ backgroundColor: "#f3f4f6", padding: "30px", textAlign: "center", borderTop: "1px solid #e5e7eb" }}>
          <p style={{ margin: 0 }}>{settings?.footerText || "© 2026 Default Footer."}</p>
        </footer>

        <VisualEditing />
      </body>
    </html>
  );
}