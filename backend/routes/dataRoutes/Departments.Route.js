const express = require("express");
const router = express.Router();
const {
  allDepartments,
  getDepartment,
  updateDepartment,
  addDepartment,
  deleteAllDepartments,
  deleteDepartment,
} = require("../../controller/dataController/departmentDataController");
const {
  authenticateUser,
  authorizePermissions,
} = require("../../middlewares/authentication");
const { logActivity } = require("../../middlewares/log");

router.get("/", authenticateUser, allDepartments);
router.get("/:departmentId", authenticateUser, getDepartment);
router.post(
  "/add",
  authenticateUser,
  authorizePermissions("admin"),
  logActivity("Added New Department"),
  addDepartment
);
router.patch(
  "/:departmentId",
  authenticateUser,
  authorizePermissions("admin"),
  logActivity("Updated Department"),
  updateDepartment
);
router.delete(
  "/all",
  authenticateUser,
  authorizePermissions("admin"),
  logActivity("Deleted All Departments"),
  deleteAllDepartments
);
router.delete(
  "/:departmentId",
  authenticateUser,
  authorizePermissions("admin"),
  logActivity("Deleted Department"),
  deleteDepartment
);

module.exports = router;
