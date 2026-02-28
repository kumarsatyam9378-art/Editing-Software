export default class AudioScrubEngine {
  constructor() {
    this.audio = null;
  }

  attach(audioElement) {
    this.audio = audioElement;
  }

  scrubTo(time) {
    if (!this.audio) return;
    this.audio.currentTime = Math.max(0, time);
    this.audio.play().then(() => setTimeout(() => this.audio.pause(), 90)).catch(() => {});
  }
}
