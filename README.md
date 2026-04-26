# AI Note App

AI Note App is a React + Vite notes application with a small backend for AI-powered writing tools. It lets users create and edit notes, summarize or clean up note content with AI, generate titles and tags, and summarize YouTube videos into saved editable notes.

## Features

- Create, edit, search, pin, and delete notes
- Notes are saved in `localStorage`
- AI note tools:
  - summarize note
  - clean up note
  - auto-generate tags
  - generate title
- YouTube summary flow:
  - paste a YouTube link
  - fetch transcript
  - summarize it with AI
  - save the result automatically as a new note
- Mobile-friendly layout with collapsible sidebar
- Dark mode toggle
- Backend proxy keeps the API key off the frontend

## Tech Stack

- React 19
- Vite 8
- Tailwind CSS 4
- Lucide React
- Node.js HTTP server for local backend
- OpenRouter API for AI responses
- `youtube-transcript` for YouTube transcript fetching

## How It Works

The app has two main parts:

1. Frontend
   - Built with React and Vite
   - Sends requests to `/api/ai` and `/api/youtube`
   - Stores notes in browser `localStorage`

2. Backend
   - Local development uses `server.mjs`
   - The backend reads `OPENROUTER_API_KEY` from `.env`
   - The YouTube transcript flow can read `TRANSCRIPTAPI_API_KEY` for production transcript fetching
   - It forwards AI prompts to OpenRouter
   - It fetches YouTube transcripts and summarizes them

## Project Structure

```text
ai-note-app/
├─ api/
│  ├─ ai.js
│  ├─ health.js
│  └─ _lib/
│     └─ openrouter.js
├─ public/
├─ src/
│  ├─ components/
│  │  ├─ AIPanel.jsx
│  │  ├─ Navbar.jsx
│  │  ├─ NoteCard.jsx
│  │  ├─ NoteEditor.jsx
│  │  └─ Sidebar.jsx
│  ├─ context/
│  │  └─ NotesContext.jsx
│  ├─ assets/
│  ├─ App.jsx
│  ├─ index.css
│  └─ main.jsx
├─ .env.example
├─ dev.mjs
├─ server.mjs
├─ vercel.json
├─ vite.config.js
└─ package.json
```

## Requirements

- Node.js 18+ recommended
- npm
- OpenRouter API key

## Environment Variables

Create a `.env` file in the project root.

Example:

```env
OPENROUTER_API_KEY=your_openrouter_api_key_here
TRANSCRIPTAPI_API_KEY=your_transcriptapi_key_here
PORT=3001
```

Variables:

- `OPENROUTER_API_KEY`
  - required
  - used by the backend to call OpenRouter
- `TRANSCRIPTAPI_API_KEY`
  - optional locally, recommended for deployment
  - used to fetch YouTube transcripts through TranscriptAPI in production
- `PORT`
  - optional
  - default is `3001`

## Installation

```bash
npm install
```

## Running Locally

Start frontend and backend together:

```bash
npm run dev
```

This runs:

- frontend dev server through Vite
- backend server through `server.mjs`

Useful commands:

```bash
npm run dev
npm run dev:client
npm run dev:server
npm run build
npm run preview
npm run lint
```

What each script does:

- `npm run dev`
  - starts both backend and frontend
- `npm run dev:client`
  - starts Vite only
- `npm run dev:server`
  - starts the Node backend only
- `npm run build`
  - creates a production frontend build
- `npm run preview`
  - serves the built frontend and backend from `server.mjs`
- `npm run lint`
  - runs ESLint

## Important Startup Note

If you want to start the backend manually, use:

```bash
node server.mjs
```

Not:

```bash
node serve.mjs
```

`serve.mjs` does not exist in this project.

## Frontend Behavior

The frontend calls these local routes:

- `POST /api/ai`
- `POST /api/youtube`

The helper is in:

- [src/utils/aiHelper.js](/E:/React-project/ai-note-app/src/utils/aiHelper.js:1)

Notes are managed through:

- [src/context/NotesContext.jsx](/E:/React-project/ai-note-app/src/context/NotesContext.jsx:1)

## Backend Routes

Local backend routes from `server.mjs`:

- `GET /api/health`
  - basic health check
- `POST /api/ai`
  - accepts `{ prompt }`
  - sends note prompts to OpenRouter
- `POST /api/youtube`
  - accepts `{ url }`
  - extracts video ID
  - fetches transcript
  - summarizes transcript with OpenRouter

## YouTube Summary Flow

When a user pastes a YouTube link:

1. The frontend sends the URL to `/api/youtube`
2. The backend extracts the YouTube video ID
3. The backend fetches transcript text using `youtube-transcript`
4. The backend sends a summary prompt to OpenRouter
5. The frontend receives the summary
6. A new note is created automatically with:
   - title: `YouTube Summary`
   - source URL in the content
   - the generated summary
   - tags: `youtube`, `summary`

This new note becomes editable like any other note.

## Where Data Is Stored

- Notes are stored in browser `localStorage`
- Key used:

```text
ai-notes
```

This means:

- notes are local to the browser/device
- clearing browser storage removes saved notes
- there is no database yet

## AI Model

Current backend model:

```text
google/gemma-3-4b-it:free
```

Current provider:

```text
OpenRouter
```

These are defined in:

- [server.mjs](/E:/React-project/ai-note-app/server.mjs:13)
- [api/_lib/openrouter.js](/E:/React-project/ai-note-app/api/_lib/openrouter.js:1)

## Deployment

### Local Production Preview

```bash
npm run build
npm run preview
```

### Vercel

This repo includes:

- [vercel.json](/E:/React-project/ai-note-app/vercel.json:1)
- `api/` functions for deployment

Current Vercel API files:

- `api/ai.js`
- `api/health.js`
- `api/youtube.js`

Set this environment variable in Vercel:

- `OPENROUTER_API_KEY`
- `TRANSCRIPTAPI_API_KEY`

Deploy with:

```bash
vercel
```

Production deploy:

```bash
vercel --prod
```

## Troubleshooting

### 1. `500 Internal Server Error` from `aiHelper.js`

Usually this means the frontend request reached the backend, but the backend failed.

Check:

- backend is running
- `.env` exists
- `OPENROUTER_API_KEY` is valid
- if using deployed YouTube summaries, `TRANSCRIPTAPI_API_KEY` is set
- your machine can reach OpenRouter and YouTube

### 2. `Cannot find module ... serve.mjs`

Use:

```bash
node server.mjs
```

or:

```bash
npm run dev:server
```

### 3. `Missing OPENROUTER_API_KEY in .env`

Make sure the root `.env` file exists and contains:

```env
OPENROUTER_API_KEY=your_key_here
TRANSCRIPTAPI_API_KEY=your_transcript_api_key_here
```

Restart the backend after changing it.

### 4. YouTube summary fails

Possible reasons:

- invalid YouTube URL
- video has no transcript/captions
- `TRANSCRIPTAPI_API_KEY` is missing in deployment
- transcript source could not be reached
- OpenRouter request failed

### 5. Notes disappear

Notes are stored only in browser `localStorage`. Clearing browser data removes them.

## Security Notes

- API keys are kept on the backend and not exposed through Vite env variables
- Do not commit your real `.env`
- If a key was ever exposed during testing, rotate it

## Future Improvements

- Add database storage
- Add authentication
- Allow exporting notes
- Better note categories and folders
- Rich text editor
- Better AI model/provider switching

## License

This project currently has no explicit license file. Add one if you plan to publish or share it publicly.
