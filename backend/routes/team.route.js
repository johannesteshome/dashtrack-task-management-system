const teamController = require("../controller/team.controller");
const { authenticateUser } = require("../middlewares/authentication");
const router = require("express").Router();

router.get("/allTeams", teamController.getAllTeams);
router.get("/userTeams", authenticateUser, teamController.findMany);
router.get("/getOne/:id", authenticateUser, teamController.findOne);
router.put("/update/:id", authenticateUser, teamController.update);
router.put("/addMembers/:id", authenticateUser, teamController.addMembers);
router.put(
	"/removeMembers/:id",
	authenticateUser,
	teamController.removeMembers
);
router.put("/addChat/:teamId", authenticateUser, teamController.appendChat);
router
	.route("/getAllChat/:teamId")
	.get(authenticateUser, teamController.getAllChat);

module.exports = router;
