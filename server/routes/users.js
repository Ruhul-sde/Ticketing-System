
import express from 'express';
import User from '../models/User.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, authorize('superadmin'), async (req, res) => {
  try {
    const users = await User.find().select('-password').populate('department');
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
});

router.patch('/:id', authenticate, authorize('superadmin'), async (req, res) => {
  try {
    const { department, role } = req.body;
    
    // Validate role if provided
    if (role && !['user', 'admin', 'superadmin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role specified' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { department, role },
      { new: true, runValidators: true }
    ).select('-password').populate('department');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Failed to update user', error: error.message });
  }
});

export default router;
