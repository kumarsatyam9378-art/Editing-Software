export function createTimelineState({ fps = 30, durationFrames = 30 * 60 } = {}) {
  return {
    fps,
    durationFrames,
    zoom: 1,
    playheadFrame: 0,
    tracks: [],
    markers: []
  };
}

export function secondsToFrames(seconds, fps) {
  return Math.max(0, Math.round(seconds * fps));
}

export function framesToSeconds(frames, fps) {
  return frames / fps;
}
