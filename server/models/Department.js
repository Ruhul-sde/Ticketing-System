import mongoose from 'mongoose';

/**
 * Category Schema (Embedded)
 */
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
      // ❌ no unique:true here (MongoDB does not support unique in subdocuments properly)
    },
    description: {
      type: String
    },
    subCategories: [
      {
        type: String
      }
    ],
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { _id: true }
);

/**
 * Department Schema
 */
const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String
  },
  categories: [categorySchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Department = mongoose.model('Department', departmentSchema);

export default Department;
