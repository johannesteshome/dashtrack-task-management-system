const { Schema, model } = require("mongoose");
const { UserModel } = require("./User.model");
const { TeamModel } = require("./team.model");
const { USER_PERMISSIONS } = require("../constants/constants");

const projectSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		chats: [
			{
				sender: {
					type: String,
					required: true,
				},
				message: {
					type: String,
					required: true,
				},
				createdAt: {
					type: Date,
					default: Date.now,
				},
			},
		],
		teams: [
			{
				type: Schema.Types.ObjectId,
				ref: TeamModel,
			},
		],
		members: [
			{
				user: {
					type: Schema.Types.ObjectId,
					ref: UserModel,
					unique: true,
				},
				permissions: {
					type: [String],
					enum: USER_PERMISSIONS,
					default: [USER_PERMISSIONS.READ],
				},
			},
		],
		createdBy: {
			type: Schema.Types.ObjectId,
			ref: UserModel,
			required: true,
		},
	},
	{ timestamps: true }
);

projectSchema.post("remove", async function (project) {
	await TeamModel.deleteMany({ _id: { $in: project.teams } });
});

projectSchema.post("findOneAndDelete", async function (project) {
	await TeamModel.deleteMany({ _id: { $in: project.teams } });
});

projectSchema.post("deleteOne", async function (project) {
	await TeamModel.deleteMany({ _id: { $in: project.teams } });
});

projectSchema.methods.removeTeam = async function (teamId) {
	this.teams.pull(teamId);
	await TeamModel.findByIdAndDelete({ _id: teamId });
	await this.save();
};

const ProjectModel = model("Project", projectSchema);

module.exports = { ProjectModel };
