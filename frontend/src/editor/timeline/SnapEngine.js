export default class SnapEngine {
  constructor(threshold = 0.12) {
    this.threshold = threshold;
  }

  getSnapPoints(clips = []) {
    const points = new Set([0]);
    clips.forEach((clip) => {
      points.add(clip.start);
      points.add(clip.end);
    });
    return [...points].sort((a, b) => a - b);
  }

  snapTime(time, clips = []) {
    const points = this.getSnapPoints(clips);
    let best = time;
    let bestDist = this.threshold;
    points.forEach((point) => {
      const dist = Math.abs(point - time);
      if (dist <= bestDist) {
        best = point;
        bestDist = dist;
      }
    });
    return best;
  }
}
