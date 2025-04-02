import mongoose from 'mongoose';

const expertSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  specialties: [{
    type: String,
    required: true,
  }],
  rating: {
    type: Number,
    default: 5.0,
    min: 0,
    max: 5,
  },
  responseRate: {
    type: Number,
    default: 100,
    min: 0,
    max: 100,
  },
  totalResponses: {
    type: Number,
    default: 0,
  },
  successfulResponses: {
    type: Number,
    default: 0,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  defaultCommissionRate: {
    type: Number,
    default: 0.5, // 50% default commission
  },
  credentials: [{
    title: String,
    institution: String,
    year: Number,
    verificationStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending',
    },
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

expertSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  if (this.totalResponses > 0) {
    this.responseRate = (this.successfulResponses / this.totalResponses) * 100;
  }
  next();
});

const Expert = mongoose.model('Expert', expertSchema);

export default Expert; 