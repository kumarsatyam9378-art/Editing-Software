const renderQueue = require('../services/renderQueueService');

async function createRenderJob(req, res) {
  const { projectId, profile = '4k-h264', fps = 30 } = req.body;
  const job = renderQueue.enqueue({
    userId: req.user.userId,
    projectId,
    profile,
    fps,
    resolution: profile.startsWith('4k') ? '3840x2160' : '1920x1080'
  });
  return res.status(202).json({ job });
}

async function getRenderJob(req, res) {
  const job = renderQueue.get(req.params.jobId);
  if (!job || job.userId !== req.user.userId) {
    return res.status(404).json({ message: 'Render job not found' });
  }
  return res.json({ job });
}

async function listRenderJobs(req, res) {
  const jobs = renderQueue.listByUser(req.user.userId);
  return res.json({ jobs });
}

module.exports = { createRenderJob, getRenderJob, listRenderJobs };
