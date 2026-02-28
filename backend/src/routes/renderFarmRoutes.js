const express = require('express');
const auth = require('../middleware/auth');
const { createFarmJob, listFarmJobs, getFarmJob } = require('../controllers/renderFarmController');

const router = express.Router();

router.post('/', auth, createFarmJob);
router.get('/', auth, listFarmJobs);
router.get('/:jobId', auth, getFarmJob);

module.exports = router;
