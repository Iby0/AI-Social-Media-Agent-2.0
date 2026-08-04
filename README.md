# AI Social Media Agent & Autonomous Content Scheduler

An offline-first, browser-native AI social media management platform built with React, Vite, Tailwind CSS, TypeScript, and Dexie.js (IndexedDB).

## Architecture Overview

- **Core Engine**: React 18 + TypeScript + Vite + Tailwind CSS
- **Local Persistence Engine**: Dexie.js (IndexedDB) with multi-store schema (`posts`, `channels`, `templates`, `analytics`, `activityLogs`, `backupSettings`, `workflows`, `plugins`)
- **AI Intelligence**: Dual Mode — Server/Client Gemini Pro integration with local heuristic AI fallback when offline or unconfigured
- **Image Generation Engine**: AI visual composer supporting custom prompt presets and local asset caching
- **System Architecture**: PWA Service Worker offline caching, Global Error Boundary, System Provider, and local telemetry logging
- **Zero External Server Overhead**: Entirely client-side or serverless ready; 100% free-tier deployment compatible with GitHub Pages, Vercel, and Netlify.

---

## Quick Start & Installation

```bash
# Clone repository
git clone https://github.com/user/ai-social-agent.git

# Navigate to project directory
cd ai-social-agent

# Install dependencies
npm install

# Start local development server
npm run dev
```

---

## Environment Setup

Create `.env` file or set platform environment variables:

```env
# Optional Gemini API key for real-time generative capabilities
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

*Note: If no API key is provided, the application automatically defaults to local intelligent heuristic engines.*

---

## Production Deployment Guide

### Vercel Deployment
1. Import repository into Vercel.
2. Build command: `npm run build`
3. Output directory: `dist`
4. The included `vercel.json` automatically handles single-page app redirects.

### Netlify Deployment
1. Import repository into Netlify.
2. Publish directory: `dist`
3. Build command: `npm run build`
4. The included `netlify.toml` handles routing and headers.

### GitHub Pages Deployment
1. Push code to `main` branch.
2. The included `.github/workflows/ci.yml` runs typechecking, linting, and builds production bundles automatically.

---

## Troubleshooting Guide

| Issue | Root Cause | Resolution |
|---|---|---|
| Offline Banner Shown | Browser network connection lost | Content is safely saved to IndexedDB local storage. Re-connect to sync external AI APIs. |
| AI Generation Unavailable | Missing `GEMINI_API_KEY` | System automatically operates in local intelligent fallback mode. Add key to `.env` if cloud generation is desired. |
| Storage Quotas Exceeded | IndexedDB storage full | Use **Settings -> Backup & Export** to clean old logs or export data backups. |
| Service Worker Not Updating | Stale service worker cache | Click **Update Now** in the top/bottom notification prompt or clear site data. |

---

## License

MIT License - Open Source & Free Deployment Ready.
