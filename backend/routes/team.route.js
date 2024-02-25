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

module.exports = router;
