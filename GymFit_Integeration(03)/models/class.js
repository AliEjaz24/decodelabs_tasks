const mongoose = require('mongoose');

const classSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Class name is required'],
      trim: true,
      minlength: [2, 'Class name must be at least 2 characters'],
      maxlength: [100, 'Class name cannot exceed 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [500, 'Description cannot exceed 500 characters'],
      trim: true
    },
    // RELATIONSHIP — this links a class to a trainer (1:Many)
    // One trainer can teach many classes
    trainer: {
      type: mongoose.Schema.Types.ObjectId,  // stores the trainer's MongoDB _id
      ref: 'Trainer',                        // tells Mongoose which model to look up
      required: [true, 'A trainer must be assigned to the class']
    },
    schedule: {
      day: {
        type: String,
        required: [true, 'Schedule day is required'],
        enum: {
          values: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
          message: 'Day must be a valid day of the week'
        }
      },
      time: {
        type: String,
        required: [true, 'Schedule time is required'],
        trim: true
      }
    },
    duration: {
      type: Number,                          // duration in minutes
      required: [true, 'Duration is required'],
      min: [15, 'Class must be at least 15 minutes'],
      max: [180, 'Class cannot exceed 180 minutes']
    },
    capacity: {
      type: Number,
      required: [true, 'Capacity is required'],
      min: [1, 'Capacity must be at least 1'],
      max: [100, 'Capacity cannot exceed 100']
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: ['yoga', 'cardio', 'strength', 'crossfit', 'pilates', 'boxing', 'swimming'],
        message: 'Category must be a valid class type'
      }
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Class', classSchema);