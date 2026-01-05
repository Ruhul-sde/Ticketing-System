
import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  domain: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  employeeCount: {
    type: Number,
    default: 0
  },
  totalTickets: {
    type: Number,
    default: 0
  },
  resolvedTickets: {
    type: Number,
    default: 0
  },
  pendingTickets: {
    type: Number,
    default: 0
  },
  totalSupportTime: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'suspended', 'frozen'],
    default: 'active'
  },
  statusReason: {
    type: String
  },
  statusChangedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  statusChangedAt: {
    type: Date
  },
  createdAt: {
    type: Number,
    default: 0
  },
  averageRating: {
    type: Number,
    default: 0
  },
  totalFeedbacks: {
    type: Number,
    default: 0
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

// Update timestamp on save
companySchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model('Company', companySchema);
