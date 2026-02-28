# Hollywood Editor (CapCut + VFX inspired SaaS)

Production-ready full-stack starter for a professional video editor SaaS.

## Stack
- Frontend: React + Vite + Zustand + FFmpeg.wasm + WebGL canvas
- Backend: Node.js + Express + MongoDB + JWT auth + Stripe subscription API
- Storage: S3-compatible upload URL endpoint (service abstraction)

## Features Included in Template
- Multi-layer timeline model (video/audio/text tracks)
- Drag/drop-like upload flow into media library
- Playback controls + playhead state
- Trim function using FFmpeg.wasm
- Basic green-screen utility hook (chroma key via FFmpeg)
- WebGL preview scaffold
- Cloud save project API
- Login/signup with JWT
- Subscription checkout endpoint (Stripe)
- Plan model: Free / Pro / Studio
- Dark professional UI and responsive layout

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
│   └── src/webgl
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

## Notes
This is a scalable foundation with core editor features wired. Advanced AAA VFX, AI tools, collaborative OT/CRDT editing, and full asset pipelines should be added as modular services in next phases.
