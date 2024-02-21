const { Schema, Mongoose } = require("mongoose");
const { UserModel } = require("./user.model");
const { TeamModel } = require("./team.model");

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
				performance: {
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

const ProjectModel = Mongoose.model("Project", projectSchema);

module.exports = { ProjectModel };
