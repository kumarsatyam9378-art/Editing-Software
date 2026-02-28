export function buildCurvePoints(frames, sampleCount = 40) {
  if (!frames || frames.length < 2) return [];
  const points = [];
  const first = frames[0].time;
  const last = frames[frames.length - 1].time;
  const duration = Math.max(0.001, last - first);

  for (let i = 0; i <= sampleCount; i += 1) {
    const t = i / sampleCount;
    points.push({ x: first + duration * t, t });
  }
  return points;
}
