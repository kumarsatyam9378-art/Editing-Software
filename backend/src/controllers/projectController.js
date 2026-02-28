const Project = require('../models/Project');

async function listProjects(req, res) {
  const projects = await Project.find({ userId: req.user.userId }).sort({ updatedAt: -1 }).limit(50);
  return res.json({ projects });
}

async function createProject(req, res) {
  const project = await Project.create({
    userId: req.user.userId,
    name: req.body.name,
    status: req.body.status || 'draft',
    composition: req.body.composition,
    exportSettings: req.body.exportSettings || undefined
  });

  return res.status(201).json({ project });
}

async function upsertProject(req, res) {
  const project = await Project.findOneAndUpdate(
    { userId: req.user.userId, name: req.body.name },
    {
      userId: req.user.userId,
      name: req.body.name,
      status: req.body.status || 'draft',
      composition: req.body.composition,
      exportSettings: req.body.exportSettings || undefined
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  return res.status(200).json({ project });
}

async function createExportJob(req, res) {
  return res.status(202).json({
    job: {
      id: `exp_${Date.now()}`,
      projectName: req.body.projectName,
      target: req.body.target || '4k',
      codec: req.body.codec || 'h264',
      status: 'queued'
    }
  });
}

module.exports = { listProjects, createProject, upsertProject, createExportJob };
