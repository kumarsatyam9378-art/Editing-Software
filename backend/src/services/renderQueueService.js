const path = require('path');
const { Worker } = require('worker_threads');

class RenderQueueService {
  constructor() {
    this.jobs = new Map();
  }

  enqueue(job) {
    const id = `render_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`;
    const item = {
      id,
      status: 'queued',
      progress: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...job
    };
    this.jobs.set(id, item);
    this.startWorker(id, { frames: job.frames || 240 });
    return item;
  }

  startWorker(jobId, payload) {
    const workerPath = path.resolve(__dirname, '../collab/workers/renderWorker.js');
    const worker = new Worker(workerPath, { workerData: payload });

    worker.on('message', (message) => {
      const job = this.jobs.get(jobId);
      if (!job) return;

      if (message.type === 'progress') {
        job.status = 'rendering';
        job.progress = message.progress;
      }

      if (message.type === 'done') {
        job.status = 'completed';
        job.progress = 100;
        job.outputUrl = message.outputUrl;
      }

      job.updatedAt = new Date().toISOString();
      this.jobs.set(jobId, job);
    });

    worker.on('error', (error) => {
      const job = this.jobs.get(jobId);
      if (!job) return;
      job.status = 'failed';
      job.error = error.message;
      job.updatedAt = new Date().toISOString();
      this.jobs.set(jobId, job);
    });
  }

  get(id) {
    return this.jobs.get(id) || null;
  }

  listByUser(userId) {
    return [...this.jobs.values()].filter((job) => job.userId === userId).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
}

module.exports = new RenderQueueService();
