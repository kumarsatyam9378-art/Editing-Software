# Hollywood Editor (CapCut + VFX inspired SaaS)

Production-ready full-stack starter for a professional image + video editor SaaS.

## Why your hosted site showed 404
If you deploy a React SPA without rewrite rules, deep routes (`/login`, `/editor`, `/pricing`) can show `404 NOT_FOUND` on Vercel.
This repo now includes `frontend/vercel.json` rewrite to always serve `index.html` for client-side routing.

## Stack
- Frontend: React + Vite + Zustand + FFmpeg.wasm + WebGL canvas
- Backend: Node.js + Express + MongoDB + JWT auth + Stripe subscription API
- Storage: S3-compatible upload URL endpoint (service abstraction)

## Features currently implemented
- Multi-layer timeline model (`video`, `audio`, `text`, `overlay`)
- Drag/drop clip movement across tracks
- Clip inspector (trim range, speed, split, delete)
- Text overlay insertion with animation metadata
- Filter, transition, crop metadata controls
- Undo / redo stack
- Playback controls and playhead
- FFmpeg trim + basic green-screen removal helper
- WebGL preview scaffold
- Autosave (project upsert endpoint)
- 4K export job API stub
- Modular editor engines (camera/matrix, timeline snap, layer manager, brush/shape/text, playback/frame cache)
- Async render queue API (`/api/renders`) for export pipeline simulation
- Login/signup with JWT
- Subscription plans API + Stripe checkout endpoint
- Dark professional responsive UI

## Project Structure

```
hollywood-editor/
├── frontend/
│   ├── src/components
│   ├── src/context
│   ├── src/hooks
│   ├── src/pages
│   ├── src/services
│   ├── src/styles
│   ├── src/utils
│   ├── src/webgl
│   └── vercel.json
└── backend/
    ├── src/config
    ├── src/controllers
    ├── src/middleware
    ├── src/models
    ├── src/routes
    ├── src/services
    └── src/utils
```

## Run

### Backend
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## Realistic roadmap (to reach true CapCut/Canva/Premiere parity)
A full parity product is a multi-year program. This template gives a strong base, then build phase-by-phase:
1. **Core editor engine**: transform matrix, hit-testing, keyframes, blend modes.
2. **Timeline engine**: snapping, ripple edits, grouped clips, nested sequences.
3. **Rendering/export**: background workers, frame cache, server render queue.
4. **Image/vector engine**: SVG parser, brush/eraser, typography controls.
5. **Performance**: OffscreenCanvas, workerized pipelines, virtualized timeline.
6. **Collaboration**: realtime comments, shared projects, audit trail.


## 100k LOC roadmap
Detailed plan in `ROADMAP_100K.md`.
