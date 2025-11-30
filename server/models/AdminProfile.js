import mongoose from 'mongoose';

const adminProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  bio: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    default: ''
  },
  expertise: [{
    type: String
  }],
  departments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department'
  }],
  profileImage: {
    type: String,
    default: ''
  },
  employeeId: {
    type: String,
    unique: true,
    sparse: true
  },
  joiningDate: {
    type: Date,
    default: Date.now
  },
  address: {
    type: String,
    default: ''
  },
  emergencyContact: {
    name: String,
    phone: String,
    relation: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastPasswordChange: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('AdminProfile', adminProfileSchema);