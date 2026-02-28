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

module.exports = { listProjects, createProject };
