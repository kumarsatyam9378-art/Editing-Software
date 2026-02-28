export default class PlaybackEngine {
  constructor({ fps = 30, duration = 120 } = {}) {
    this.fps = fps;
    this.duration = duration;
    this.currentTime = 0;
    this.playing = false;
    this.raf = null;
    this.listeners = new Set();
  }

  onTick(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  emit() {
    this.listeners.forEach((listener) => listener(this.currentTime, this.getCurrentFrame()));
  }

  getCurrentFrame() {
    return Math.floor(this.currentTime * this.fps);
  }

  seek(time) {
    this.currentTime = Math.max(0, Math.min(this.duration, time));
    this.emit();
  }

  play() {
    if (this.playing) return;
    this.playing = true;
    let last = performance.now();
    const loop = (now) => {
      if (!this.playing) return;
      const delta = (now - last) / 1000;
      last = now;
      this.currentTime = Math.min(this.duration, this.currentTime + delta);
      this.emit();
      if (this.currentTime >= this.duration) {
        this.pause();
        return;
      }
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
