export function applyFadeEnvelope(samples, sampleRate, durationSec, fadeInSec = 0, fadeOutSec = 0) {
  const out = new Float32Array(samples.length);
  const total = Math.floor(durationSec * sampleRate);
  const fadeIn = Math.floor(fadeInSec * sampleRate);
  const fadeOut = Math.floor(fadeOutSec * sampleRate);

  for (let i = 0; i < samples.length; i += 1) {
    let gain = 1;
    if (fadeIn > 0 && i < fadeIn) gain = i / fadeIn;
    if (fadeOut > 0 && i > total - fadeOut) gain = Math.min(gain, (total - i) / fadeOut);
    out[i] = samples[i] * Math.max(0, gain);
  }

  return out;
}

export function applySimpleEQ(samples, lowGain = 1, midGain = 1, highGain = 1) {
  const out = new Float32Array(samples.length);
  for (let i = 0; i < samples.length; i += 1) {
    const weighted = samples[i] * (0.3 * lowGain + 0.4 * midGain + 0.3 * highGain);
    out[i] = Math.max(-1, Math.min(1, weighted));
  }
  return out;
}
