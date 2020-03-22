const express = require("express");
const mongoose = require("mongoose");
const jwt = require("express-jwt");
const moment = require("moment");
const Users = require("../models/users-model");
const Tasks = require("../models/tasks-model");
const WorkSchedule = require("../models/work-schedule-model");
const WorkScheduleItem = require("../models/work-schedule-item-model");

const router = express.Router();

router.get("/work-schedule/events", (req, res) => {
  const { date } = req.query;
  const startOfDay = moment(date).startOf("day").toDate();
  const endOfDay = moment(date).endOf("day").toDate();


  WorkScheduleItem.find({
    start: {"$lte": endOfDay },
    end: {"$gte": startOfDay }
  })
    .populate(["user", "task"])
    .then(workScheduleItems => {
      res.json(
        workScheduleItems.map(workScheduleItem => {
          const task = workScheduleItem.task;
          const user = workScheduleItem.user;

          return {
            id: workScheduleItem._id,
            start: workScheduleItem.start,
            end: workScheduleItem.end,
            task: {
              id: task._id,
              name: task.name,
              color: task.color
            },
            user: {
              id: user._id,
              username: user.username,
              name: user.name,
              birthday: user.birthday,
              area: user.area
            }
          };
        })
      );
    })
    .catch(error => {
      res.status(500).json({ error: error.message });
    });
});

router.post("/work-schedule/events", jwt({ secret: process.env.JWT_SECRET }), (req, res) => {
  const { start, end, taskId, userId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    res.status(400).json({ message: "Specified task id is not valid" });
    return;
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    res.status(400).json({ message: "Specified user id is not valid" });
    return;
  }

  Promise.all([
    Tasks.findOne({
      _id: taskId,
      is_active: true
    }).then(task => {
      if (!task) {
        throw new Error("Task not found");
      }

      return task;
    }),
    Users.findOne({
      _id: userId,
      is_active: true
    }).then(user => {
      if (!user) {
        throw new Error("User not found");
      }

      return user;
    })
  ])
    .then(([task, user]) => {
      return WorkScheduleItem.create({
        start,
        end,
        task: task._id,
        user: user._id
      }).then(workScheduleItem => {
        res.json({
          id: workScheduleItem._id,
          start: workScheduleItem.start,
          end: workScheduleItem.end,
          task: {
            id: task._id,
            name: task.name,
            color: task.color
          },
          user: {
            id: user._id,
            username: user.username,
            name: user.name,
            birthday: user.birthday,
            area: user.area
          }
        });
      });
    })
    .catch(error => {
      res.status(500).json({ error: error.message });
    });
});

router.patch("/work-schedule/events/:eventId", jwt({ secret: process.env.JWT_SECRET }), (req, res) => {
  const { eventId } = req.params;
  const { start, end, taskId, userId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    res.status(400).json({ message: "Specified event id is not valid" });
    return;
  }

  WorkScheduleItem.findOneAndUpdate(
    eventId,
    {
      start,
      end,
      taskId,
      userId
    },
    {
      omitUndefined: true,
      new: true
    }
  )
    .populate(["user", "task"])
    .then(workScheduleItem => {
      const task = workScheduleItem.task;
      const user = workScheduleItem.user;

      res.json({
        id: workScheduleItem._id,
        start: workScheduleItem.start,
        end: workScheduleItem.end,
        task: {
          id: task._id,
          name: task.name,
          color: task.color
        },
        user: {
          id: user._id,
          username: user.username,
          name: user.name,
          birthday: user.birthday,
          area: user.area
        }
      });
    })
    .catch(error => {
      res.status(500).json({ error: error.message });
    });
});

router.delete("/work-schedule/events/:eventId", jwt({ secret: process.env.JWT_SECRET }), (req, res) => {
  const { eventId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    res.status(400).json({ message: "Specified event id is not valid" });
    return;
  }

  WorkScheduleItem.findByIdAndRemove(eventId)
    .then(() => {
      res.json({ message: `Event with ${eventId} was removed successfully.` });
    })
    .catch(error => {
      res.status(500).json({ error: error.message });
    });
});

module.exports = router;
