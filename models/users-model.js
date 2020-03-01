const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const usersSchema = new Schema({
  username: String,
  password: String,
  name: String,
  birthday: Date,
  area: String,
  is_active: Boolean
});

const Users = mongoose.model("Users", usersSchema);

module.exports = Users;
