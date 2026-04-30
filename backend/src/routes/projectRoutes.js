const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { authMiddleware, authorize } = require('../middleware/auth');

router.post('/', authMiddleware, projectController.createProject);
router.get('/', authMiddleware, projectController.getProjects);
router.get('/:id', authMiddleware, projectController.getProjectById);
router.put('/:id', authMiddleware, projectController.updateProject);
router.delete('/:id', authMiddleware, projectController.deleteProject);

router.post('/:id/members', authMiddleware, projectController.addMember);
router.delete('/:id/members/:userId', authMiddleware, projectController.removeMember);

module.exports = router;
