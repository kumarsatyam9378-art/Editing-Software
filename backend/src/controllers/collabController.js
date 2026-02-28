const presence = require('../collab/PresenceService');

async function getPresence(req, res) {
  const users = presence.list(req.params.roomId);
  return res.json({ roomId: req.params.roomId, users });
}

async function getVersionHistory(req, res) {
  const versions = presence.getVersions(req.params.projectId);
  return res.json({ projectId: req.params.projectId, versions });
}

async function addComment(req, res) {
  const comment = presence.addComment(req.params.projectId, {
    userId: req.user.userId,
    text: req.body.text,
    markerTime: req.body.markerTime ?? 0
  });
  return res.status(201).json({ comment });
}

async function listComments(req, res) {
  return res.json({ projectId: req.params.projectId, comments: presence.getComments(req.params.projectId) });
}

async function addSnapshot(req, res) {
  const snapshot = presence.addSnapshot(req.params.projectId, {
    userId: req.user.userId,
    name: req.body.name || 'Snapshot',
    composition: req.body.composition || null
  });
  return res.status(201).json({ snapshot });
}

async function listSnapshots(req, res) {
  return res.json({ projectId: req.params.projectId, snapshots: presence.getSnapshots(req.params.projectId) });
}

module.exports = { getPresence, getVersionHistory, addComment, listComments, addSnapshot, listSnapshots };
