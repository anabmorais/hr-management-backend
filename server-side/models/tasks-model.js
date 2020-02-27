const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tasksSchema = new Schema({
  task_name: String,
  color: String,
  is_active: Boolean,
});

const Tasks = mongoose.model('Tasks', usersSchema);

module.exports = tasksSchema;