const Task = require('../models/Task');
const Project = require('../models/Project');
const Joi = require('joi');

const taskSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().max(500),
  assigned_to: Joi.number(),
  status: Joi.string().valid('pending', 'in_progress', 'completed'),
  priority: Joi.string().valid('low', 'medium', 'high'),
});

exports.createTask = async (req, res) => {
  try {
    const { error, value } = taskSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const task = await Task.create({
      ...value,
      project_id: req.params.projectId,
    });

    res.status(201).json({ message: 'Task created', task });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProjectTasks = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const tasks = await Task.findByProjectId(req.params.projectId);
    const stats = await Task.getTaskStats(req.params.projectId);

    res.json({ tasks, stats });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ task });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const updated = await Task.update(req.params.taskId, req.body);
    res.json({ message: 'Task updated', task: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await Task.delete(req.params.taskId);
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.findByAssignedTo(req.user.id);
    res.json({ tasks });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDashboard = async (req, res) => {
  try {
    const myTasks = await Task.findByAssignedTo(req.user.id);
    const overdueTasks = await Task.getOverdueTasks();
    const projects = await Project.findByOwnerId(req.user.id);

    const stats = {
      totalTasks: myTasks.length,
      completedTasks: myTasks.filter(t => t.status === 'completed').length,
      pendingTasks: myTasks.filter(t => t.status === 'pending').length,
      inProgressTasks: myTasks.filter(t => t.status === 'in_progress').length,
      overdueTasks: overdueTasks.length,
      totalProjects: projects.length,
    };

    res.json({ stats, myTasks, overdueTasks });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
