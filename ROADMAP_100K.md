# 100k LOC Program Roadmap (Professional Editing SaaS)

This repository now includes a stronger modular baseline, but true CapCut + Canva + pro VFX parity requires a long-term engineering program.

## Program scale
- Estimated production-grade codebase: **80k to 150k+ LOC**.
- Typical timeline: multi-year with dedicated team (frontend, media pipeline, graphics, backend, infra, QA).

## Delivered in this iteration
- Added editor engine modules for:
  - matrix/camera/command stack core
  - timeline + snap engine
  - layer manager + hit-test
  - image engines (brush/shape/text/export)
  - video engines (playback/transition/audio sync/frame cache)
- Added backend render queue simulation APIs for async export workflows.

## Next milestones
1. **Advanced Timeline Editing**
   - ripple, slip, slide, roll edits
   - grouped clips and linked A/V editing
   - nested sequences
2. **Keyframe Animation System**
   - bezier interpolation
   - per-property keyframes
   - graph editor UI
3. **Realtime Rendering Worker Pipeline**
   - OffscreenCanvas + Worker architecture
   - frame prefetch and cache invalidation
4. **Image + Vector Suite**
   - brush engine UI (pressure curve, stabilization)
   - SVG parse/edit pipeline
   - typography system with kerning and font fallback
5. **Collaboration + Cloud**
   - websocket presence
   - comments and review markers
   - project version history
6. **Export Farm**
   - queue workers on backend
   - distributed FFmpeg rendering
   - retry, resume, webhook notifications

## Quality principles
- Prefer meaningful modules over line-count inflation.
- Ship benchmarked features phase-wise.
- Keep architecture testable and observable.
