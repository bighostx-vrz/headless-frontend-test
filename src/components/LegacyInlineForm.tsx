'use client'

export default function LegacyInlineForm({formData}: {formData: any}) {
  if (!formData) return null
  return (
    <section className="form-shell">
      <h2>{formData.formHeading || 'Contact Us'}</h2>
      <p className="notice">Legacy learning form. Use the reusable Forms Library for new pages.</p>
      <div className="legacy-fields">
        {formData.showName && <label>{formData.nameLabel || 'Your Name'}<input disabled /></label>}
        {formData.showEmail && <label>{formData.emailLabel || 'Email'}<input disabled /></label>}
        {formData.showPhone && <label>{formData.phoneLabel || 'Phone'}<input disabled /></label>}
        {formData.showOrganization && <label>{formData.organizationLabel || 'Organization'}<input disabled /></label>}
        {formData.showDate && <label>{formData.dateLabel || 'Date'}<input type="date" disabled /></label>}
        {formData.showMessage && <label>{formData.messageLabel || 'Message'}<textarea disabled /></label>}
      </div>
    </section>
  )
}
