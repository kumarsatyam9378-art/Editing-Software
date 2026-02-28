export default class CacheSystem {
  constructor() {
    this.map = new Map();
  }

  key(nodeId, frame) {
    return `${nodeId}:${frame}`;
  }

  get(nodeId, frame) {
    return this.map.get(this.key(nodeId, frame));
  }

  set(nodeId, frame, value) {
    this.map.set(this.key(nodeId, frame), value);
  }

  clear() {
    this.map.clear();
  }
}
