export default class RippleEngine {
  constructor(state) {
    this.state = state;
  }

  rippleFrom(frame, deltaFrames, { includeLocked = false } = {}) {
    this.state.tracks = this.state.tracks.map((track) => {
      if (track.locked && !includeLocked) return track;
      return {
        ...track,
        clips: track.clips.map((clip) => {
          if (clip.startFrame >= frame) {
            return {
              ...clip,
              startFrame: Math.max(0, clip.startFrame + deltaFrames),
              endFrame: Math.max(1, clip.endFrame + deltaFrames)
            };
          }
          return clip;
        })
      };
    });
  }
}
