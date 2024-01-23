const express = require("express");
const router = express.Router();
const {
  allStudents,
  getStudent,
  updateStudent,
  deleteAllStudents,
  deleteStudent,
} = require("../../controller/dataController/studentDataController");
const {
  authenticateUser,
  authorizePermissions,
} = require("../../middlewares/authentication");
const { logActivity } = require("../../middlewares/log");

router.get("/", authenticateUser, allStudents);
router.get(
  "/:studentId",
  authenticateUser,
  getStudent
);
router.patch(
  "/:studentId",
  authenticateUser,
  logActivity("Updated Profile"),
  updateStudent
);
router.delete(
  "/all",
  authenticateUser,
  authorizePermissions("admin"),
  logActivity("Deleted All Students"),
  deleteAllStudents
);
router.delete(
  "/:studentId",
  authenticateUser,
  authorizePermissions("admin"),
  logActivity("Deleted Student"),
  deleteStudent
);

module.exports = router;
