function cubicBezierInterpolate(t, p1, p2) {
  const u = 1 - t;
  return 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t;
}

export const transitionPacks = {
  capcutCore: ['fade', 'slide-left', 'slide-right', 'zoom-in', 'zoom-out', 'cross-dissolve'],
  cinematic: ['directional-blur', 'motion-blur-fade', 'mask-reveal', 'luma-wipe'],
  dynamic3D: ['cube-3d', 'parallax-push', 'flip-3d']
};

export function transitionOpacity(type, localTime, duration, bezier = [0.25, 0.1, 0.25, 1]) {
  if (!duration || duration <= 0) return 1;
  const t = Math.max(0, Math.min(1, localTime / duration));
  const eased = cubicBezierInterpolate(t, bezier[1], bezier[3]);

  if (type === 'fade') return eased;
  if (type === 'fade-out') return 1 - eased;
  if (type === 'crossfade') return 0.5 - Math.cos(Math.PI * eased) / 2;
  if (type === 'motion-blur-fade') return eased;
  return 1;
}

export function resolveClipOpacity(clip, globalTime) {
  if (!clip.transition) return clip.opacity ?? 1;
  const localTime = Math.max(0, globalTime - clip.start);
  const bezier = clip.transitionBezier || [0.25, 0.1, 0.25, 1];
  const value = transitionOpacity(clip.transition, localTime, Math.min(1, clip.end - clip.start), bezier);
  return (clip.opacity ?? 1) * value;
}

export function getMaskTransitionProgress(type, localTime, duration) {
  if (type !== 'mask-reveal') return 0;
  const t = Math.max(0, Math.min(1, localTime / Math.max(duration, 0.001)));
  return t;
}

export function directionalBlurAmount(type, localTime, duration) {
  if (type !== 'directional-blur') return 0;
  const t = Math.max(0, Math.min(1, localTime / Math.max(duration, 0.001)));
  return (1 - Math.abs(0.5 - t) * 2) * 0.8;
}
