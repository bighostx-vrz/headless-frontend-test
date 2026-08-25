'use client'; 

export default function DynamicForm({ formData }: { formData: any }) {
  if (!formData) return null;

  return (
    <div style={{ backgroundColor: "#f9fafb", padding: "40px", borderRadius: "10px", marginTop: "40px", border: "1px solid #e5e7eb", maxWidth: "600px" }}>
      <h2 style={{ marginBottom: "20px" }}>{formData.formHeading || "Contact Us"}</h2>

      <form 
        action="https://formspree.io/f/xkjwkeen" 
        method="POST"
        style={{ display: "flex", flexDirection: "column", gap: "20px" }}
      >
        
        {/* 1. DYNAMIC NAME */}
        {formData.showName && (
          <div>
            <label style={labelStyle}>{formData.nameLabel || "Your Name"}</label>
            <input type="text" name="name" placeholder={formData.nameLabel || "Your Name"} required style={inputStyle} />
          </div>
        )}

        {/* 2. DYNAMIC EMAIL */}
        {formData.showEmail && (
          <div>
            <label style={labelStyle}>{formData.emailLabel || "Email Address"}</label>
            <input type="email" name="email" placeholder={formData.emailLabel || "Email Address"} required style={inputStyle} />
          </div>
        )}

        {/* 3. DYNAMIC PHONE */}
        {formData.showPhone && (
          <div>
            <label style={labelStyle}>{formData.phoneLabel || "Phone Number"}</label>
            <input type="tel" name="phone" placeholder={formData.phoneLabel || "Phone Number"} style={inputStyle} />
          </div>
        )}

        {/* 4. DYNAMIC ORGANIZATION */}
        {formData.showOrganization && (
          <div>
            <label style={labelStyle}>{formData.organizationLabel || "Organization / Company"}</label>
            <input type="text" name="organization" placeholder={formData.organizationLabel || "Organization / Company"} style={inputStyle} />
          </div>
        )}

        {/* 5. DYNAMIC DATE */}
        {formData.showDate && (
          <div>
            <label style={labelStyle}>{formData.dateLabel || "Preferred Date"}</label>
            <input type="date" name="date" style={inputStyle} />
          </div>
        )}

        {/* 6. DYNAMIC MESSAGE */}
        {formData.showMessage && (
          <div>
            <label style={labelStyle}>{formData.messageLabel || "Message"}</label>
            <textarea name="message" rows={5} placeholder={formData.messageLabel || "Message"} required style={{ ...inputStyle, resize: "vertical" }}></textarea>
          </div>
        )}

        {/* 7. DYNAMIC BUTTON TEXT */}
        <button type="submit" style={buttonStyle}>
          {formData.buttonText || "Submit Form"}
        </button>
        
      </form>
    </div>
  );
}

const labelStyle = { fontWeight: "bold", display: "block", marginBottom: "8px", color: "#374151" };
const inputStyle = { width: "100%", padding: "12px", borderRadius: "5px", border: "1px solid #d1d5db", fontSize: "1rem", boxSizing: "border-box" as const };
const buttonStyle = { backgroundColor: "#3B82F6", color: "white", padding: "15px", border: "none", borderRadius: "5px", fontWeight: "bold", fontSize: "1.1rem", cursor: "pointer", marginTop: "10px" };