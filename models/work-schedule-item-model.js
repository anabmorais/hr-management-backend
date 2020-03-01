const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const workScheduleItemSchema = new Schema({
  period: Number,
  task: { type: Schema.Types.ObjectId, ref: "Tasks" },
  user: { type: Schema.Types.ObjectId, ref: "Users" }
});

const WorkScheduleItem = mongoose.model("WorkScheduleItem", workScheduleItemSchema);

module.exports = WorkScheduleItem;