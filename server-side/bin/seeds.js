const mongoose = require("mongoose");
const Absences = require("../models/absences-model");

const DB_NAME = "hr-management";

mongoose.connect(`mongodb://localhost/${DB_NAME}`, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const absences = [
  {
    user: "Ana Morais",
    date: "1984/07/20"
  },
  {
    user: "Pedro Morais",
    date: "1985/08/05"
  },
  {
    user: "Lurdes Morais",
    date: "1961/03/03"
  },
  {
    user: "João Morais",
    date: "1962/10/03"
  }
];

Absences.create(absences, err => {
  if (err) {
    throw err;
  }
  console.log(`Created ${absences.length} absences`);
  mongoose.connection.close();
});
