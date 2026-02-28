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
    setTimeout(() => this.simulateProgress(id), 250);
    return item;
  }

  simulateProgress(id) {
    const job = this.jobs.get(id);
    if (!job) return;
    if (job.progress >= 100) {
      job.status = 'completed';
      job.outputUrl = `https://example-cdn.local/exports/${id}.mp4`;
      job.updatedAt = new Date().toISOString();
      this.jobs.set(id, job);
      return;
    }

    job.status = 'rendering';
    job.progress = Math.min(100, job.progress + 20);
    job.updatedAt = new Date().toISOString();
    this.jobs.set(id, job);
    setTimeout(() => this.simulateProgress(id), 300);
  }

  get(id) {
    return this.jobs.get(id) || null;
  }

  listByUser(userId) {
    return [...this.jobs.values()].filter((job) => job.userId === userId).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
}

module.exports = new RenderQueueService();
