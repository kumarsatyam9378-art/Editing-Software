const { parentPort, workerData } = require('worker_threads');

function simulateHeavyRender({ frames = 240 }) {
  let rendered = 0;
  const step = () => {
    rendered += 24;
    const progress = Math.min(100, Math.round((rendered / frames) * 100));
    parentPort.postMessage({ type: 'progress', progress });

    if (rendered >= frames) {
      parentPort.postMessage({ type: 'done', outputUrl: `https://example-cdn.local/render/${Date.now()}.mp4` });
      return;
    }

    setTimeout(step, 30);
  };

  step();
}

simulateHeavyRender(workerData || {});
