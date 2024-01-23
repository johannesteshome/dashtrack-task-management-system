const express = require("express");
const router = express.Router();
const {
  allCourses,
  getCourse,
  updateCourse,
  addCourse,
  deleteAllCourses,
  courseAssignment,
  deleteCourse,
} = require("../../controller/dataController/courseDataController");
const {
  authenticateUser,
  authorizePermissions,
} = require("../../middlewares/authentication");
const { logActivity } = require("../../middlewares/log");

router.get("/", authenticateUser, allCourses);
router.get("/:id", authenticateUser, getCourse);
router.post(
  "/add",
  authenticateUser,
  authorizePermissions("admin"),
  logActivity("Added New Course"),
  addCourse
);
router.patch(
  "/:courseId",
  authenticateUser,
  authorizePermissions("admin"),
  logActivity("Updated Course"),
  updateCourse
);
router.patch(
  "/:courseId/assign",
  authenticateUser,
  authorizePermissions("admin"),
  logActivity("Assigned Course"),
  courseAssignment
);
router.delete(
  "/all",
  authenticateUser,
  authorizePermissions("admin"),
  logActivity("Deleted All Courses"),
  deleteAllCourses
);
router.delete(
  "/:courseId",
  authenticateUser,
  authorizePermissions("admin"),
  logActivity("Deleted Course"),
  deleteCourse
);

module.exports = router;
