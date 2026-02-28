import { applyFadeEnvelope, applySimpleEQ } from './AudioEffectsEngine';

export default class AudioMixerEngine {
  constructor(sampleRate = 48000) {
    this.sampleRate = sampleRate;
  }

  applyVolumeKeyframes(samples, keyframes = []) {
    if (!keyframes.length) return samples;
    const out = new Float32Array(samples.length);

    for (let i = 0; i < samples.length; i += 1) {
      const time = i / this.sampleRate;
      let gain = keyframes[0].value;
      for (let k = 0; k < keyframes.length - 1; k += 1) {
        const a = keyframes[k];
        const b = keyframes[k + 1];
        if (time >= a.time && time <= b.time) {
          const t = (time - a.time) / Math.max(0.0001, b.time - a.time);
          gain = a.value + (b.value - a.value) * t;
          break;
        }
      }
      out[i] = samples[i] * gain;
    }

    return out;
  }

  mixTrack(samples, options = {}) {
    const faded = applyFadeEnvelope(samples, this.sampleRate, options.durationSec || (samples.length / this.sampleRate), options.fadeInSec || 0, options.fadeOutSec || 0);
    const eq = applySimpleEQ(faded, options.lowGain || 1, options.midGain || 1, options.highGain || 1);
    return this.applyVolumeKeyframes(eq, options.volumeKeyframes || []);
  }

  mixdown(tracks = []) {
    const length = Math.max(...tracks.map((t) => t.samples.length), 1);
    const out = new Float32Array(length);

    tracks.forEach((track) => {
      const processed = this.mixTrack(track.samples, track.options || {});
      for (let i = 0; i < processed.length; i += 1) {
        out[i] += processed[i];
      }
    });

    for (let i = 0; i < out.length; i += 1) {
      out[i] = Math.max(-1, Math.min(1, out[i]));
    }

    return out;
  }
}
