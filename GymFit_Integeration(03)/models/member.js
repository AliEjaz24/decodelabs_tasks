const mongoose = require('mongoose');

// PILLAR 1 — THE BLUEPRINT
// This schema is the contract for every member document in MongoDB.
// Mongoose enforces these rules BEFORE anything touches the database.

const memberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Member name is required'],  // NOT NULL
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,   // UNIQUE — no two members share an email
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true
    },
    age: {
      type: Number,
      min: [16, 'Member must be at least 16 years old'],  // CHECK constraint
      max: [100, 'Please enter a valid age']
    },
    plan: {
      type: String,
      enum: {                                     // CHECK — only these values allowed
        values: ['basic', 'standard', 'premium'],
        message: 'Plan must be basic, standard, or premium'
      },
      default: 'basic'
    },
    isActive: {
      type: Boolean,
      default: true
    },
    joinDate: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true  // auto-adds createdAt and updatedAt fields
  }
);

module.exports = mongoose.model('Member', memberSchema);