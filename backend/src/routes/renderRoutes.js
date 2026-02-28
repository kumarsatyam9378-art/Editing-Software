const express = require('express');
const auth = require('../middleware/auth');
const { createRenderJob, getRenderJob, listRenderJobs } = require('../controllers/renderController');

const router = express.Router();

router.get('/', auth, listRenderJobs);
router.post('/', auth, createRenderJob);
router.get('/:jobId', auth, getRenderJob);

module.exports = router;
