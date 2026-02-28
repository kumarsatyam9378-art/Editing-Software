export default class FrameCache {
  constructor(limit = 180) {
    this.limit = limit;
    this.cache = new Map();
  }

  get(key) {
    return this.cache.get(key) || null;
  }

  set(key, frame) {
    if (this.cache.size >= this.limit) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, frame);
  }

  clear() {
    this.cache.clear();
  }
}
