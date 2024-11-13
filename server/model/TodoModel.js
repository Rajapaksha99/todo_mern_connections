const mongoose = require('mongoose');
const { Schema } = mongoose;

// Create Todo Schema
const todoSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    minlength: [3, 'Title must be at least 3 characters'],
  },
  description: {
    type: String,
    required: false,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

// Create Todo Model
const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;
