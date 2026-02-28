class PresenceService {
  constructor() {
    this.rooms = new Map();
    this.versions = new Map();
    this.comments = new Map();
    this.snapshots = new Map();
  }

  join(roomId, user) {
    if (!this.rooms.has(roomId)) this.rooms.set(roomId, new Map());
    this.rooms.get(roomId).set(user.id, { ...user, joinedAt: Date.now() });
    return this.list(roomId);
  }

  leave(roomId, userId) {
    this.rooms.get(roomId)?.delete(userId);
    return this.list(roomId);
  }

  list(roomId) {
    return [...(this.rooms.get(roomId)?.values() || [])];
  }

  appendVersion(projectId, patch) {
    if (!this.versions.has(projectId)) this.versions.set(projectId, []);
    const entry = {
      id: `ver_${Date.now()}_${Math.random().toString(16).slice(2, 6)}`,
      createdAt: new Date().toISOString(),
      patch
    };
    this.versions.get(projectId).push(entry);
    return entry;
  }

  getVersions(projectId) {
    return this.versions.get(projectId) || [];
  }

  addComment(projectId, comment) {
    if (!this.comments.has(projectId)) this.comments.set(projectId, []);
    const item = { id: `c_${Date.now()}_${Math.random().toString(16).slice(2,6)}`, createdAt: new Date().toISOString(), ...comment };
    this.comments.get(projectId).push(item);
    return item;
  }

  getComments(projectId) {
    return this.comments.get(projectId) || [];
  }

  addSnapshot(projectId, snapshot) {
    if (!this.snapshots.has(projectId)) this.snapshots.set(projectId, []);
    const item = { id: `s_${Date.now()}`, createdAt: new Date().toISOString(), ...snapshot };
    this.snapshots.get(projectId).push(item);
    return item;
  }

  getSnapshots(projectId) {
    return this.snapshots.get(projectId) || [];
  }
}

module.exports = new PresenceService();
