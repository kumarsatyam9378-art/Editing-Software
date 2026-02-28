const crypto = require('crypto');

class ProjectArchiveService {
  constructor() {
    this.archives = new Map();
    this.backups = new Map();
  }

  hashAsset(asset) {
    const raw = `${asset.name || ''}:${asset.size || 0}:${asset.type || ''}`;
    return crypto.createHash('sha1').update(raw).digest('hex');
  }

  normalize(project) {
    const assets = (project.assets || []).map((asset) => ({ ...asset, hash: this.hashAsset(asset) }));
    return {
      schemaVersion: '1.0.0',
      savedAt: new Date().toISOString(),
      ...project,
      assets
    };
  }

  saveVersion(projectId, project) {
    const normalized = this.normalize(project);
    if (!this.archives.has(projectId)) this.archives.set(projectId, []);
    this.archives.get(projectId).push(normalized);
    this.backups.set(projectId, normalized);
    return normalized;
  }

  listVersions(projectId) {
    return this.archives.get(projectId) || [];
  }

  restore(projectId, index) {
    const versions = this.listVersions(projectId);
    if (!versions[index]) return null;
    this.backups.set(projectId, versions[index]);
    return versions[index];
  }

  getBackup(projectId) {
    return this.backups.get(projectId) || null;
  }
}

module.exports = new ProjectArchiveService();
