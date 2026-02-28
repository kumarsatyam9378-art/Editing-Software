export default class RenderWorkerClient {
  constructor() {
    this.worker = null;
    this.listeners = new Set();
  }

  init() {
    if (this.worker || typeof Worker === 'undefined') return;
    this.worker = new Worker(new URL('./renderWorker.js', import.meta.url), { type: 'module' });
    this.worker.onmessage = (event) => {
      this.listeners.forEach((listener) => listener(event.data));
    };
  }

  onEvent(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  renderFrames(payload) {
    this.init();
    this.worker?.postMessage({ type: 'render', payload });
  }

  dispose() {
    if (this.worker) this.worker.terminate();
    this.worker = null;
  }
}
