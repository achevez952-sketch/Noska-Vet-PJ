const express = require('express');
const router = express.Router();
const Adoption = require('../models/Adoption');

// Get all adoptions
router.get('/', async (req, res) => {
  try {
    const adoptions = await Adoption.find().sort({ createdAt: -1 });
    res.json(adoptions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create new adoption request
router.post('/', async (req, res) => {
  try {
    const newAdoption = new Adoption(req.body);
    const saved = await newAdoption.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
