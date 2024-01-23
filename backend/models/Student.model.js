const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const studentSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
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
  email: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },

  gender: {
    type: String,
  },

  role: {
    type: String,
    default: "student",
  },

  age: {
    type: Number,
  },

  mobile: {
    type: Number,
    length: 9,
  },
  year: {
    type: Number,
  },
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "courses" }],
  verificationToken: String,
  isVerified: {
    type: Boolean,
    default: false,
  },
  verified: Date,
  passwordToken: {
    type: String,
  },
  passwordTokenExpirationDate: {
    type: Date,
  },
  image: {
    type: String,
    default:
      "https://res.cloudinary.com/diverse/image/upload/v1674562453/diverse/oipm1ecb1yudf9eln7az.jpg",
  },
});

studentSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

studentSchema.methods.comparePassword = async function (canditatePassword) {
  const isMatch = await bcrypt.compare(canditatePassword, this.password);
  return isMatch;
};

const StudentModel = mongoose.model("students", studentSchema);

module.exports = {StudentModel};
