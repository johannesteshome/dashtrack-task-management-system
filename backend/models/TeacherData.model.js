const mongoose = require("mongoose");

const teacherDataSchema = new mongoose.Schema({
  courses: [
    {
      course: { type: mongoose.Schema.Types.ObjectId, ref: "courses" },
      students: [
        {
          department: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "departments",
          },
          section: [{ type: String }],
          year: { type: Number },
        },
      ],
    },
  ],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

const TeacherDataModel = mongoose.model("teachersData", teacherDataSchema);

module.exports = { TeacherDataModel };
