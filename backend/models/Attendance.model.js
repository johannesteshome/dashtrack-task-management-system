const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  students: [{studentID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "students",
    required: true,
  },
  isPresent: { type: Boolean, default: false }}],
  courseID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "courses",
    required: true,
  },
  date: { type: Date, default: Date.now },
  section: [{
    type: String,
  }],
  teacherID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "teachers",
    required: true,
  }
});

const AttendanceModel = mongoose.model("attendances", attendanceSchema);

module.exports = {AttendanceModel};
