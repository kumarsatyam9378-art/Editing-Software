const express = require('express');
const auth = require('../middleware/auth');
const { getPresence, getVersionHistory } = require('../controllers/collabController');

const router = express.Router();

router.get('/presence/:roomId', auth, getPresence);
router.get('/versions/:projectId', auth, getVersionHistory);

module.exports = router;
