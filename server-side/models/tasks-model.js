const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tasksSchema = new Schema({
  name: String,
  color: String,
  is_active: Boolean,
});

const Tasks = mongoose.model('Tasks', tasksSchema);

module.exports = Tasks;