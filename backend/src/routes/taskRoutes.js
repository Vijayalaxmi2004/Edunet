const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { authMiddleware } = require('../middleware/auth');

router.post('/projects/:projectId/tasks', authMiddleware, taskController.createTask);
router.get('/projects/:projectId/tasks', authMiddleware, taskController.getProjectTasks);
router.get('/tasks/:taskId', authMiddleware, taskController.getTaskById);
router.put('/tasks/:taskId', authMiddleware, taskController.updateTask);
router.delete('/tasks/:taskId', authMiddleware, taskController.deleteTask);

router.get('/my-tasks', authMiddleware, taskController.getMyTasks);
router.get('/dashboard', authMiddleware, taskController.getDashboard);

module.exports = router;
