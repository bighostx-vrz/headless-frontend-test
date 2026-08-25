export default function Hero({ data }: { data: any }) {
  if (!data) return null;

  return (
    <div style={{ padding: "80px 40px", backgroundColor: "#111827", borderRadius: "10px", textAlign: "center", marginBottom: "40px", marginTop: "40px" }}>
      
      {/* We override the global h1 color here so it shows up on the dark background! */}
      <h1 style={{ color: "white", margin: "0 0 20px 0", fontSize: "3.5rem" }}>
        {data.heading}
      </h1>
      
      <p style={{ fontSize: "1.3rem", margin: "0 0 30px 0", color: "#9CA3AF" }}>
        {data.tagline}
      </p>
      
      {data.buttonText && data.buttonUrl && (
        <a href={data.buttonUrl} style={{ backgroundColor: "#3B82F6", color: "white", padding: "15px 30px", borderRadius: "5px", textDecoration: "none", fontWeight: "bold", display: "inline-block" }}>
          {data.buttonText}
        </a>
      )}
      
    </div>
  );
}