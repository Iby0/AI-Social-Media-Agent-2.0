# Production Troubleshooting Guide

## Common Issues & Solutions

### 1. 404 on Page Refresh (SPA Routing)
- **Cause**: Web server attempting to look up a literal static directory for client routes (e.g., `/content`, `/analytics`).
- **Fix**: Verify that `vercel.json` (for Vercel) or `netlify.toml` (for Netlify) is present in the repository root. Both specify fallback rewrites to `/index.html`.

### 2. Build Failure: `tsc` or `vite` not found
- **Cause**: Missing node dependencies in build environment.
- **Fix**: Run `npm install` before running `npm run build`.

### 3. AI Generation Returning Heuristic Fallbacks
- **Cause**: `VITE_GEMINI_API_KEY` is not set or invalid in environment settings.
- **Fix**: Verify key in project settings or `.env` file. The app remains fully functional using local AI heuristics.

### 4. PWA Service Worker Cache Not Updating
- **Cause**: Browser holding onto previous service worker lifecycle.
- **Fix**: Click **Update Now** banner or force clear site cache in DevTools.
