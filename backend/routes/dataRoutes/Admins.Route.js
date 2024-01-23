const express = require("express");
const {
  allAdmins,
  getAdmin,
  updateAdmin,
  deleteAllAdmins,
  deleteAdmin,
} = require("../../controller/dataController/adminDataController");
const {
  authenticateUser,
  authorizePermissions,
} = require("../../middlewares/authentication");
const { logActivity } = require("../../middlewares/log");
const router = express.Router();

router.get("/", authenticateUser, authorizePermissions("admin"), allAdmins);
router.get(
  "/:adminId",
  authenticateUser,
  authorizePermissions("admin"),
  getAdmin
);
router.patch(
  "/:adminId",
  authenticateUser,
  authorizePermissions("admin"),
  logActivity("Updated Profile"),
  updateAdmin
);
router.delete(
  "/all",
  authenticateUser,
  authorizePermissions("admin"),
  logActivity("Deleted All Admins"),
  deleteAllAdmins
);
router.delete(
  "/:adminId",
  authenticateUser,
  authorizePermissions("admin"),
  logActivity("Deleted Admin"),
  deleteAdmin
);

module.exports = router;
