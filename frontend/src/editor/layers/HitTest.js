export function hitTestLayer(layer, worldPoint) {
  if (!layer.bounds) return false;
  const { x, y, width, height } = layer.bounds;
  return worldPoint.x >= x && worldPoint.x <= x + width && worldPoint.y >= y && worldPoint.y <= y + height;
}

export function findTopLayerAt(layers, worldPoint) {
  for (let i = layers.length - 1; i >= 0; i -= 1) {
    if (hitTestLayer(layers[i], worldPoint)) return layers[i];
  }
  return null;
}
