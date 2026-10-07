const express = require('express');
const router = express.Router();
const Store = require('../data/store');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', (req, res) => {
  const { category } = req.query;
  const projects = Store.getProjects(category);
  res.json({ success: true, count: projects.length, data: projects });
});

router.get('/:id', (req, res) => {
  const project = Store.getProjectById(req.params.id);
  if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
  res.json({ success: true, data: project });
});

router.post('/', authMiddleware, (req, res) => {
  try {
    const newProj = Store.createProject(req.body);
    res.status(201).json({ success: true, data: newProj, message: 'Project created successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/:id', authMiddleware, (req, res) => {
  try {
    const updated = Store.updateProject(req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: 'Project not found' });
    res.json({ success: true, data: updated, message: 'Project updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/:id', authMiddleware, (req, res) => {
  try {
    const deleted = Store.deleteProject(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Project not found' });
    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
