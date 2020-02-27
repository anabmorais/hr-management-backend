const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const usersSchema = new Schema({
  name: String,
  username: String,
  password: String,
  is_admin: Boolean,
  birthday: Date,
  area: String,
  is_active: Boolean,
});

const Users = mongoose.model('Users', usersSchema);

module.exports = usersSchema;