const express = require("express");
const router = express.Router();

const {
  register,
  login,
  logout,
  verifyEmail,
  changePassword,
  forgotPassword,
  resetPassword,
  sendOTP,
} = require("../../controller/authController/studentAuthController");
const { authenticateUser } = require("../../middlewares/authentication");

router.post("/register", register);
router.post("/login", sendOTP);
router.post("/login-otp", login);
router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/change-password/:studentId", authenticateUser, changePassword);
router.delete("/logout", authenticateUser, logout);

module.exports = router;
