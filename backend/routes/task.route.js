const taskController = require("../controller/task.controller");
const { authenticateUser } = require("../middlewares/authentication");

const router = require("express").Router();

router.post("/create", authenticateUser, taskController.createTask);
router.get("/userTasks", authenticateUser, taskController.getUserTasks);
router.get("/getOne/:id", authenticateUser, taskController.getTask);
router.get("/teamTasks/:teamId", authenticateUser, taskController.getTeamTasks);
router.put(
	"/teamTasks/:teamId",
	authenticateUser,
	taskController.replaceAllTasks
);
router.put("/update/:id", authenticateUser, taskController.updateTask);
router.delete("/delete/:id", authenticateUser, taskController.deleteTask);
router.put("/setReminder/:id", authenticateUser, taskController.setReminder);
router.put(
	"/updateProgress/:id",
	authenticateUser,
	taskController.updateProgress
);

module.exports = router;
