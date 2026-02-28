# Hollywood Editor (CapCut + VFX inspired SaaS)

Production-ready full-stack starter for a professional image + video editor SaaS.

## Why 404 was happening on Vercel
If you deploy monorepo root without explicit frontend build/output config, Vercel can return `404 NOT_FOUND`.
This repo now includes:
- `vercel.json` at root (build frontend + output `frontend/dist`)
- SPA rewrite to `index.html`
- `frontend/vercel.json` for frontend-only deployments

## Stack
- Frontend: React + Vite + Zustand + FFmpeg.wasm + WebGL canvas + Worker render client
- Backend: Node.js + Express + MongoDB + JWT auth + Stripe + WebSocket collaboration
- Storage: S3-compatible upload URL endpoint (service abstraction)

## Features currently implemented
- Multi-layer timeline model (`video`, `audio`, `text`, `overlay`)
- Drag/drop clip movement across tracks
- Advanced timeline edit scaffolds (ripple/slip/slide/roll/link/nested sequence models)
- Keyframe animation foundation (per-property keyframes + bezier interpolation)
- Clip inspector (trim range, speed, split, delete)
- Text overlay insertion with animation metadata
- Filter, transition, crop metadata controls
- Undo / redo stack
- Playback controls and playhead
- FFmpeg trim + basic green-screen removal helper
- WebGL preview scaffold
- Worker-based render progress simulation (frontend)
- Autosave (project upsert endpoint)
- Async render queue API (`/api/renders`) using worker_threads
- Collaboration scaffolding: WebSocket presence + version history endpoints
- Vector scaffolding: SVG path parser + path editing + boolean op placeholders
- Guest-first flow (login/signup temporarily removed from UI)
- Backend JWT/auth endpoints retained for future secure mode
- Subscription plans API + Stripe checkout endpoint
- Border marketplace categories with scrollable panel
- CapCut-style video tools matrix panel
- High-resolution still export (PNG/JPG/WebP presets incl. 4K/8K scaling)
- Project archive service: schema stamping, asset hashing, backup/version restore endpoints
- Advanced collab gateway: cursor presence, layer lock, conflict events, live timeline sync
- Transition packs + marketplace preset packs (transitions/LUT/effects) importable via JSON module
- GPU preview renderer upgraded with WebGL2 program + framebuffer blit path
- RenderQueue emits websocket progress events for live export tracking
- Backend video render engine scaffold (`videoRenderEngine`) with timeline composition plan + audio mixdown plan
- Industrial timeline core modules added: frame-accurate state, interval tree, clip graph, snap/ripple engines, marker manager, history stack, serializer
- Frame-based timeline operations in editor (playhead frame display, marker add, split at playhead)
- Dark professional responsive UI

## Project Structure

```
hollywood-editor/
├── vercel.json
├── frontend/
│   ├── src/components
│   ├── src/context
│   ├── src/editor
│   │   ├── animation
│   │   ├── core
│   │   ├── image
│   │   ├── layers
│   │   ├── render
│   │   ├── timeline
│   │   └── vector
│   ├── src/hooks
│   ├── src/pages
│   ├── src/services
│   ├── src/styles
│   ├── src/utils
│   ├── src/webgl
│   └── vercel.json
└── backend/
    ├── src/collab
    ├── src/config
    ├── src/controllers
    ├── src/middleware
    ├── src/models
    ├── src/routes
    ├── src/services
    ├── src/utils
    └── src/ws
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

## 100k LOC roadmap
Detailed long-term plan in `ROADMAP_100K.md`.


## Scope guard
Monetization and AI generation are intentionally excluded in this iteration, per request.
