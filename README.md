# AI Social Media Agent

An enterprise-grade, offline-first AI Social Media Management application built with TypeScript, React 19, Tailwind CSS, Express, and IndexedDB. Powered server-side by Google Gemini `@google/genai` API.

---

## 🌟 Key Features

- **AI Content Studio**: Auto-generate platform-tailored captions, hashtags, tone variations, and AI image prompts.
- **Multi-Channel Management**: Official API integrations for Facebook Page, Instagram Business, LinkedIn, and GitHub.
- **Content Calendar & Scheduler**: Interactive drag-and-drop scheduling engine with auto-publishing background queue.
- **IndexedDB Persistence**: Offline-first client database with zero cost, high performance, and JSON snapshot export/import.
- **Analytics & Audience Insights**: Aggregate metrics, engagement rates, and channel performance breakdowns.
- **Audit Logs**: Detailed system operations and channel token lifecycle tracking.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Lucide React Icons, Tailwind CSS v4
- **Backend & API**: Express v4/v5 Node server, `@google/genai` Gemini SDK
- **Database**: Offline-First IndexedDB (`AISocialAgentDB`)
- **Build System**: Vite, `esbuild`, `tsx`
- **Deployment**: Compatible with Vercel & Cloud Run containers (Port 3000)

---

## 🚀 Quick Start

### 1. Installation
```bash
npm install
```

### 2. Environment Setup
Copy `.env.example` to `.env` and fill in your environment variables:
```bash
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3000
```

### 3. Local Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

### 4. Production Build
```bash
npm run build
npm start
```

---

## 📁 Directory Structure

```text
├── server.ts             # Express full-stack proxy & Gemini API routes
├── src/
│   ├── components/       # Modular React components
│   ├── data/             # Initial seed dataset
│   ├── lib/              # IndexedDB wrapper & API client
│   ├── types.ts          # Global TypeScript interfaces
│   ├── App.tsx           # Main workspace container
│   ├── main.tsx          # Application entrypoint
│   └── index.css         # Tailwind global styling
├── vercel.json           # Vercel deployment configuration
├── .vscode/              # Editor settings and extension recommendations
└── .env.example          # Environment variable template
```

---

## 📄 License
MIT
