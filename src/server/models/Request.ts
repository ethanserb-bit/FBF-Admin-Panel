import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'denied', 'in_progress'],
    default: 'pending',
  },
  isUrgent: {
    type: Boolean,
    default: false,
  },
  category: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['regular', 'expert'],
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  assignedExpertId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Expert',
  },
  commissionRate: {
    type: Number,
    default: 0.5, // 50% default commission
  },
  isExclusive: {
    type: Boolean,
    default: false,
  },
  mediaAttachments: [{
    type: {
      type: String,
      enum: ['image', 'video'],
    },
    url: String,
    thumbnailUrl: String,
  }],
  denialReason: String,
  refundStatus: {
    type: String,
    enum: ['none', 'pending', 'processed'],
    default: 'none',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

requestSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Request = mongoose.model('Request', requestSchema);

export default Request; 