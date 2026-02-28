export default class ShapeEngine {
  constructor() {
    this.shapes = [];
  }

  addRect(x, y, width, height, style = {}) {
    this.shapes.push({ id: crypto.randomUUID(), type: 'rect', x, y, width, height, style });
  }

  addEllipse(x, y, rx, ry, style = {}) {
    this.shapes.push({ id: crypto.randomUUID(), type: 'ellipse', x, y, rx, ry, style });
  }

  render(ctx) {
    this.shapes.forEach((shape) => {
      ctx.save();
      ctx.fillStyle = shape.style.fill || 'transparent';
      ctx.strokeStyle = shape.style.stroke || '#fff';
      ctx.lineWidth = shape.style.lineWidth || 2;
      if (shape.type === 'rect') {
        if (shape.style.fill) ctx.fillRect(shape.x, shape.y, shape.width, shape.height);
        ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
      }
      if (shape.type === 'ellipse') {
        ctx.beginPath();
        ctx.ellipse(shape.x, shape.y, shape.rx, shape.ry, 0, 0, Math.PI * 2);
        if (shape.style.fill) ctx.fill();
        ctx.stroke();
      }
      ctx.restore();
    });
  }
}
