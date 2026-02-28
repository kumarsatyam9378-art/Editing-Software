export default class Serializer {
  save(state) {
    return JSON.stringify({
      version: '2.0.0',
      fps: state.fps,
      durationFrames: state.durationFrames,
      zoom: state.zoom,
      playheadFrame: state.playheadFrame,
      tracks: state.tracks,
      markers: state.markers
    });
  }

  load(raw) {
    const parsed = JSON.parse(raw);
    if (!parsed.version) {
      throw new Error('Invalid timeline schema');
    }
    return parsed;
  }
}
