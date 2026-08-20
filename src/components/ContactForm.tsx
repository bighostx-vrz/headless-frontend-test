export default function ContactForm() {
  return (
    <form 
      action="https://formspree.io/f/xkjwkeen" 
      method="POST"
      style={{ display: "flex", flexDirection: "column", gap: "20px", backgroundColor: "#f9fafb", padding: "40px", borderRadius: "10px", border: "1px solid #e5e7eb" }}
    >
      <div>
        <label style={{ fontWeight: "bold", display: "block", marginBottom: "8px", color: "#374151" }}>Your Name</label>
        <input type="text" name="name" placeholder="John Doe" required style={{ width: "100%", padding: "12px", borderRadius: "5px", border: "1px solid #d1d5db", fontSize: "1rem" }} />
      </div>

      <div>
        <label style={{ fontWeight: "bold", display: "block", marginBottom: "8px", color: "#374151" }}>Email Address</label>
        <input type="email" name="email" placeholder="john@example.com" required style={{ width: "100%", padding: "12px", borderRadius: "5px", border: "1px solid #d1d5db", fontSize: "1rem" }} />
      </div>

      <div>
        <label style={{ fontWeight: "bold", display: "block", marginBottom: "8px", color: "#374151" }}>Message</label>
        <textarea name="message" rows={5} placeholder="How can we help?" required style={{ width: "100%", padding: "12px", borderRadius: "5px", border: "1px solid #d1d5db", fontSize: "1rem", resize: "vertical" }}></textarea>
      </div>

      <button type="submit" style={{ backgroundColor: "#3B82F6", color: "white", padding: "15px", border: "none", borderRadius: "5px", fontWeight: "bold", fontSize: "1.1rem", cursor: "pointer", marginTop: "10px" }}>
        Send Message
      </button>
    </form>
  );
}