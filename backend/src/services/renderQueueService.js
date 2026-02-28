const { EventEmitter } = require('events');
const videoRenderEngine = require('./videoRenderEngine');

class RenderQueueService extends EventEmitter {
  constructor() {
    super();
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

    const compositionPlan = videoRenderEngine.composeTimeline(job.timeline || { tracks: [] });
    const audioMixdownPlan = videoRenderEngine.getAudioMixdownPlan(job.timeline || { tracks: [] });

    this.jobs.set(id, item);
    this.emit('job', { type: 'queued', job: item });

    videoRenderEngine.spawnRenderWorker(
      {
        frames: job.frames || 240,
        compositionPlan,
        audioMixdownPlan,
        profile: job.profile,
        resolution: job.resolution,
        bitrate: job.bitrate
      },
      {
        onMessage: (message) => {
          const current = this.jobs.get(id);
          if (!current) return;

          if (message.type === 'progress') {
            current.status = 'rendering';
            current.progress = message.progress;
            current.updatedAt = new Date().toISOString();
            this.jobs.set(id, current);
            this.emit('job', { type: 'progress', job: current });
          }

          if (message.type === 'done') {
            current.status = 'completed';
            current.progress = 100;
            current.outputUrl = message.outputUrl;
            current.updatedAt = new Date().toISOString();
            this.jobs.set(id, current);
            this.emit('job', { type: 'completed', job: current });
          }
        },
        onError: (error) => {
          const current = this.jobs.get(id);
          if (!current) return;
          current.status = 'failed';
          current.error = error.message;
          current.updatedAt = new Date().toISOString();
          this.jobs.set(id, current);
          this.emit('job', { type: 'failed', job: current });
        }
      }
    );

    return item;
  }

  get(id) {
    return this.jobs.get(id) || null;
  }

  listByUser(userId) {
    return [...this.jobs.values()]
      .filter((job) => job.userId === userId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
}

module.exports = new RenderQueueService();
