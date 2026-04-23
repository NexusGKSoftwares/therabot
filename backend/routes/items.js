import express from 'express';
import Item from '../models/Item.js';

const router = express.Router();

// @route   GET /api/items
// @desc    Get all items
router.get('/', async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/items
// @desc    Create an item
router.post('/', async (req, res) => {
  try {
    const { name, description } = req.body;
    const item = await Item.create({ name, description });
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/items/:id
// @desc    Delete an item
router.delete('/:id', async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json({ message: 'Item removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
