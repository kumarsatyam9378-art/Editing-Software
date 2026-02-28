export function initRenderer(canvas) {
  const gl = canvas.getContext('webgl2');
  if (!gl) {
    throw new Error('WebGL2 not supported');
  }

  gl.clearColor(0.08, 0.08, 0.1, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);

  return {
    drawFrame() {
      gl.clear(gl.COLOR_BUFFER_BIT);
    }
  };
}
