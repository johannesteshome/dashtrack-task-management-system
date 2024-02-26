const projectController = require("../controller/project.controller");
const { authenticateUser } = require("../middlewares/authentication");

const router = require("express").Router();

router.post("/create", authenticateUser, projectController.create);
router.get("/allProjects", projectController.getAll);
router.get("/userProjects", authenticateUser, projectController.getMyProjects);
router.get("/getOne/:id", authenticateUser, projectController.getProject);
router.put("/update/:id", authenticateUser, projectController.updateProject);
router.delete("/delete/:id", authenticateUser, projectController.deleteProject);
router.put("/:id/addTeam", authenticateUser, projectController.addTeam);
router.put("/:id/inviteUsers", authenticateUser, projectController.inviteUsers);
router.put(
	"/acceptInvitation",
	authenticateUser,
	projectController.acceptInviation
);
router.put("/:id/removeUser", authenticateUser, projectController.removeUser);

module.exports = router;
