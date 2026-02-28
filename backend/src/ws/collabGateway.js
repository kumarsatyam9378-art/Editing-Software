const { WebSocketServer } = require('ws');
const presence = require('../collab/PresenceService');

function safeSend(ws, payload) {
  if (ws.readyState === ws.OPEN) ws.send(JSON.stringify(payload));
}

function attachCollabGateway(server) {
  const wss = new WebSocketServer({ server, path: '/ws/collab' });

  wss.on('connection', (ws) => {
    let roomId = null;
    let userId = null;

    ws.on('message', (raw) => {
      try {
        const msg = JSON.parse(raw.toString());

        if (msg.type === 'join') {
          roomId = msg.roomId;
          userId = msg.user?.id;
          const users = presence.join(roomId, msg.user);
          wss.clients.forEach((client) => safeSend(client, { type: 'presence', roomId, users }));
        }

        if (msg.type === 'patch' && roomId) {
          const version = presence.appendVersion(msg.projectId || roomId, msg.patch);
          wss.clients.forEach((client) => safeSend(client, { type: 'patch', roomId, patch: msg.patch, version }));
        }
      } catch (_) {}
    });

    ws.on('close', () => {
      if (roomId && userId) {
        const users = presence.leave(roomId, userId);
        wss.clients.forEach((client) => safeSend(client, { type: 'presence', roomId, users }));
      }
    });
  });

  return wss;
}

module.exports = attachCollabGateway;
