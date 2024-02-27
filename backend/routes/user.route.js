const userController = require("../controller/user.controller");

const express = require("express");
const { authenticateUser } = require("../middlewares/authentication");
const router = express.Router();

router.get("/allUsers", userController.getAllUsers);
router.get("/filteredUsers", userController.fileterUsers);
router.get("/getOne/:id", authenticateUser, userController.getUser);
router.put("/update/:id", authenticateUser, userController.updateUser);
router.delete("/delete/:id", authenticateUser, userController.deleteUser);

module.exports = router;
