# References

These references were used to keep the learning architecture aligned with current Sanity concepts and the publicly visible Inspira website. They are references only; no production source code is included.

## Sanity

- Roles and permissions: https://www.sanity.io/docs/content-lake/roles-concepts
- User guide — Roles: https://www.sanity.io/docs/user-guides/roles
- Growth plan trial: https://www.sanity.io/docs/platform-management/growth-plan-trial
- Implementing Draft Mode / shared preview: https://www.sanity.io/docs/visual-editing/implementing-draft-mode
- Visual Editing / Presentation: https://www.sanity.io/docs/visual-editing

### Role facts used in the lab

Growth provides the built-in **Administrator, Editor, Viewer, Developer and Contributor** roles. Custom roles are an Enterprise capability. The lab therefore uses the built-in Administrator as the trusted “Design Administrator” for demonstration instead of inventing a custom Growth role.

An API token permission such as **Viewer Token** is separate from a human project-member role.

`hidden` / `readOnly` schema callbacks are Studio-interface controls; they are not a substitute for dataset-level authorization.

## Public Inspira pages used for pattern study

- Homepage: https://inspiraenterprise.com/
- Cases: https://inspiraenterprise.com/cases
- Services: https://inspiraenterprise.com/services
- Industries: https://inspiraenterprise.com/industries
- Insights: https://inspiraenterprise.com/insights
- Brochures: https://inspiraenterprise.com/brochures

The public site was reviewed for visible layout/content patterns only. Basil Global's proprietary source, Vercel configuration, Sanity production dataset and Cloudflare configuration are not included or inferred as if known.
