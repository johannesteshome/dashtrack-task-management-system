const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  courseTitle: { type: String, required: true },
  courseCode: { type: String, required: true },
  creditHour: { type: Number, required: true },
  assignment: [
    {
      teacher: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
      students: [
        {
          department: { type: mongoose.Schema.Types.ObjectId, ref: "departments" },
          section: [{ type: String }],
          year: { type: Number },
        },
      ],
    },
  ],
});

const CourseModel = mongoose.model("courses", courseSchema);

module.exports = {CourseModel};
