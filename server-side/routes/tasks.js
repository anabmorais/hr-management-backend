const express = require("express");
const mongoose = require("mongoose");
const jwt = require("express-jwt");
const Tasks = require("../models/tasks-model");

const router = express.Router();

router.get("/tasks", (req, res) => {
  Tasks.find({
    is_active: true
  })
    .then(tasks => {
      const records = tasks.map(task => ({
        id: task._id,
        name: task.name,
        color: task.color
      }));

      res.json(records);
    })
    .catch(error => {
      res.status(500).json({error: error.message});
    });
});

router.post("/tasks", jwt({ secret: process.env.JWT_SECRET }), (req, res) => {
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
    .catch(error => {
      res.status(500).json({error: error.message});
    });
});

router.patch("/tasks/:taskId", jwt({ secret: process.env.JWT_SECRET }), (req, res) => {
  const { taskId } = req.params;
  const { name, color } = req.body;

  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    res.status(400).json({ message: "Specified task id is not valid" });
    return;
  }

  Tasks.findByIdAndUpdate(
    taskId,
    {
      name,
      color
    },
    { new: true }
  )
    .then(task => {
      res.json({
        id: task._id,
        name: task.name,
        color: task.color
      });
    })
    .catch(error => {
      res.status(500).json({error: error.message});
    });
});

router.delete("/tasks/:taskId", jwt({ secret: process.env.JWT_SECRET }), (req, res) => {
  const { taskId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    res.status(400).json({ message: "Specified task id is not valid" });
    return;
  }

  Tasks.findByIdAndUpdate(taskId, { is_active: false })
    .then(() => {
      res.json({ message: `Task with ${taskId} is removed successfully.` });
    })
    .catch(error => {
      res.status(500).json({error: error.message});
    });
});

module.exports = router;
