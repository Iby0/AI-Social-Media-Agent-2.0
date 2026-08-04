# Deployment Guide - AI Social Media Agent

## Vercel Deployment

1. **Connect Repository**: Import the repository into your Vercel Dashboard.
2. **Framework Preset**: Select **Vite** or **Other**.
3. **Build Command**: `npm run build`
4. **Output Directory**: `dist`
5. **Environment Variables**: Add `VITE_GEMINI_API_KEY` (optional) in Vercel Project Settings.
6. **Routing**: The repository includes `vercel.json` which automatically handles Single Page Application route rewrites.

## Netlify Deployment

1. **New Site from Git**: Select your GitHub repository.
2. **Build Command**: `npm run build`
3. **Publish Directory**: `dist`
4. **Environment Variables**: Set `VITE_GEMINI_API_KEY` under Site Settings > Build & Deploy > Environment.
5. **Routing**: The repository includes `netlify.toml` which sets up 200 rewrites for SPA routing.

## GitHub Pages Deployment

1. **Actions Enablement**: Ensure GitHub Actions are enabled in repository settings.
2. **CI Validation**: Pushing to `main` triggers `.github/workflows/ci.yml` which validates type-checking, linter, and build stability.
