const express = require('express');
const router = express.Router();
const Store = require('../data/store');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', (req, res) => {
  const skills = Store.getSkills();
  res.json({ success: true, count: skills.length, data: skills });
});

router.get('/:id', (req, res) => {
  const skill = Store.getSkillById(req.params.id);
  if (!skill) return res.status(404).json({ success: false, message: 'Skill not found' });
  res.json({ success: true, data: skill });
});

router.post('/', authMiddleware, (req, res) => {
  try {
    const newSkill = Store.createSkill(req.body);
    res.status(201).json({ success: true, data: newSkill, message: 'Skill created successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/:id', authMiddleware, (req, res) => {
  try {
    const updated = Store.updateSkill(req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: 'Skill not found' });
    res.json({ success: true, data: updated, message: 'Skill updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/:id', authMiddleware, (req, res) => {
  try {
    const deleted = Store.deleteSkill(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Skill not found' });
    res.json({ success: true, message: 'Skill deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
