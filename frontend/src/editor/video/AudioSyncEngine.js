export default class AudioSyncEngine {
  constructor() {
    this.audioElements = new Map();
  }

  registerClip(clipId, audio) {
    this.audioElements.set(clipId, audio);
  }

  unregisterClip(clipId) {
    this.audioElements.delete(clipId);
  }

  sync(globalTime, activeClipIds = []) {
    this.audioElements.forEach((audio, clipId) => {
      if (!activeClipIds.includes(clipId)) {
        audio.pause();
        return;
      }

      const drift = Math.abs(audio.currentTime - globalTime);
      if (drift > 0.08) {
        audio.currentTime = globalTime;
      }
      if (audio.paused) {
        audio.play().catch(() => {});
      }
    });
  }
}
