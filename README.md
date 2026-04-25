# AI Note App

This app uses a Vite frontend plus a small backend for AI requests so the API key stays on the server instead of in the browser.

## Setup

1. Create `.env` from `.env.example`.
2. Put your OpenRouter key in `OPENROUTER_API_KEY`.
3. Make sure that key has access to the model you want to use.

## Run locally

```bash
npm run dev
```

That starts:
- the backend on `http://localhost:3001`
- the Vite frontend on its normal dev port

The frontend sends AI requests to `/api/ai`, and Vite proxies them to the backend.

## Production preview

```bash
npm run build
npm run preview
```

`npm run preview` serves the built frontend and the backend API from the same Node server.

## Deploy on Vercel

This repo is configured so Vercel can host both parts of the app:

- the frontend is built from Vite into `dist`
- the backend runs from the root `api` directory as Vercel Functions

Set this environment variable in your Vercel project:

- `OPENROUTER_API_KEY`

Then deploy with the Vercel dashboard or CLI:

```bash
vercel
```

For a production deploy:

```bash
vercel --prod
```
