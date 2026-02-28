export const LayerType = {
  IMAGE: 'image',
  VIDEO: 'video',
  AUDIO: 'audio',
  TEXT: 'text',
  SHAPE: 'shape'
};

export function createLayer(type, partial = {}) {
  return {
    id: crypto.randomUUID(),
    type,
    name: `${type}-${Date.now()}`,
    visible: true,
    opacity: 1,
    blendMode: 'source-over',
    transform: {
      x: 0,
      y: 0,
      scaleX: 1,
      scaleY: 1,
      rotation: 0,
      skewX: 0,
      skewY: 0
    },
    startTime: 0,
    endTime: 10,
    ...partial
  };
}
