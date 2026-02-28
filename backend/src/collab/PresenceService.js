class PresenceService {
  constructor() {
    this.rooms = new Map();
    this.versions = new Map();
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
}

module.exports = new PresenceService();
