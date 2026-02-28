const { Worker } = require('worker_threads');
const path = require('path');

class WorkerPool {
  constructor(size = 2) {
    this.size = size;
    this.active = 0;
  }

  runJob(payload, onEvent) {
    if (this.active >= this.size) return false;
    this.active += 1;

    const worker = new Worker(path.resolve(__dirname, '../../collab/workers/renderWorker.js'), { workerData: payload });
    worker.on('message', (msg) => onEvent('message', msg));
    worker.on('error', (err) => onEvent('error', err));
    worker.on('exit', () => {
      this.active = Math.max(0, this.active - 1);
      onEvent('exit', null);
    });

    return true;
  }
}

module.exports = new WorkerPool(3);
