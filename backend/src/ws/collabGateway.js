const { WebSocketServer } = require('ws');
const presence = require('../collab/PresenceService');
const renderQueue = require('../services/renderQueueService');

function safeSend(ws, payload) {
  if (ws.readyState === ws.OPEN) ws.send(JSON.stringify(payload));
}

function attachCollabGateway(server) {
  const wss = new WebSocketServer({ server, path: '/ws/collab' });
  const layerLocks = new Map();

  const broadcast = (payload, roomId = null) => {
    wss.clients.forEach((client) => {
      if (!roomId || client.roomId === roomId) safeSend(client, payload);
    });
  };

  renderQueue.on('job', ({ type, job }) => {
    broadcast({ type: 'render-job', event: type, job, roomId: job.projectId }, job.projectId);
  });

  wss.on('connection', (ws) => {
    ws.roomId = null;
    ws.userId = null;

    ws.on('message', (raw) => {
      try {
        const msg = JSON.parse(raw.toString());

        if (msg.type === 'join') {
          ws.roomId = msg.roomId;
          ws.userId = msg.user?.id;
          const users = presence.join(ws.roomId, msg.user);
          broadcast({ type: 'presence', roomId: ws.roomId, users }, ws.roomId);
        }

        if (msg.type === 'cursor' && ws.roomId) {
          broadcast({ type: 'cursor', roomId: ws.roomId, userId: ws.userId, point: msg.point }, ws.roomId);
        }

        if (msg.type === 'layer-lock' && ws.roomId) {
          const key = `${ws.roomId}:${msg.layerId}`;
          const owner = layerLocks.get(key);
          if (!owner || owner === ws.userId) {
            layerLocks.set(key, ws.userId);
            broadcast({ type: 'layer-lock', roomId: ws.roomId, layerId: msg.layerId, userId: ws.userId }, ws.roomId);
          } else {
            safeSend(ws, { type: 'conflict', reason: 'layer-locked', layerId: msg.layerId, owner });
          }
        }

        if (msg.type === 'layer-unlock' && ws.roomId) {
          const key = `${ws.roomId}:${msg.layerId}`;
          const owner = layerLocks.get(key);
          if (owner === ws.userId) {
            layerLocks.delete(key);
            broadcast({ type: 'layer-unlock', roomId: ws.roomId, layerId: msg.layerId }, ws.roomId);
          }
        }

        if (msg.type === 'timeline-sync' && ws.roomId) {
          const version = presence.appendVersion(msg.projectId || ws.roomId, msg.patch);
          broadcast({ type: 'timeline-sync', roomId: ws.roomId, patch: msg.patch, version }, ws.roomId);
        }

        if (msg.type === 'patch' && ws.roomId) {
          const version = presence.appendVersion(msg.projectId || ws.roomId, msg.patch);
          broadcast({ type: 'patch', roomId: ws.roomId, patch: msg.patch, version }, ws.roomId);
        }
      } catch (_) {}
    });

    ws.on('close', () => {
      if (ws.roomId && ws.userId) {
        const users = presence.leave(ws.roomId, ws.userId);
        broadcast({ type: 'presence', roomId: ws.roomId, users }, ws.roomId);
      }
    });
  });

  return wss;
}

module.exports = attachCollabGateway;
