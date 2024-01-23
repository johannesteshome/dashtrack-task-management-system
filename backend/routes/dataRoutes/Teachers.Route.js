const express = require("express");
const router = express.Router();
const {
  allTeachers,
  getTeacher,
  updateTeacher,
  deleteAllTeachers,
  deleteTeacher,
} = require("../../controller/dataController/teacherDataController");
const {
  authenticateUser,
  authorizePermissions,
} = require("../../middlewares/authentication");
const { logActivity } = require("../../middlewares/log");

router.get("/", authenticateUser, allTeachers);
router.get(
  "/:teacherId",
  authenticateUser,
  getTeacher
);
router.patch(
  "/:teacherId",
  authenticateUser,
  logActivity("Updated Profile"),
  updateTeacher
);
router.delete(
  "/all",
  authenticateUser,
  authorizePermissions("admin"),
  logActivity("Deleted All Teachers"),
  deleteAllTeachers
);
router.delete(
  "/:teacherId",
  authenticateUser,
  authorizePermissions("admin"),
  logActivity("Deleted Teacher"),
  deleteTeacher
);

module.exports = router;
