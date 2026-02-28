const { EventEmitter } = require('events');
const queue = require('./QueueAdapter');
const pool = require('./WorkerPool');
const retryPolicy = require('./RetryPolicy');
const notifier = require('./WebhookNotifier');

class DistributedRenderFarm extends EventEmitter {
  constructor() {
    super();
    this.jobs = new Map();
    this.ticking = false;
  }

  enqueue(job) {
    const item = {
      id: `farm_${Date.now()}_${Math.random().toString(16).slice(2, 7)}`,
      status: 'queued',
      attempts: 0,
      progress: 0,
      createdAt: new Date().toISOString(),
      ...job
    };
    queue.push(item);
    this.jobs.set(item.id, item);
    this.emit('job', { type: 'queued', job: item });
    this.tick();
    return item;
  }

  tick() {
    if (this.ticking) return;
    this.ticking = true;

    const pump = () => {
      const next = queue.pop();
      if (!next) {
        this.ticking = false;
        return;
      }

      const started = pool.runJob(next.payload || { frames: 240 }, async (eventType, data) => {
        const current = this.jobs.get(next.id);
        if (!current) return;

        if (eventType === 'message' && data.type === 'progress') {
          current.status = 'rendering';
          current.progress = data.progress;
          this.jobs.set(next.id, current);
          this.emit('job', { type: 'progress', job: current });
        }

        if (eventType === 'message' && data.type === 'done') {
          current.status = 'completed';
          current.progress = 100;
          current.outputUrl = data.outputUrl;
          this.jobs.set(next.id, current);
          await notifier.notify(current.webhookUrl, { id: current.id, status: 'completed', outputUrl: current.outputUrl });
          this.emit('job', { type: 'completed', job: current });
        }

        if (eventType === 'error') {
          const retriable = retryPolicy.shouldRetry(current);
          if (retriable) {
            const retried = retryPolicy.next(current);
            this.jobs.set(next.id, retried);
            queue.push(retried);
            this.emit('job', { type: 'retry', job: retried });
          } else {
            current.status = 'failed';
            current.error = data.message;
            this.jobs.set(next.id, current);
            await notifier.notify(current.webhookUrl, { id: current.id, status: 'failed', error: current.error });
            this.emit('job', { type: 'failed', job: current });
          }
        }
      });

      if (!started) {
        queue.push(next);
      }

      setTimeout(pump, 30);
    };

    pump();
  }

  get(id) {
    return this.jobs.get(id) || null;
  }

  list() {
    return [...this.jobs.values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
}

module.exports = new DistributedRenderFarm();
