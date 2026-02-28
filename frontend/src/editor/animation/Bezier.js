export function cubicBezier(p0, p1, p2, p3, t) {
  const u = 1 - t;
  return (u ** 3) * p0 + 3 * (u ** 2) * t * p1 + 3 * u * (t ** 2) * p2 + (t ** 3) * p3;
}

export function solveBezierYForX(x, x1, y1, x2, y2, iterations = 8) {
  let t = x;
  for (let i = 0; i < iterations; i += 1) {
    const xEst = cubicBezier(0, x1, x2, 1, t);
    const dx = xEst - x;
    if (Math.abs(dx) < 1e-5) break;
    const slope = 3 * (1 - t) ** 2 * x1 + 6 * (1 - t) * t * (x2 - x1) + 3 * t ** 2 * (1 - x2);
    if (Math.abs(slope) < 1e-6) break;
    t -= dx / slope;
    t = Math.max(0, Math.min(1, t));
  }
  return cubicBezier(0, y1, y2, 1, t);
}
