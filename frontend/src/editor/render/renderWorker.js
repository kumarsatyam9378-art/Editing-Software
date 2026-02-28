self.onmessage = async (event) => {
  if (event.data?.type !== 'render') return;
  const { frames = 120, batch = 24 } = event.data.payload || {};
  let done = 0;

  while (done < frames) {
    await new Promise((resolve) => setTimeout(resolve, 12));
    done += Math.min(batch, frames - done);
    self.postMessage({ type: 'progress', progress: Math.round((done / frames) * 100) });
  }

  self.postMessage({ type: 'completed', output: 'blob:mock-render-output' });
};
