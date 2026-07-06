const mongoose = require('mongoose');

const planSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Plan name is required'],
      unique: true,    // No two plans can have the same name
      trim: true,
      enum: {
        values: ['basic', 'standard', 'premium'],
        message: 'Plan name must be basic, standard, or premium'
      }
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative']
    },
    duration: {
      type: String,
      required: [true, 'Duration is required'],
      enum: {
        values: ['monthly', 'quarterly', 'yearly'],
        message: 'Duration must be monthly, quarterly, or yearly'
      }
    },
    features: {
      type: [String],   // Array of feature strings e.g. ["Unlimited classes", "Locker access"]
      required: [true, 'Features are required'],
      validate: {
        validator: (arr) => arr.length > 0,
        message: 'At least one feature must be listed'
      }
    },
    maxClasses: {
      type: Number,
      required: [true, 'Max classes per month is required'],
      min: [1, 'Must allow at least 1 class'],
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

module.exports = mongoose.model('Plan', planSchema);