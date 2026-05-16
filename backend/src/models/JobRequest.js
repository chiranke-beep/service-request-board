const mongoose = require('mongoose');

const jobRequestSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },

    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },

    category: {
      type: String,
      enum: {
        values: ['Plumbing', 'Electrical', 'Painting', 'Joinery', 'Other'],
        message: '{VALUE} is not a valid category',
      },
      default: 'Other',
    },

    location: {
      type: String,
      trim: true,
    },

    contactName: {
      type: String,
      trim: true,
    },

    contactEmail: {
      type: String,
      trim: true,
      lowercase: true,
      match: [
        /^\S+@\S+\.\S+$/,
        'Please enter a valid email address',
      ],
    },

    status: {
      type: String,
      enum: {
        values: ['Open', 'In Progress', 'Closed'],
        message: '{VALUE} is not a valid status',
      },
      default: 'Open',
    },
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: false }, // auto-set createdAt only
  }
);

module.exports = mongoose.model('JobRequest', jobRequestSchema);
