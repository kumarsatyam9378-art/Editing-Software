export default class BrushEngine {
  constructor() {
    this.strokes = [];
    this.activeStroke = null;
  }

  beginStroke(point, options = {}) {
    this.activeStroke = {
      id: crypto.randomUUID(),
      size: options.size || 8,
      color: options.color || '#ffffff',
      opacity: options.opacity ?? 1,
      points: [point],
      composite: options.composite || 'source-over'
    };
  }

  addPoint(point) {
    if (!this.activeStroke) return;
    const prev = this.activeStroke.points[this.activeStroke.points.length - 1];
    if (!prev || Math.hypot(prev.x - point.x, prev.y - point.y) > 1) {
      this.activeStroke.points.push(point);
    }
  }

  endStroke() {
    if (!this.activeStroke) return null;
    const stroke = this.activeStroke;
    this.strokes.push(stroke);
    this.activeStroke = null;
    return stroke;
  }

  drawStroke(ctx, stroke) {
    if (!stroke || stroke.points.length < 2) return;
    ctx.save();
    ctx.globalCompositeOperation = stroke.composite;
    ctx.globalAlpha = stroke.opacity;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = stroke.color;
    ctx.lineWidth = stroke.size;

    ctx.beginPath();
    ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
    for (let i = 1; i < stroke.points.length; i += 1) {
      const prev = stroke.points[i - 1];
      const curr = stroke.points[i];
      const midX = (prev.x + curr.x) / 2;
      const midY = (prev.y + curr.y) / 2;
      ctx.quadraticCurveTo(prev.x, prev.y, midX, midY);
    }
    ctx.stroke();
    ctx.restore();
  }

  render(ctx) {
    this.strokes.forEach((stroke) => this.drawStroke(ctx, stroke));
    if (this.activeStroke) this.drawStroke(ctx, this.activeStroke);
  }
}
