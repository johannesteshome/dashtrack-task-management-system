const { StudentModel } = require("../../models/Student.model");
const { TeacherModel } = require("../../models/Teacher.model");
const { AdminModel } = require("../../models/Admin.model");
const { TokenModel } = require("../../models/Token.model");
const { StatusCodes } = require("http-status-codes");
const axios = require('axios')
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const {
  attachCookiesToResponse,
  createTokenUser,
  sendVerificationEmail,
  sendResetPasswordEmail,
} = require("../../utils/");
const { OTPModel } = require("../../models/OTP.model");
const generator = require("generate-password");

const origin = "http://localhost:3000";

const register = async (req, res) => {

  const password = generator.generate({
    length: 10,
    numbers: true
  })

  const { token, email, name, department, studentID, section, mobile, gender, age, year } = req.body;
  try {
      
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=6LcWdU8pAAAAAACjGfKHyYwhbXbXVITsjEdTnXNP&response=${token}`
    );

    if (!response.data.success) {
      return res.status(500).send({ message: "Error Verifying Captcha." });
    }

      const studentEmailExists = await StudentModel.findOne( {email} );
      const studentIDExists = await StudentModel.findOne({ studentID });
    if (studentEmailExists) {
      return res.status(StatusCodes.CONFLICT).send({
        message: "Student email already exists",
      })
    }

    if (studentIDExists) {
      return res.status(StatusCodes.CONFLICT).send({
        message: "Student ID already exists",
      });
    }

      const inTeacher = await TeacherModel.findOne({ email });
      const inAdmin = await AdminModel.findOne({ email });
    if (inTeacher || inAdmin) {
      return res.status(StatusCodes.CONFLICT).send({
        message: "Person already registerd as Teacher or Admin",
      });
    }

    const verificationToken = crypto.randomBytes(40).toString("hex");

    const student = await StudentModel.create({
      email,
      password,
      name,
      department,
      studentID,
      verificationToken,
      section,
      mobile,
      gender,
      age,
      year,
    });

    await sendVerificationEmail({ name, email, token: verificationToken, origin, password, role: 'student' });

    res.status(StatusCodes.CREATED).json({
      success: true,
      message:
        "Student created successfully. Please check your email for verification",
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

  const student = await StudentModel.findOne({ email });

  if (!student) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "No Such User" });
  }

  const isPasswordCorrect = await student.comparePassword(password);

  if (!isPasswordCorrect) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Password is Incorrect" });
  }

  if (!student.isVerified) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Please verify your email first" });
  }

  const otpExists = await OTPModel.findOne({ email })
  
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

  const student = await StudentModel.findOne({ email });

  if (!student) {
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


  const tokenUser = createTokenUser(student);

  let refreshToken = "";

  const existingToken = await TokenModel.findOne({ user: student._id });

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
  const userToken = { refreshToken, ip, userAgent, user: student._id };

  await TokenModel.create(userToken);
  attachCookiesToResponse({ res, user: tokenUser, refreshToken });

  res.status(StatusCodes.OK).json({ user: tokenUser });
};

const verifyEmail = async (req, res) => {
  const { verificationToken, email } = req.body;
  const student = await StudentModel.findOne({ email });

  if (!student) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Verification Failed" });
  }

  if (student.verificationToken !== verificationToken) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Verification Failed" });
  }

  student.isVerified = true;
  student.verified = Date.now();
  student.verificationToken = "";

  await student.save();

  res.status(StatusCodes.OK).json({ success: true, message: "Email verified" });
};

const logout = async (req, res) => {
  console.log(req.user._id);
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
  const id = req.params.studentId;

  if (!oldPassword || !newPassword) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Please provide new and old passwords" });
  }

  const student = await StudentModel.findOne({ _id: id });

  if (!student) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "No Such User" });
  }

  const isMatch = await bcrypt.compare(oldPassword, student.password);

  if (!isMatch) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: "Old password is incorrect",
    });
  }

  student.password = newPassword;

  await student.save();

  return res
    .status(StatusCodes.OK)
    .json({ success: true, message: "Password changed successfully" });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Please provide valid email" });
  }

  const student = await StudentModel.findOne({ email });

  if (student) {
    const passwordToken = crypto.randomBytes(70).toString("hex");

    await sendResetPasswordEmail({
      name: student.name,
      email: student.email,
      token: passwordToken,
      role: 'student',
      origin
    });

    const tenMinutes = 1000 * 60 * 10;
    const passwordTokenExpirationDate = new Date(Date.now() + tenMinutes);

    student.passwordToken = passwordToken;
    student.passwordTokenExpirationDate = passwordTokenExpirationDate;
    await student.save();
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

  const student = await StudentModel.findOne({ email });
  console.log(student);

  if (student) {
    const currentDate = new Date();

    if (
      student.passwordToken === token &&
      student.passwordTokenExpirationDate > currentDate
    ) {
      console.log("here");
      student.password = password;
      student.passwordToken = null;
      student.passwordTokenExpirationDate = null;
      await student.save();
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
