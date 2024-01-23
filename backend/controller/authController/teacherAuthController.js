const { AdminModel } = require("../../models/Admin.model");
const { TokenModel } = require("../../models/Token.model");
const { OTPModel } = require("../../models/OTP.model");
const { StatusCodes } = require("http-status-codes");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const axios = require("axios")
const {
  attachCookiesToResponse,
  createTokenUser,
  sendVerificationEmail,
  sendResetPasswordEmail,
} = require("../../utils/");
const { TeacherModel } = require("../../models/Teacher.model");
const { StudentModel } = require("../../models/Student.model");

const generator = require("generate-password");

const origin = 'http://localhost:3000'

const register = async (req, res) => {
  const password = generator.generate({
    length: 10,
    numbers: true
  })
  const { token, email, name, mobile, gender, age } = req.body;
  try {

    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=6LcWdU8pAAAAAACjGfKHyYwhbXbXVITsjEdTnXNP&response=${token}`
    );

    if (!response.data.success) {
      return res.status(500).send({ message: "Error Verifying Captcha." });
    }

    const teacherExists = await TeacherModel.findOne({ email });
    const inStudent = await StudentModel.findOne({ email });
    const inAdmin = await AdminModel.findOne({ email });
    if (teacherExists) {
      return res.send({
        message: "Teacher already exists",
      });
    }

    if (inStudent || inAdmin) {
      return res.send({
        message: "Person already registerd as Student or Admin",
      });
    }

    const verificationToken = crypto.randomBytes(40).toString("hex");

    const teacher = await TeacherModel.create({
      email,
      password,
      name,
      verificationToken,
      mobile,
      gender,
      age,
    });

    await sendVerificationEmail({ name, email, token: verificationToken, password, origin, role:'teacher' });

    res.status(StatusCodes.CREATED).json({
      success: true,
      message:
        "Teacher created successfully. Please check your email for verification",
    });
  } catch (error) {
    console.log(error);
    res.send({ message: error });
  }
};

const sendOTP = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Please provide email and password" });
  }

  const teacher = await TeacherModel.findOne({ email });

  if (!teacher) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "No Such User" });
  }

  const isPasswordCorrect = await teacher.comparePassword(password);

  if (!isPasswordCorrect) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Password is Incorrect" });
  }

  if (!teacher.isVerified) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Please verify your email first" });
  }

  const otpExists = await OTPModel.findOne({ email });

  if (otpExists) {
    await OTPModel.findOneAndDelete({ email });
  }

  const newOTP = new OTPModel({ email });
  console.log(newOTP);

  await newOTP.save();
  return res
    .status(StatusCodes.OK)
    .json({ success: true, message: "OTP sent" });
}

const login = async (req, res) => {
  
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Please provide email and otp" });
  }

  const teacher = await TeacherModel.findOne({ email });

  if (!teacher) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "No Such User" });
  }

  const otpExists = await OTPModel.findOne({ email });

  if (!otpExists) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "No such OTP sent for this account" });
  }

  if (!bcrypt.compare(otp, otpExists.otp)) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Please Verify with valid OTP" });
  }

  const tokenUser = createTokenUser(teacher);

  let refreshToken = "";

  const existingToken = await TokenModel.findOne({ user: teacher._id });

  if (existingToken) {
    const { isValid } = existingToken;

    if (!isValid) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Invalid token" });
    }

    refreshToken = existingToken.refreshToken;
    attachCookiesToResponse({ res, user: tokenUser, refreshToken });
    res.status(StatusCodes.OK).json({ user: tokenUser });
    return;
  }

  refreshToken = crypto.randomBytes(40).toString("hex");
  const userAgent = req.headers["user-agent"];
  const ip = req.ip;
  const userToken = { refreshToken, ip, userAgent, user: teacher._id };

  await TokenModel.create(userToken);
  attachCookiesToResponse({ res, user: tokenUser, refreshToken });

  res.status(StatusCodes.OK).json({ user: tokenUser });
};

const verifyEmail = async (req, res) => {
  const { verificationToken, email } = req.body;
  const teacher = await TeacherModel.findOne({ email });

  if (!teacher) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Verification Failed" });
  }

  if (teacher.verificationToken !== verificationToken) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Verification Failed" });
  }

  teacher.isVerified = true;
  teacher.verified = Date.now();
  teacher.verificationToken = "";

  await teacher.save();

  res.status(StatusCodes.OK).json({ success: true, message: "Email verified" });
};

const logout = async (req, res) => {
  await TokenModel.findOneAndDelete({ user: req.user._id });
  res.cookie("accessToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.cookie("refreshToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ msg: "user logged out!" });
};

const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const id = req.params.teacherId;

  if (!oldPassword || !newPassword) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Please provide new and old passwords" });
  }

  const teacher = await TeacherModel.findOne({ _id: id });

  if (!teacher) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "No Such User" });
  }

  const isMatch = await bcrypt.compare(oldPassword, teacher.password);

  if (!isMatch) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: "Old password is incorrect",
    });
  }

  teacher.password = newPassword;

  await teacher.save();

  return res
    .status(StatusCodes.OK)
    .json({ success: true, message: "Password changed successfully" });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  
  console.log(req.body);
  if (!email) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Please provide valid email" });
  }

  const teacher = await TeacherModel.findOne({ email });

  if (teacher) {
    const passwordToken = crypto.randomBytes(70).toString("hex");

    await sendResetPasswordEmail({
      name: teacher.name,
      email: teacher.email,
      token: passwordToken,
      role: 'teacher',
      origin
    });

    const tenMinutes = 1000 * 60 * 10;
    const passwordTokenExpirationDate = new Date(Date.now() + tenMinutes);

    teacher.passwordToken = passwordToken;
    teacher.passwordTokenExpirationDate = passwordTokenExpirationDate;
    await teacher.save();
  }

  res
    .status(StatusCodes.OK)
    .json({ msg: "Please check your email for reset password link" });
};

const resetPassword = async (req, res) => {
  const { token, email, password } = req.body;
  if (!token || !email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Please provide all fields" });
  }

  const teacher = await TeacherModel.findOne({ email });

  if (teacher) {
    const currentDate = new Date();

    if (
      teacher.passwordToken === token &&
      teacher.passwordTokenExpirationDate > currentDate
    ) {
      teacher.password = password;
      teacher.passwordToken = null;
      teacher.passwordTokenExpirationDate = null;
      await teacher.save();
    }
  }

  res.send("reset password");
};

module.exports = {
  register,
  sendOTP,
  login,
  changePassword,
  forgotPassword,
  resetPassword,
  verifyEmail,
  logout,
};
