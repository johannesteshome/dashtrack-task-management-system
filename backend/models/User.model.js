const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { USER_ROLES, GENDER } = require("../constants/constants");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
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
      enum: GENDER,
      // required: true,
    },
    mobile: {
      type: Number,
      length: 9,
    },
    role: {
      type: String,
      // required: true,
      enum: USER_ROLES,
      default: "user",
    },
    active: {
		type: Boolean,
		default: true
		},
	invitationToken: String,
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
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  console.log("before save");
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (canditatePassword) {
  const isMatch = await bcrypt.compare(canditatePassword, this.password);
  return isMatch;
};

const UserModel = mongoose.model("User", userSchema);

module.exports = { UserModel };
