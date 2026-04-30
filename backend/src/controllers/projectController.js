const Project = require('../models/Project');
const Joi = require('joi');

const projectSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  description: Joi.string().max(500),
});

exports.createProject = async (req, res) => {
  try {
    const { error, value } = projectSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const project = await Project.create({
      ...value,
      owner_id: req.user.id,
    });

    // Add owner as member
    await Project.addMember(project.id, req.user.id, 'Admin');

    res.status(201).json({ message: 'Project created', project });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.findByOwnerId(req.user.id);
    res.json({ projects });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const members = await Project.getMembers(req.params.id);
    res.json({ project, members });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.owner_id !== req.user.id) {
      return res.status(403).json({ message: 'Only owner can update project' });
    }

    const updated = await Project.update(req.params.id, req.body);
    res.json({ message: 'Project updated', project: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.owner_id !== req.user.id) {
      return res.status(403).json({ message: 'Only owner can delete project' });
    }

    await Project.delete(req.params.id);
    res.json({ message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addMember = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const { user_id, role } = req.body;
    const member = await Project.addMember(req.params.id, user_id, role || 'Member');
    res.json({ message: 'Member added', member });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.removeMember = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    await Project.removeMember(req.params.id, req.params.userId);
    res.json({ message: 'Member removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
