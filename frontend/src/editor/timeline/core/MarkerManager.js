export default class MarkerManager {
  constructor(state) {
    this.state = state;
  }

  add(frame, label = 'Marker') {
    this.state.markers.push({ id: crypto.randomUUID(), frame, label });
  }

  remove(id) {
    this.state.markers = this.state.markers.filter((m) => m.id !== id);
  }

  list() {
    return this.state.markers;
  }
}
