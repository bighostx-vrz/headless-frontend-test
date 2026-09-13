# Windows Quick Start — Testing Project

This guide is for the **learning project** (`e3kyrsn9` / `testing`). Do not use production Inspira credentials.

## 1. Prerequisites

Install current Node.js 22 LTS or later and Git (Git is optional if you are working from the ZIP).

Open two PowerShell windows.

## 2. Run Sanity Studio

```powershell
cd path\to\Inspira-Sanity-Learning-Lab-v3\studio
Copy-Item .env.example .env
npm install
npm run typecheck
npm run dev
```

Open `http://localhost:3333`.

The Studio defaults to:

- Project ID: `e3kyrsn9`
- Dataset: `testing`
- Preview frontend: `http://localhost:3000`

You can change these in `.env`.

## 3. Configure CORS for local preview

In Sanity Manage → Testing → API → CORS origins, add:

`http://localhost:3000`

Enable credentials for the origin because Presentation/Draft Mode requires them.

## 4. Create a temporary Viewer API token for frontend draft preview

Sanity Manage → Testing → API → Tokens → Add API token.

Use **Viewer** permission for the frontend read token. Copy it once into `frontend/.env.local` as `SANITY_API_READ_TOKEN`.

Do not name it `NEXT_PUBLIC_*`. Do not paste it into source files or share it in screenshots/email/chat.

## 5. Run frontend

```powershell
cd path\to\Inspira-Sanity-Learning-Lab-v3\frontend
Copy-Item .env.example .env.local
```

Edit `.env.local` and add the temporary Viewer token. Then:

```powershell
npm install
npm run typecheck
npm run dev
```

Open `http://localhost:3000`.

## 6. Optional: seed the Elementor-style demo page

Only do this on the `testing` dataset. Create a temporary **write-capable** token, use it for the seed operation, then revoke it.

From the package root:

```powershell
$env:SANITY_PROJECT_ID="e3kyrsn9"
$env:SANITY_DATASET="testing"
$env:SANITY_API_WRITE_TOKEN="YOUR_TEMPORARY_WRITE_TOKEN"
node scripts/seed-demo.mjs
Remove-Item Env:SANITY_API_WRITE_TOKEN
```

Open `/elementor-lab` in the frontend after the seed completes.

## 7. Test actual Growth user roles

The **Viewer** shown under API Tokens is an API-token permission, not your human user role.

Go to Sanity Manage → Testing → **Members**.

Recommended test while the Growth trial is active:

1. Keep your main account as Administrator.
2. Invite a second account you control as Editor.
3. In Studio open **Role & Access Lab** with each account.
4. Compare Site Settings, Page Builder, Section Library, Forms and Category Theme controls.

## 8. Draft preview

Open Studio → Presentation. The frontend Draft Mode route validates Sanity's preview secret and uses the server-only Viewer token to query drafts.

Shared-preview availability/behavior depends on the current Sanity project and Presentation configuration. Test it in the learning project rather than assuming the production Inspira setup behaves the same way.

## 9. Clean up after learning

- Revoke temporary write tokens.
- Revoke or rotate read tokens you no longer need.
- Do not deploy this project over the live Inspira website.
- Keep `ALLOW_ADVANCED_CODE=false` unless specifically testing advanced-code behavior.
