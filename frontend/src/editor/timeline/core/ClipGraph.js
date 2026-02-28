import IntervalTree from './IntervalTree';

export default class ClipGraph {
  constructor(state) {
    this.state = state;
    this.intervalTree = new IntervalTree();
  }

  rebuild() {
    this.intervalTree.clear();
    this.state.tracks.forEach((track) => {
      track.clips.forEach((clip) => this.intervalTree.insert(clip));
    });
  }

  overlaps(startFrame, endFrame, ignoreId = null) {
    const overlaps = this.intervalTree.searchOverlapping({ startFrame, endFrame });
    return overlaps.filter((clip) => clip.id !== ignoreId);
  }

  getClip(clipId) {
    for (const track of this.state.tracks) {
      const clip = track.clips.find((item) => item.id === clipId);
      if (clip) return { track, clip };
    }
    return null;
  }
}
