const express = require("express");
const router = express.Router();
const Users = require("../models/users-model");
const mongoose = require('mongoose');

router.get("/users", (req, res, next) => {
  Users.find({
    is_active: true
  })
    .then(users => {
      res.json(
        users.map(user => ({
          id: user._id,
          name: user.name,
          username: user.username,
          password: user.password,
          is_admin: user.is_admin,
          birthday: user.birthday,
          area: user.area
        }))
      );
    })
    .catch(err => {
      res.json(err);
    });
});

router.post("/users", (req, res, next) => {
  const { name, username, password, is_admin, birthday, area } = req.body;
  Users.create({
    name,
    username,
    password,
    is_admin,
    birthday,
    area,
    is_active: true
  })
    .then(user => {
      res.json({
          id: user._id,
          name: user.name,
          username: user.username,
          password: user.password,
          is_admin: user.is_admin,
          birthday: user.birthday,
          area: user.area
      });
    })
    .catch(err => {
      res.json(err);
    });
});

router.patch('/users/:userId', (req, res, next) => {
  console.log(req.params)
  if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }

  Users.findByIdAndUpdate(req.params.userId, req.body)
    .then(() => {
      res.json({ message: `User with ${req.params.userId} is updated successfully.` });
    })
    .catch(err => {
      res.json(err);
    });
});

router.delete('/users/:userId', (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }

  Users.findByIdAndRemove(req.params.userId)
    .then(() => {
      res.json({ message: `User with ${req.params.userId} is removed successfully.` });
    })
    .catch(error => {
      res.json(error);
    });
});

module.exports = router;
