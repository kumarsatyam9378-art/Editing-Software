import { useEffect, useRef } from 'react';
import { initRenderer } from '../webgl/renderer';

export default function CanvasPreview() {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) {
      return undefined;
    }

    const renderer = initRenderer(canvasRef.current);
    renderer.drawFrame();
    return () => {};
  }, []);

  return <canvas ref={canvasRef} className="preview-canvas" width="1280" height="720" />;
}
