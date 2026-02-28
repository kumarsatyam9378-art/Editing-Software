import { createLayer } from './layerTypes';

const BLEND_MODES = ['source-over', 'multiply', 'overlay', 'screen', 'soft-light', 'hard-light'];

export default class LayerManager {
  constructor() {
    this.layers = [];
  }

  addLayer(type, config) {
    const layer = createLayer(type, config);
    this.layers.push(layer);
    return layer;
  }

  removeLayer(id) {
    this.layers = this.layers.filter((layer) => layer.id !== id);
  }

  reorderLayer(id, newIndex) {
    const idx = this.layers.findIndex((layer) => layer.id === id);
    if (idx === -1) return;
    const [layer] = this.layers.splice(idx, 1);
    this.layers.splice(Math.max(0, Math.min(newIndex, this.layers.length)), 0, layer);
  }

  updateLayer(id, patch) {
    this.layers = this.layers.map((layer) => (layer.id === id ? { ...layer, ...patch } : layer));
  }

  setVisibility(id, visible) {
    this.updateLayer(id, { visible });
  }

  setOpacity(id, opacity) {
    this.updateLayer(id, { opacity: Math.max(0, Math.min(1, opacity)) });
  }

  setBlendMode(id, blendMode) {
    const safe = BLEND_MODES.includes(blendMode) ? blendMode : 'source-over';
    this.updateLayer(id, { blendMode: safe });
  }

  setMask(id, maskConfig) {
    this.updateLayer(id, { mask: maskConfig });
  }

  setClippingParent(id, parentLayerId) {
    this.updateLayer(id, { clippingParentId: parentLayerId });
  }

  getRenderableAt(timeSec) {
    return this.layers.filter((layer) => layer.visible && timeSec >= layer.startTime && timeSec <= layer.endTime);
  }
}
