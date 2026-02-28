function scaleForPreset(preset) {
  if (preset === '4k') return 2;
  if (preset === '8k') return 4;
  return 1;
}

export async function exportCanvasImage(canvas, format = 'image/png', quality = 0.92, scale = 1) {
  const exportCanvas = document.createElement('canvas');
  exportCanvas.width = Math.max(1, Math.floor(canvas.width * scale));
  exportCanvas.height = Math.max(1, Math.floor(canvas.height * scale));

  const ctx = exportCanvas.getContext('2d');
  ctx.drawImage(canvas, 0, 0, exportCanvas.width, exportCanvas.height);

  return new Promise((resolve, reject) => {
    exportCanvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Failed to export image'));
        return;
      }
      resolve(blob);
    }, format, quality);
  });
}

export async function exportPreviewElement(previewElement, { preset = 'original', format = 'image/png', quality = 0.95 } = {}) {
  const canvas = document.createElement('canvas');
  canvas.width = previewElement.videoWidth || previewElement.naturalWidth || previewElement.width || 1280;
  canvas.height = previewElement.videoHeight || previewElement.naturalHeight || previewElement.height || 720;

  const ctx = canvas.getContext('2d');
  ctx.drawImage(previewElement, 0, 0, canvas.width, canvas.height);

  return exportCanvasImage(canvas, format, quality, scaleForPreset(preset));
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
