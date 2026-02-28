export default class PlaybackController {
  constructor(state) {
    this.state = state;
    this.playing = false;
    this.last = 0;
    this.raf = null;
    this.listeners = new Set();
  }

  onFrame(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  emit() {
    this.listeners.forEach((listener) => listener(this.state.playheadFrame));
  }

  play() {
    if (this.playing) return;
    this.playing = true;
    this.last = performance.now();
    const loop = (now) => {
      if (!this.playing) return;
      const dt = (now - this.last) / 1000;
      this.last = now;
      this.state.playheadFrame = Math.min(
        this.state.durationFrames,
        this.state.playheadFrame + Math.round(dt * this.state.fps)
      );
      this.emit();
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  }

  pause() {
    this.playing = false;
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = null;
  }
}
