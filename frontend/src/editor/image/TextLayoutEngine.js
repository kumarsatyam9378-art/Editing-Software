export default class TextLayoutEngine {
  constructor() {
    this.items = [];
  }

  addText(config) {
    const item = {
      id: crypto.randomUUID(),
      text: config.text || 'Text',
      x: config.x || 100,
      y: config.y || 100,
      fontSize: config.fontSize || 48,
      fontFamily: config.fontFamily || 'Inter, sans-serif',
      fontWeight: config.fontWeight || 600,
      color: config.color || '#ffffff',
      letterSpacing: config.letterSpacing || 0,
      lineHeight: config.lineHeight || 1.2,
      maxWidth: config.maxWidth || 800,
      animation: config.animation || 'none'
    };
    this.items.push(item);
    return item;
  }

  measureTextLines(ctx, text, maxWidth) {
    const words = text.split(' ');
    const lines = [];
    let line = '';
    words.forEach((word) => {
      const probe = line ? `${line} ${word}` : word;
      if (ctx.measureText(probe).width > maxWidth && line) {
        lines.push(line);
        line = word;
      } else {
        line = probe;
      }
    });
    if (line) lines.push(line);
    return lines;
  }

  render(ctx, timeSec = 0) {
    this.items.forEach((item) => {
      ctx.save();
      const offsetY = item.animation === 'slide-up' ? Math.max(0, 24 - timeSec * 32) : 0;
      ctx.font = `${item.fontWeight} ${item.fontSize}px ${item.fontFamily}`;
      ctx.fillStyle = item.color;
      const lines = this.measureTextLines(ctx, item.text, item.maxWidth);
      lines.forEach((line, i) => {
        ctx.fillText(line, item.x, item.y + i * item.fontSize * item.lineHeight + offsetY);
      });
      ctx.restore();
    });
  }
}
