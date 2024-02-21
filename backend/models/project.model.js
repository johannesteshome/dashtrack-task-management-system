const { Schema, model } = require("mongoose");
const { UserModel } = require("./user.model");
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
		teams: [
			{
				type: Schema.Types.ObjectId,
				ref: TeamModel,
			},
		],
		users: [
			{
				user: {
					type: Schema.Types.ObjectId,
					ref: UserModel,
				},
				permissions: {
					type: [String],
					enum: USER_PERMISSIONS,
					default: [USER_PERMISSIONS.READ],
				},
				isInvitationAccepted: {
					type: Boolean,
					default: false,
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

const ProjectModel = model("Project", projectSchema);

module.exports = { ProjectModel };
