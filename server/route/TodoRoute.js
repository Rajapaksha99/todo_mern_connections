const express = require('express');
const { check, validationResult } = require('express-validator');
const Todo = require('../model/TodoModel');
const router = express.Router();

// Create a new Todo
router.post(
  '/todos',
  [
    check('title').notEmpty().withMessage('Title is required'),
    check('title').isLength({ min: 3 }).withMessage('Title must be at least 3 characters'),
    check('description').optional().isLength({ min: 5 }).withMessage('Description should be at least 5 characters'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { title, description, completed } = req.body;
      const newTodo = new Todo({
        title,
        description,
        completed,
      });

      await newTodo.save();
      res.status(201).json(newTodo);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// Get all Todos
router.get('/todos', async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single Todo by ID
router.get('/todos/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).json({ message: 'Todo not found' });
    res.json(todo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a Todo
router.put(
  '/todos/:id',
  [
    check('title').optional().isLength({ min: 3 }).withMessage('Title must be at least 3 characters'),
    check('description').optional().isLength({ min: 5 }).withMessage('Description should be at least 5 characters'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { title, description, completed } = req.body;
      const updatedTodo = await Todo.findByIdAndUpdate(
        req.params.id,
        { title, description, completed },
        { new: true }
      );
      if (!updatedTodo) return res.status(404).json({ message: 'Todo not found' });
      res.json(updatedTodo);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// Delete a Todo
router.delete('/todos/:id', async (req, res) => {
  try {
    const deletedTodo = await Todo.findByIdAndDelete(req.params.id);
    if (!deletedTodo) return res.status(404).json({ message: 'Todo not found' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
