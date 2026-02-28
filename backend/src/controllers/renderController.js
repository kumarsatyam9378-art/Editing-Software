const renderQueue = require('../services/renderQueueService');

const exportProfiles = [
  { id: 'youtube-4k', label: 'YouTube 4K', resolution: '3840x2160', bitrate: '35M', fps: 30 },
  { id: 'instagram-reel', label: 'Instagram Reel', resolution: '1080x1920', bitrate: '12M', fps: 30 },
  { id: 'tiktok', label: 'TikTok', resolution: '1080x1920', bitrate: '10M', fps: 30 },
  { id: 'custom', label: 'Custom', resolution: 'custom', bitrate: 'custom', fps: 'custom' }
];

async function listProfiles(req, res) {
  return res.json({ profiles: exportProfiles });
}

async function createRenderJob(req, res) {
  const { projectId, profile = 'youtube-4k', fps = 30 } = req.body;
  const preset = exportProfiles.find((p) => p.id === profile) || exportProfiles[0];
  const job = renderQueue.enqueue({
    userId: req.user.userId,
    projectId,
    profile,
    fps,
    resolution: preset.resolution,
    bitrate: preset.bitrate,
    frames: req.body.frames || 240,
    timeline: req.body.timeline || { tracks: [] }
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

module.exports = { createRenderJob, getRenderJob, listRenderJobs, listProfiles };
