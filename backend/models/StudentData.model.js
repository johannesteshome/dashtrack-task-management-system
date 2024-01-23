const mongoose = require("mongoose");

const studentDataSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    },
  studentID: {
    type: String,
    required: true,
  },
  section: {
    type: String,
  },
  department: {
    // refer the department model
    type: mongoose.Schema.Types.ObjectId,
    ref: "departments",
  },
  year: {
    type: Number,
  },
    courses: [{
        course: { type: mongoose.Schema.Types.ObjectId, ref: "courses" },
teacher: {type: mongoose.Schema.Types.ObjectId, ref: "users"}    }],
});

const StudentDataModel = mongoose.model("studentsData", studentDataSchema);

module.exports = { StudentDataModel };
