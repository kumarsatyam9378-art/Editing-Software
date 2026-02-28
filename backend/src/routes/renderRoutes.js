const express = require('express');
const auth = require('../middleware/auth');
const { createRenderJob, getRenderJob, listRenderJobs, listProfiles } = require('../controllers/renderController');

const router = express.Router();

router.get('/profiles', listProfiles);
router.get('/', auth, listRenderJobs);
router.post('/', auth, createRenderJob);
router.get('/:jobId', auth, getRenderJob);

module.exports = router;
