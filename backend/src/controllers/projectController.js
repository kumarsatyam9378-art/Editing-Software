const Project = require('../models/Project');
const archive = require('../services/projectArchiveService');

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

  archive.saveVersion(project.id, { ...req.body, projectId: project.id });
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

  archive.saveVersion(project.id, { ...req.body, projectId: project.id });
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

async function listProjectVersions(req, res) {
  return res.json({ versions: archive.listVersions(req.params.projectId) });
}

async function restoreProjectVersion(req, res) {
  const restored = archive.restore(req.params.projectId, Number(req.body.index || 0));
  if (!restored) return res.status(404).json({ message: 'Version not found' });
  return res.json({ restored });
}

async function getProjectBackup(req, res) {
  const backup = archive.getBackup(req.params.projectId);
  if (!backup) return res.status(404).json({ message: 'Backup not found' });
  return res.json({ backup });
}

module.exports = {
  listProjects,
  createProject,
  upsertProject,
  createExportJob,
  listProjectVersions,
  restoreProjectVersion,
  getProjectBackup
};
