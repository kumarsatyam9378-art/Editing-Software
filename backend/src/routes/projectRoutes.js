const express = require('express');
const {
  createProject,
  listProjects,
  upsertProject,
  createExportJob,
  listProjectVersions,
  restoreProjectVersion,
  getProjectBackup
} = require('../controllers/projectController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, listProjects);
router.post('/', auth, createProject);
router.post('/upsert', auth, upsertProject);
router.post('/export', auth, createExportJob);
router.get('/versions/:projectId', auth, listProjectVersions);
router.post('/restore/:projectId', auth, restoreProjectVersion);
router.get('/backup/:projectId', auth, getProjectBackup);

module.exports = router;
