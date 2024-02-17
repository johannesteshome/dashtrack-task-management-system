const { Schema, model } = require("mongoose");
const { UserModel } = require("./user.model");
const { ProjectModel } = require("./project.model");

const teamSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		members: [
			{
				member: {
					type: Schema.Types.ObjectId,
					ref: UserModel,
				},
				role: {
					type: String,
					enum: TEAM_MEMBER_ROLES,
					default: TEAM_MEMBER_ROLES.MEMBER,
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

const TeamModel = model("Team", teamSchema);

module.exports = { TeamModel };
