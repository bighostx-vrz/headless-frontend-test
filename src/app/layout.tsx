export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "Arial, sans-serif" }}>
        
        {/* GLOBAL HEADER */}
        <header style={{ backgroundColor: "#111827", color: "white", padding: "20px 50px", display: "flex", justifyContent: "space-between" }}>
          <div style={{ fontWeight: "bold", fontSize: "1.5rem" }}>My Headless Site</div>
          <nav>
            <a href="/" style={{ color: "white", marginRight: "20px", textDecoration: "none" }}>Home</a>
            <a href="/about" style={{ color: "white", marginRight: "20px", textDecoration: "none" }}>About</a>
            <a href="/contact" style={{ color: "white", textDecoration: "none" }}>Contact</a>
          </nav>
        </header>

        {/* THIS IS WHERE YOUR PAGE CONTENT GOES */}
        <div style={{ minHeight: "80vh" }}>
          {children}
        </div>

        {/* GLOBAL FOOTER */}
        <footer style={{ backgroundColor: "#f3f4f6", padding: "30px", textAlign: "center", borderTop: "1px solid #e5e7eb" }}>
          <p>© 2026 My Headless Website. All rights reserved.</p>
        </footer>

      </body>
    </html>
  );
}