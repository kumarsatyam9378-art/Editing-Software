export default class SelectionManager {
  constructor() {
    this.selectedClipIds = new Set();
  }

  select(id, additive = false) {
    if (!additive) this.selectedClipIds.clear();
    this.selectedClipIds.add(id);
  }

  clear() {
    this.selectedClipIds.clear();
  }

  list() {
    return [...this.selectedClipIds];
  }
}
