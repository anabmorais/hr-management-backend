const express = require("express");
const router = express.Router();
const Tasks = require("../models/tasks-model");
const mongoose = require('mongoose');

router.get("/tasks", (req, res, next) => {
  Tasks.find({
    is_active: true
  })
    .then(tasks => {
      res.json(
        tasks.map(task => ({
          id: task._id,
          name: task.name,
          color: task.color
        }))
      );
    })
    .catch(err => {
      res.json(err);
    });
});

router.post("/tasks", (req, res, next) => {
  const { name, color } = req.body;
  Tasks.create({
    name,
    color,
    is_active: true
  })
    .then(task => {
      res.json({
        id: task._id,
        name: task.name,
        color: task.color
      });
    })
    .catch(err => {
      res.json(err);
    });
});

router.patch('/tasks/:taskId', (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.taskId)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }

  Tasks.findByIdAndUpdate(req.params.taskId, req.body)
    .then(() => {
      res.json({ message: `Task with ${req.params.taskId} is updated successfully.` });
    })
    .catch(err => {
      res.json(err);
    });
});

router.delete('/tasks/:taskId', (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.taskId)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }

  Tasks.findByIdAndRemove(req.params.taskId)
    .then(() => {
      res.json({ message: `Task with ${req.params.taskId} is removed successfully.` });
    })
    .catch(error => {
      res.json(error);
    });
});

module.exports = router;
