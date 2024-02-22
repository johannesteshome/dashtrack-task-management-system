const express = require("express");
const router = express.Router();

const {
	register,
	login,
	logout,
	verifyEmail,
	forgotPassword,
	resetPassword,
	sendOTP,
	changePassword,
} = require("../controller/auth.controller");
const { authenticateUser } = require("../middlewares/authentication");
const { logActivity } = require("../middlewares/log");
const { upload } = require("../middlewares/fileUpload");

router.post(
	"/register",
	logActivity("Registered New User"),
	upload.single("image"),
	register
);

router.post("/login", sendOTP);
router.post("/login-otp", logActivity("Logged In"), login);
router.put("/verify-email", logActivity("Verified Email"), verifyEmail);

router.post("/forgot-password", logActivity("Forgot Password"), forgotPassword);
router.post("/reset-password", logActivity("Reset Password"), resetPassword);
router.post(
	"/change-password/:userId",
	authenticateUser,
	logActivity("Changed Password"),
	changePassword
);
router.delete("/logout", authenticateUser, logActivity("Logged Out"), logout);

module.exports = router;
