const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const workScheduleSchema = new Schema({
  date: Date,
  remarks: String,
  items: [{ type: Schema.Types.ObjectId, ref: "WorkScheduleItem" }],
  created_at: Date,
  created_by: { type: Schema.Types.ObjectId, ref: "Users" },
  is_active: Boolean
});

const WorkSchedule = mongoose.model("WorkSchedule", workScheduleSchema);

module.exports = WorkSchedule;
