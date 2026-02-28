const presence = require('../collab/PresenceService');

async function getPresence(req, res) {
  const users = presence.list(req.params.roomId);
  return res.json({ roomId: req.params.roomId, users });
}

async function getVersionHistory(req, res) {
  const versions = presence.getVersions(req.params.projectId);
  return res.json({ projectId: req.params.projectId, versions });
}

module.exports = { getPresence, getVersionHistory };
