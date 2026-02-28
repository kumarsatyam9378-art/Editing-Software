const farm = require('../services/renderfarm/DistributedRenderFarm');

async function createFarmJob(req, res) {
  const job = farm.enqueue({
    payload: req.body.payload || { frames: 300 },
    webhookUrl: req.body.webhookUrl || '',
    owner: req.user?.userId || 'public'
  });
  return res.status(202).json({ job });
}

async function listFarmJobs(req, res) {
  return res.json({ jobs: farm.list() });
}

async function getFarmJob(req, res) {
  const job = farm.get(req.params.jobId);
  if (!job) return res.status(404).json({ message: 'Render farm job not found' });
  return res.json({ job });
}

module.exports = { createFarmJob, listFarmJobs, getFarmJob };
