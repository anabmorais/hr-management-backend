const express = require("express");
const mongoose = require("mongoose");
const jwt = require("express-jwt");
const moment = require("moment");
const Absences = require("../models/absences-model");
const Users = require("../models/users-model");

const router = express.Router();

router.get("/absences", (req, res) => {
  const { userId, fromDate, toDate } = req.query;

  const absencesQuery = Absences.find();

  if (userId) {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({ message: "Specified user id is not valid" });
      return;
    }

    absencesQuery.where("user", userId);
  }

  if (fromDate) {
    absencesQuery.gte("date", moment(fromDate).startOf("day").toDate());
  }

  if (toDate) {
    absencesQuery.lte("date", moment(toDate).endOf("day").toDate());
  }

  absencesQuery
    .populate("user")
    .then(absences =>
      absences.map(absence => {
        const user = absence.user;

        return {
          id: absence._id,
          date: absence.date,
          user: {
            id: user._id,
            username: user.username,
            name: user.name,
            birthday: user.birthday,
            area: user.area
          }
        };
      })
    )
    .then(records => {
      res.json(records);
    })
    .catch(error => {
      res.status(500).json({error: error.message});
    });
});

router.post("/absences", jwt({ secret: process.env.JWT_SECRET }), (req, res, next) => {
  // TODO: Do not duplicate absences (same date+user)

  const { userId, date } = req.body;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    res.status(400).json({ message: "Specified user id is not valid" });
    return;
  }

  Users.findOne({
    _id: userId,
    is_active: true
  })
    .then(user => {
      if (!user) {
        throw new Error("User not found");
      }

      return Absences.create({
        user: user._id,
        date
      }).then(absence => [absence, user]);
    })
    .then(([absence, user]) => {
      res.json({
        id: absence._id,
        date: absence.date,
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
      res.status(500).json({error: error.message});
    });
});

router.delete("/absences/:absenceId", jwt({ secret: process.env.JWT_SECRET }), (req, res) => {
  const { absenceId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(absenceId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Absences.findByIdAndDelete(absenceId)
    .then(() => {
      res.json({ message: `Absence with ${absenceId} was removed successfully.` });
    })
    .catch(error => {
      res.status(500).json({error: error.message});
    });
});

module.exports = router;
