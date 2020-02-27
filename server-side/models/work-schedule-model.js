const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const scheduleSchema = new Schema({
  date: Date,
  remarks: String,
});

const Schedule = mongoose.model('Schedule', scheduleSchema);

module.exports = Schedule;