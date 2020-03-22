const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jsonwebtoken = require("jsonwebtoken");
const jwt = require("express-jwt");
const Users = require("../models/users-model");

const router = express.Router();

router.get("/users", (req, res) => {
  Users.find({
    is_active: true
  })
    .then(users => {
      const records = users.map(user => ({
        id: user._id,
        username: user.username,
        name: user.name,
        birthday: user.birthday,
        area: user.area
      }));

      res.json(records);
    })
    .catch(error => {
      res.status(500).json({error: error.message});
    });
});

router.post("/users", jwt({ secret: process.env.JWT_SECRET }), (req, res) => {
  const { name, birthday, area } = req.body;

  Users.create({
    username: null,
    password: null,
    name,
    birthday,
    area,
    is_active: true
  })
    .then(user => {
      res.json({
        id: user._id,
        username: user.username,
        name: user.name,
        birthday: user.birthday,
        area: user.area
      });
    })
    .catch(error => {
      res.status(500).json({error: error.message});
    });
});

router.patch("/users/:userId", jwt({ secret: process.env.JWT_SECRET }), (req, res) => {
  const { userId } = req.params;
  const { name, birthday, area } = req.body;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    res.status(400).json({ message: "Specified user id is not valid" });
    return;
  }

  Users.findByIdAndUpdate(
    userId,
    {
      name,
      birthday,
      area
    },
    { new: true }
  )
    .then(user => {
      res.json({
        id: user._id,
        username: user.username,
        name: user.name,
        birthday: user.birthday,
        area: user.area
      });
    })
    .catch(error => {
      res.status(500).json({error: error.message});
    });
});

router.delete("/users/:userId", jwt({ secret: process.env.JWT_SECRET }), (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    res.status(400).json({ message: "Specified user id is not valid" });
    return;
  }

  Users.findByIdAndUpdate(userId, { is_active: false })
    .then(() => {
      res.json({ message: `User with ${userId} was removed successfully.` });
    })
    .catch(error => {
      res.status(500).json({error: error.message});
    });
});

router.put("/users/:userId/credentials", jwt({ secret: process.env.JWT_SECRET }), (req, res) => {
  // TODO: Make sure the username is unique

  const { userId } = req.params;
  const { username, password } = req.body;

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
        // There is no active user with a matching id in the database
        throw new Error("User not found");
      }

      // Credentials can only be edited by their owner, or added to a user that has none (username is null)
      const canEditCredentials = userId === req.user.userId || user.username === null;

      if (canEditCredentials) {
        user.username = username;
        user.password = bcrypt.hashSync(password, 10);

        return user.save();
      }
    })
    .then(user => {
      res.json({
        id: user._id,
        username: user.username,
        name: user.name,
        birthday: user.birthday,
        area: user.area
      });
    })
    .catch(error => {
      res.status(500).json({error: error.message});
    });
});

router.delete("/users/:userId/credentials", jwt({ secret: process.env.JWT_SECRET }), (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    res.status(400).json({ message: "Specified user id is not valid" });
    return;
  }

  Users.findByIdAndUpdate(
    userId,
    {
      username: null,
      password: null
    },
    { new: true }
  )
    .then(user => {
      res.json({
        id: user._id,
        username: user.username,
        name: user.name,
        birthday: user.birthday,
        area: user.area
      });
    })
    .catch(error => {
      res.status(500).json({error: error.message});
    });
});

router.post("/users/login", (req, res) => {
  const { username, password } = req.body;

  Users.findOne({ username })
    .then(user => {
      if (!user) {
        // Login fail (user not found)
        res.status(401).json({ message: "Invalid credentials" });
        return;
      }
      if (bcrypt.compareSync(password, user.password)) {
        // Login success
        const token = jsonwebtoken.sign({ userId: user._id }, process.env.JWT_SECRET);

        res.json({ token });
      } else {
        // Login fail (invalid password)
        res.status(401).json({ message: "Invalid credentials" });
      }
    })
    .catch(error => {
      res.status(500).json({error: error.message});
    });
});

module.exports = router;
