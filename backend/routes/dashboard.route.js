const { authenticateUser } = require("../middlewares/authentication");
const { ProjectModel } = require("../models/project.model");
const { UserModel } = require("../models/user.model");
const teamServices = require("../services/team.services");

const router = require("express").Router();

router.get("/", authenticateUser, async (req, res) => {
	try {
		const teams = await teamServices.teamsOfUser(req.user._id);
		console.log(teams);
		const user = await UserModel.findById(req.user._id);
		const projects = await ProjectModel.countDocuments({
			$or: [{ createdBy: user._id }, { members: { $in: [user._id] } }],
		});

		var tasks = 0;

		for (let team of teams) {
			for (let task of team.tasks) {
				if (task.assignee == user.name) {
					tasks++;
				}
			}
		}

		res.status(200).json({ tasks, teams: teams.length, projects });
	} catch (error) {
		console.log(error);
		res.status(500).send(error);
	}
});

module.exports = router;
