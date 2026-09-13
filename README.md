# Inspira Sanity Learning Lab v3

**Purpose:** a safe training / proof-of-concept project that demonstrates how a Sanity + Next.js + Vercel website can provide an Elementor-like maintenance experience without turning every content editor into a frontend developer.

This package is **not** Basil Global's production repository and must not be deployed over `inspiraenterprise.com`.

## What v3 demonstrates

### 1. Three responsibility layers

- **Content user** — normal text, images, posts, SEO content and existing reusable-section content.
- **Design Administrator** — the built-in Sanity `administrator` role is used as the trusted design-level user in this lab. It can control Page Builder structure, global design, section themes/layouts, forms and advanced fields.
- **Developer** — new React components, APIs, source architecture, deployments, Cloudflare/WAF and security-sensitive infrastructure.

No fake/custom Growth-plan role is created. The **Role & Access Lab** reads the actual logged-in Sanity role(s). The schema-level `hidden`/`readOnly` rules are a **Studio UX guard**, not dataset-level authorization; a precise custom Design Admin security role would require custom-role capability.

### 2. Elementor-style design controls

The lab exposes structured controls for:

- global heading/body fonts, weights, desktop/mobile sizes and colours;
- primary/secondary accents, dark/light backgrounds;
- global content width, article width, section spacing, button/card radius;
- sticky header and back-to-top;
- footer alignment and mobile columns;
- reusable Style Presets;
- per-section width, desktop/tablet/mobile columns, gap, spacing, alignment;
- light, dark, brand, zebra and custom themes;
- solid, gradient or image backgrounds with overlay;
- per-section heading/text/accent colours and font-size overrides;
- border, radius, shadow, minimum height and device visibility;
- grid/list/horizontal-slider display modes;
- hero single image or slideshow;
- page-level and global CSS plus advanced HTML/JavaScript fields guarded by `ALLOW_ADVANCED_CODE=false` by default.

### 3. Inspira-style pattern library

Reusable sections include patterns corresponding to the kinds of layouts visible on the current site: Hero/Fabric, What's New, Statistics, Before/After, Pillars, Industries accordion, Testimonials, Media Feature, Capabilities, Fusion Centers/locations, Case Studies, Large Proof Metric, Recognition, Resources, Process, Expert Connect, Brochure grids, Filtered Collections, Rich Content and CTA.

These are **learning recreations of design/content patterns**, not copies of Basil's production components or code.

### 4. Reusable Page Builder

Pages contain references to the **Section Library** and **Forms Library**. The Administrator can add, hide/show, reorder and reuse existing sections. Editing one reusable section updates every page that references it.

### 5. Elementor-style Forms Library

Forms support:

- create/reuse forms;
- add/remove/reorder/enable/disable fields;
- text, email, phone, number, textarea, select, radio, checkbox, consent, date, time, file and hidden fields;
- label, placeholder, help text, default value, required toggle, autocomplete and field width;
- recipient, CC, BCC, Reply-To field and subject;
- message, redirect/thank-you or download action after success;
- demo mode or Resend email mode;
- honeypot or Google reCAPTCHA v3;
- optional success/failure logging to Sanity using a server-only write token.

### 6. Content architecture

Included content types: Pages, Blog Posts, News/Press, Insights, Brochures, Case Studies, Services, Industries, Regions, Categories & Themes, Leadership/People, Recognition/Awards, Events, reusable Media Library Items, Redirects and Form Submission Logs.

### 7. SEO / regional / maintenance examples

- SEO title, description, canonical URL, Open Graph image, robots controls and JSON-LD on pages.
- hreflang alternate URLs on pages.
- dynamic `/sitemap.xml` and `/robots.txt`.
- QR generation for pages/posts through `/api/qr`.
- category Theme Builder.
- case-study filters by Industry / Service / Region.
- regional visibility using Cloudflare's `CF-IPCountry` header when available.
- optional home regional routing using Region country-code mappings.
- Redirect Manager handled by Next.js `proxy.ts`.
- editable search labels and a basic CMS search page.
- cookie-consent copy/settings with analytics loaded only after consent when the banner is enabled.

## Important: API token vs user role

In Sanity Manage, **API → Tokens → Viewer** describes the token's permission. It is **not your logged-in user's Studio role**.

To test users and roles, go to **Sanity Manage → Project → Members**. Use the v3 Studio's **Role & Access Lab** to see the role returned for the current login.

## Local setup

### Studio

```bash
cd studio
cp .env.example .env
npm install
npm run dev
```

Studio: `http://localhost:3333`

### Frontend

Create a **Viewer** API token for server-side draft preview. Do not expose it as `NEXT_PUBLIC_*`.

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

Frontend: `http://localhost:3000`

Add `http://localhost:3000` to Sanity **CORS Origins** with credentials enabled for Presentation/Draft Mode.

## Optional demo seeder

The package includes `scripts/seed-demo.mjs`. It creates a training page at `/elementor-lab` plus sample services, industries, regions, case study, news, recognition, brochure, configurable form and reusable homepage-style sections.

**Use it only with your `testing` dataset.** Create a temporary write-capable token, run the seed, then revoke the token.

Windows PowerShell example:

```powershell
$env:SANITY_PROJECT_ID="e3kyrsn9"
$env:SANITY_DATASET="testing"
$env:SANITY_API_WRITE_TOKEN="YOUR_TEMPORARY_TEST_TOKEN"
node scripts/seed-demo.mjs
```

Never paste the token into source files, screenshots, email or ChatGPT.

## Recommended learning sequence during the Growth trial

1. Open **Members** and confirm your current role.
2. Open **Role & Access Lab** in Studio.
3. As Administrator, change Site Settings → Global Design.
4. Create/duplicate a reusable section and change columns/theme/background/spacing.
5. Add the section to a page, hide/show it and reorder it.
6. Create a Form and change fields, labels, required status and forwarding settings.
7. Change a Category theme and compare its blog result.
8. Open Presentation and test Draft Mode.
9. Invite another account as Editor and compare what it can see/edit.
10. Review `REQUIREMENTS_TRACEABILITY.md` before speaking with Basil.

## Production boundary

The lab intentionally does **not** claim to reproduce Inspira's actual AI Search backend, Cloudflare WAF/bot rules, production geo-routing logic, proprietary design components, CRM integrations, live form destinations or Basil's source/deployment architecture. Those require the real production repository/configuration and formal staging QA.
