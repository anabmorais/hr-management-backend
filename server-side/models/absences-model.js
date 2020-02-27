const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const absencesSchema = new Schema({
  // user: { type: Schema.Types.ObjectId, ref: 'Users' },
  user: String,
  date: Date,
});

const Absences = mongoose.model('Absences', absencesSchema);

module.exports = Absences;