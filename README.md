# Robin – AI Landing Page Generator

Themed to match [withrobin.ai](https://withrobin.ai) — deep teal background, orange accents, teal gradient logo.

## Project Structure

```
robin-project/
├── src/
│   ├── App.tsx          ← Main React + TypeScript app
│   ├── main.tsx         ← Entry point
│   └── index.css        ← Tailwind + custom animations
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
└── robin-n8n-workflow.json   ← Drop into n8n to import
```

## Quick Start

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

## n8n Workflow

Import `robin-n8n-workflow.json` into your n8n instance:

1. Go to **Workflows → Import from file**
2. Select `robin-n8n-workflow.json`
3. Update credentials:
   - **Gemini Chat Model** → add your Google Gemini API key
   - **Save to Sheets** → connect your Google Sheets OAuth account
   - Update the `documentId` in **Save to Sheets** to your own Sheet ID
4. Activate the workflow

### Webhook endpoint
```
POST https://your-n8n-instance/webhook/ai-landing
Content-Type: application/json

{
  "Role": "Marketing Director",
  "Service": "AI Automation",
  "More Details": "We help SMBs automate their sales funnel..."
}
```

Returns a full Robin-themed HTML page.

## How It Works

```
Webhook → AI Agent (Gemini) → Render HTML → Save to Sheets → Return HTML
```

The React app calls the Anthropic API directly (no n8n needed for the frontend).
The n8n workflow is for server-side use / webhook integrations.

## Customisation

- **Colors**: Edit `tailwind.config.js` → `theme.extend.colors.robin`
- **Prompt**: Edit the `generate()` function in `App.tsx`
- **Services list**: Add to the `SERVICES` array in `App.tsx`

## Environment

The React app calls `https://robinwithrobin.app.n8n.cloud/webhook/ai-landing` directly from the browser.
For production, proxy through your own backend to keep the API key server-side.
