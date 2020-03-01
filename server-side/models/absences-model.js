const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const absencesSchema = new Schema({
  date: Date,
  user: { type: Schema.Types.ObjectId, ref: "Users" }
});

const Absences = mongoose.model("Absences", absencesSchema);

module.exports = Absences;
