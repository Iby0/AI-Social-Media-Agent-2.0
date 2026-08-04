# Environment Variables Guide

## Configuration Overview

The application is engineered to operate seamlessly with zero mandatory environment variables. When external keys are present, cloud services are activated; otherwise, local intelligent fallbacks ensure uninterrupted performance.

### Environment Variable Reference

| Variable Name | Required | Default | Description |
|---|---|---|---|
| `VITE_GEMINI_API_KEY` | No | Empty | Google Gemini API key for cloud AI post generation and visual prompts. |
| `NODE_ENV` | No | `development` | Build runtime environment (`development` or `production`). |

### Safety & Security Rules

1. **Client-Side Safety**: Only variables prefixed with `VITE_` are exposed to client bundle scripts.
2. **Key Storage**: Never commit `.env` or API keys to git repositories. Always use `.env.example` for key declarations.
