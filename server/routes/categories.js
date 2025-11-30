
import express from 'express';
import Category from '../models/Category.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get all categories
router.get('/', authenticate, async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create category (superadmin only)
router.post('/', authenticate, authorize('superadmin'), async (req, res) => {
  try {
    const { name, description, subCategories } = req.body;
    const category = new Category({ name, description, subCategories });
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update category (superadmin only)
router.patch('/:id', authenticate, authorize('superadmin'), async (req, res) => {
  try {
    const { name, description, subCategories } = req.body;
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name, description, subCategories },
      { new: true }
    );
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete category (superadmin only)
router.delete('/:id', authenticate, authorize('superadmin'), async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
