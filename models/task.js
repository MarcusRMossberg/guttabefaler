const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 5,
  },
  info: String,
  points: Number,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  completed: Boolean,

  image: String,
  shortname: String,
});

taskSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});
taskSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Task", taskSchema);
