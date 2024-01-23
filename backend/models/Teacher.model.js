const mongoose = require("mongoose");
const bcrypt = require("bcryptjs")

const teacherSchema = new mongoose.Schema({
  role: {
    type: String,
    default: "teacher",
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "courses" }],
  password: {
    type: String,
    required: true,
  },

  gender: {
    type: String,
  },

  age: {
    type: Number,
  },

  isAdmin: {
    type: Boolean,
    default: false,
  },

  mobile: {
    type: Number,
    length: 9,
  },
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

teacherSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

teacherSchema.methods.comparePassword = async function (canditatePassword) {
  const isMatch = await bcrypt.compare(canditatePassword, this.password);
  return isMatch;
};

const TeacherModel = mongoose.model("teachers", teacherSchema);

module.exports = { TeacherModel };

