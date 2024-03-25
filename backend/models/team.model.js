const { Schema, model } = require("mongoose");
const { UserModel } = require("./User.model");
const { TaskModel } = require("./task.model");
const { TEAM_MEMBER_ROLES } = require("../constants/constants");

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
				type: Schema.Types.ObjectId,
				ref: UserModel,
				// role: {
				// 	type: String,
				// 	enum: TEAM_MEMBER_ROLES,
				// 	default: TEAM_MEMBER_ROLES.MEMBER,
				// },
			},
		],
		tasks: [],
		chats: [
			
		],
		createdBy: {
			type: Schema.Types.ObjectId,
			ref: UserModel,
			required: true,
		},
	},
	{ timestamps: true }
);

teamSchema.post("findByIdAndDelete", async (doc) => {
	await TaskModel.deleteMany({ _id: { $in: doc.tasks } });
});

const TeamModel = model("Team", teamSchema);

module.exports = { TeamModel };
