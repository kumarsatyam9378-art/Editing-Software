import SnapEngine from './SnapEngine';

export default class TimelineEngine {
  constructor() {
    this.tracks = [];
    this.snapEngine = new SnapEngine();
  }

  setTracks(tracks) {
    this.tracks = tracks;
  }

  getAllClips() {
    return this.tracks.flatMap((track) => track.clips || []);
  }

  trimClip(clip, start, end) {
    const minDuration = 0.1;
    const nextStart = this.snapEngine.snapTime(start, this.getAllClips());
    const nextEnd = this.snapEngine.snapTime(end, this.getAllClips());
    if (nextEnd - nextStart < minDuration) {
      return { ...clip };
    }
    return { ...clip, start: nextStart, end: nextEnd };
  }

  splitClip(clip, at) {
    if (at <= clip.start || at >= clip.end) {
      return [clip];
    }
    const t = this.snapEngine.snapTime(at, this.getAllClips());
    return [
      { ...clip, id: crypto.randomUUID(), end: t },
      { ...clip, id: crypto.randomUUID(), start: t }
    ];
  }

  getVisibleClips(timeSec) {
    return this.getAllClips().filter((clip) => timeSec >= clip.start && timeSec <= clip.end);
  }
}
