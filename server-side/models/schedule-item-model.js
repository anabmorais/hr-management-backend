const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemSchema = new Schema({
  planning: { type: Schema.Types.ObjectId, ref: 'Schedule' },
  period: String,
  user: { type: Schema.Types.ObjectId, ref: 'Users' },
  task: { type: Schema.Types.ObjectId, ref: 'Tasks' },
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
