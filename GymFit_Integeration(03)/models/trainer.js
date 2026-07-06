const mongoose = require('mongoose');

const trainerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Trainer name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
    },
    specialization: {
      type: String,
      required: [true, 'Specialization is required'],
      enum: {
        values: ['yoga', 'cardio', 'strength', 'crossfit', 'pilates', 'boxing', 'swimming'],
        message: 'Specialization must be one of: yoga, cardio, strength, crossfit, pilates, boxing, swimming'
      }
    },
    experience: {
      type: Number,
      required: [true, 'Years of experience is required'],
      min: [0, 'Experience cannot be negative'],
      max: [50, 'Please enter a valid experience value']
    },
    rating: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
      default: 5
    },
    isAvailable: {
      type: Boolean,
      default: true
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters'],
      trim: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Trainer', trainerSchema);