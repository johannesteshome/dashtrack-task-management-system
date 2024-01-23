const express = require("express");
const router = express.Router();
const {getCourseAttendance, getStudentAttendance, markAttendance, allAttendance, deleteAllAttendance, deleteAttendance, getTeacherAttendance} = require("../../controller/dataController/attendanceDataController");

router.get("/", allAttendance);
router.get("/student/:studentId", getStudentAttendance);
router.get("/course/:courseId", getCourseAttendance);
router.get("/teacher/:teacherId", getTeacherAttendance);
router.post("/mark", markAttendance);
router.delete("/all", deleteAllAttendance);
router.delete("/:attendanceId", deleteAttendance);

module.exports = router;
