# Security & Production Boundary

## Included learning guardrails

- Draft preview token stays server-side.
- Sanity write token is optional and server-only.
- Advanced code execution is OFF by default.
- Form delivery defaults to demo mode.
- Form email fails closed if credentials/recipients are missing.
- Basic server-side field validation and file-size cap.
- Honeypot and optional reCAPTCHA v3 verification.
- Consent-aware GA/GTM loading.
- Baseline headers: `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `X-Frame-Options`.
- HSTS can be enabled only after HTTPS is confirmed.

## Do not treat as production certification

Before production use, separately verify:

- real Sanity role/permission matrix;
- CSP tailored to Sanity preview, Vercel, GA/GTM, reCAPTCHA and required third parties;
- Cloudflare WAF, bot controls, rate limiting and IP policies;
- form rate limiting, attachment MIME/malware scanning, storage/retention and PII handling;
- email-domain authentication and allowed-recipient policy;
- CRM/marketing-system integration;
- preview-site authentication/share policy;
- Vercel deployment protection and environment separation;
- backups/dataset export and rollback;
- accessibility, responsive, PageSpeed and browser QA;
- security headers on production origin/CDN;
- analytics/consent legal policy for target regions.
