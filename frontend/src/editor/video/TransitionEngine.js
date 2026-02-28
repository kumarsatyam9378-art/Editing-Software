export function transitionOpacity(type, localTime, duration) {
  if (!duration || duration <= 0) return 1;
  const t = Math.max(0, Math.min(1, localTime / duration));
  if (type === 'fade') return t;
  if (type === 'fade-out') return 1 - t;
  if (type === 'crossfade') return 0.5 - Math.cos(Math.PI * t) / 2;
  return 1;
}

export function resolveClipOpacity(clip, globalTime) {
  if (!clip.transition) return clip.opacity ?? 1;
  const localTime = Math.max(0, globalTime - clip.start);
  const value = transitionOpacity(clip.transition, localTime, Math.min(1, clip.end - clip.start));
  return (clip.opacity ?? 1) * value;
}
