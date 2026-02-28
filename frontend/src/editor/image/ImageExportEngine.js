export async function exportCanvasImage(canvas, format = 'image/png', quality = 0.92) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Failed to export image'));
        return;
      }
      resolve(blob);
    }, format, quality);
  });
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
