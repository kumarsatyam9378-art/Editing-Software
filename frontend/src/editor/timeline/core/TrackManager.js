export default class TrackManager {
  constructor(state) {
    this.state = state;
  }

  addTrack(track) {
    this.state.tracks.push({ ...track, clips: track.clips || [], locked: !!track.locked, muted: !!track.muted });
  }

  lockTrack(trackId, locked = true) {
    this.state.tracks = this.state.tracks.map((track) => (track.id === trackId ? { ...track, locked } : track));
  }

  getTrack(trackId) {
    return this.state.tracks.find((track) => track.id === trackId) || null;
  }
}
