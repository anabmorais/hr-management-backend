const express = require('express');
const router = express.Router();
const Absences = require('../models/absences-model');


router.get('/absences', (req, res, next) => {
  Absences.find()
    .then(absence => {
      console.log("this is ittt", absence);
      res.json(absence);
    })
    .catch(err => {
      res.json(err);
    });
});

module.exports = router;