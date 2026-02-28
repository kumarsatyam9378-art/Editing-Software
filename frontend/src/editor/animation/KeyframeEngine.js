import { solveBezierYForX } from './Bezier';

function sortFrames(frames = []) {
  return [...frames].sort((a, b) => a.time - b.time);
}

export default class KeyframeEngine {
  constructor() {
    this.tracks = new Map();
  }

  ensureTrack(layerId, property) {
    const key = `${layerId}:${property}`;
    if (!this.tracks.has(key)) this.tracks.set(key, []);
    return key;
  }

  addKeyframe(layerId, property, keyframe) {
    const key = this.ensureTrack(layerId, property);
    this.tracks.set(key, sortFrames([...this.tracks.get(key), keyframe]));
  }

  removeKeyframe(layerId, property, time) {
    const key = this.ensureTrack(layerId, property);
    this.tracks.set(key, this.tracks.get(key).filter((kf) => kf.time !== time));
  }

  getTrack(layerId, property) {
    return this.tracks.get(`${layerId}:${property}`) || [];
  }

  evaluate(layerId, property, time) {
    const frames = this.getTrack(layerId, property);
    if (frames.length === 0) return null;
    if (frames.length === 1) return frames[0].value;

    let left = frames[0];
    let right = frames[frames.length - 1];

    for (let i = 0; i < frames.length - 1; i += 1) {
      if (time >= frames[i].time && time <= frames[i + 1].time) {
        left = frames[i];
        right = frames[i + 1];
        break;
      }
    }

    if (time <= left.time) return left.value;
    if (time >= right.time) return right.value;

    const range = right.time - left.time;
    const x = (time - left.time) / range;
    const easing = left.easing || { x1: 0.25, y1: 0.1, x2: 0.25, y2: 1 };
    const curve = solveBezierYForX(x, easing.x1, easing.y1, easing.x2, easing.y2);
    return left.value + (right.value - left.value) * curve;
  }

  exportCurves(layerId) {
    const entries = [...this.tracks.entries()].filter(([key]) => key.startsWith(`${layerId}:`));
    return entries.map(([key, frames]) => ({
      property: key.split(':')[1],
      frames
    }));
  }
}
