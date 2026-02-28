const express = require('express');
const auth = require('../middleware/auth');
const {
  getPresence,
  getVersionHistory,
  addComment,
  listComments,
  addSnapshot,
  listSnapshots
} = require('../controllers/collabController');

const router = express.Router();

router.get('/presence/:roomId', auth, getPresence);
router.get('/versions/:projectId', auth, getVersionHistory);
router.post('/comments/:projectId', auth, addComment);
router.get('/comments/:projectId', auth, listComments);
router.post('/snapshots/:projectId', auth, addSnapshot);
router.get('/snapshots/:projectId', auth, listSnapshots);

module.exports = router;
