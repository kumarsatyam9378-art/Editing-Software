import Matrix2D from './Matrix2D';

export default class Camera2D {
  constructor() {
    this.zoom = 1;
    this.panX = 0;
    this.panY = 0;
    this.viewportWidth = 1;
    this.viewportHeight = 1;
    this.minZoom = 0.1;
    this.maxZoom = 8;
  }

  setViewport(width, height) {
    this.viewportWidth = width;
    this.viewportHeight = height;
  }

  setZoom(zoom, anchor = { x: this.viewportWidth / 2, y: this.viewportHeight / 2 }) {
    const prev = this.zoom;
    this.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, zoom));
    const factor = this.zoom / prev;
    this.panX = anchor.x - (anchor.x - this.panX) * factor;
    this.panY = anchor.y - (anchor.y - this.panY) * factor;
  }

  pan(dx, dy) {
    this.panX += dx;
    this.panY += dy;
  }

  getViewMatrix() {
    return Matrix2D.translation(this.panX, this.panY).multiply(Matrix2D.scale(this.zoom));
  }

  screenToWorld(point) {
    return this.getViewMatrix().inverse().apply(point);
  }

  worldToScreen(point) {
    return this.getViewMatrix().apply(point);
  }
}
