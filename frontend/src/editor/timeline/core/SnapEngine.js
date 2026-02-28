export default class SnapEngine {
  constructor(state) {
    this.state = state;
    this.thresholdFrames = 6;
  }

  collectSnapPoints() {
    const points = new Set([0, this.state.playheadFrame]);
    this.state.markers.forEach((marker) => points.add(marker.frame));
    this.state.tracks.forEach((track) => {
      track.clips.forEach((clip) => {
        points.add(clip.startFrame);
        points.add(clip.endFrame);
      });
    });
    return [...points].sort((a, b) => a - b);
  }

  getSnapOffset(targetFrame) {
    let bestOffset = 0;
    let bestDistance = this.thresholdFrames + 1;
    this.collectSnapPoints().forEach((point) => {
      const distance = Math.abs(point - targetFrame);
      if (distance <= this.thresholdFrames && distance < bestDistance) {
        bestDistance = distance;
        bestOffset = point - targetFrame;
      }
    });
    return bestOffset;
  }
}
