const express = require("express");
const mongoose = require("mongoose");
const jwt = require("express-jwt");
const WorkSchedule = require("../models/work-schedule-model");
const WorkScheduleItem = require("../models/work-schedule-item-model");

const router = express.Router();

const getWorkSchedule = date =>
  WorkSchedule.findOne({
    date,
    is_active: true
  })
    .populate([
      {
        path: "items",
        populate: [{ path: "user" }, { path: "task" }]
      },
      {
        path: "created_by"
      }
    ])
    .then(workSchedule => {
      // If a work schedule was not found, return null
      if (!workSchedule) {
        return null;
      }

      // For each item found in the work schedule, populate its task and user and build the output object
      const items = workSchedule.items.map(workScheduleItem => {
        const task = workScheduleItem.task;
        const user = workScheduleItem.user;

        return {
          id: workScheduleItem._id,
          period: workScheduleItem.period,
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
      });

      const createdBy = workSchedule.created_by;

      return {
        id: workSchedule._id,
        date: workSchedule.date,
        remarks: workSchedule.remarks,
        items,
        createdAt: workSchedule.created_at,
        createBy: {
          id: createdBy._id,
          username: createdBy.username,
          name: createdBy.name,
          birthday: createdBy.birthday,
          area: createdBy.area
        }
      };
    });

router.get("/work-schedule", (req, res) => {
  const { date } = req.query;

  getWorkSchedule(date)
    .then(workSchedule => {
      res.json(workSchedule);
    })
    .catch(error => {
      res.status(500).json({ error: error.message });
    });
});

router.put("/work-schedule", jwt({ secret: process.env.JWT_SECRET }), (req, res) => {
  const { date } = req.query;
  const { remarks, items } = req.body;

  WorkSchedule.findOneAndUpdate(
    {
      date,
      is_active: true
    },
    { is_active: false }
  )
    .then(() =>
      Promise.all(
        items.map(item =>
          WorkScheduleItem.create({
            period: item.period,
            task: item.taskId,
            user: item.userId
          })
        )
      )
    )
    .then(workScheduleItems =>
      WorkSchedule.create({
        date,
        remarks,
        items: workScheduleItems.map(workScheduleItem => workScheduleItem._id),
        created_at: new Date(),
        created_by: req.user.userId,
        is_active: true
      })
    )
    .then(() => getWorkSchedule(date))
    .then(workSchedule => {
      res.json(workSchedule);
    })
    .catch(error => {
      res.status(500).json({ error: error.message });
    });
});

module.exports = router;
