import express from 'express';
import AdminProfile from '../models/AdminProfile.js';
import User from '../models/User.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get all admin profiles
router.get('/', authenticate, async (req, res) => {
  try {
    const profiles = await AdminProfile.find()
      .populate('user', 'name email role department employeeCode')
      .populate('departments', 'name description categories');
    res.json(profiles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get admin profiles by department
router.get('/by-department/:departmentId', authenticate, async (req, res) => {
  try {
    const profiles = await AdminProfile.find({ departments: req.params.departmentId })
      .populate('user', 'name email role department employeeCode')
      .populate('departments', 'name description categories');
    res.json(profiles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create admin profile (superadmin only)
router.post('/', authenticate, authorize('superadmin'), async (req, res) => {
  try {
    const { userId, bio, expertise, departments, phone, profileImage, employeeId, address, emergencyContact } = req.body;

    const existingProfile = await AdminProfile.findOne({ user: userId });
    if (existingProfile) {
      return res.status(400).json({ message: 'Profile already exists for this admin' });
    }

    const profile = new AdminProfile({
      user: userId,
      bio,
      expertise,
      departments,
      phone,
      profileImage,
      employeeId,
      address,
      emergencyContact
    });

    await profile.save();
    const populatedProfile = await AdminProfile.findById(profile._id)
      .populate('user', 'name email role department employeeCode')
      .populate('departments', 'name description categories');

    res.status(201).json(populatedProfile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update admin profile (superadmin only)
router.patch('/:id', authenticate, authorize('superadmin'), async (req, res) => {
  try {
    const { bio, expertise, departments, phone, profileImage, isActive, employeeId, address, emergencyContact } = req.body;

    const profile = await AdminProfile.findByIdAndUpdate(
      req.params.id,
      { bio, expertise, departments, phone, profileImage, isActive, employeeId, address, emergencyContact },
      { new: true }
    )
      .populate('user', 'name email role department employeeCode')
      .populate('departments', 'name description categories');

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete admin profile (superadmin only)
router.delete('/:id', authenticate, authorize('superadmin'), async (req, res) => {
  try {
    await AdminProfile.findByIdAndDelete(req.params.id);
    res.json({ message: 'Admin profile deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;