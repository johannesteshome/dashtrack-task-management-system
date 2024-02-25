const { Schema, model } = require("mongoose");
const { TASK_STATUS, TASK_PRIORITY } = require("../constants/constants");
const { UserModel } = require("./user.model");

const taskSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		dueDate: {
			type: Date,
			required: true,
		},
		reminderDate: {
			type: Date,
		},
		priority: {
			type: String,
			required: true,
			enum: TASK_PRIORITY,
			default: TASK_PRIORITY.LOW,
		},
		assignedTo: {
			type: Schema.Types.ObjectId,
			ref: UserModel,
			required: true,
		},
		createdBy: {
			type: Schema.Types.ObjectId,
			ref: UserModel,
			required: true,
		},
		status: {
			type: String,
			default: TASK_STATUS.PENDING,
			enum: TASK_STATUS,
		},
	},
	{ timestamps: true }
);

const TaskModel = model("Task", taskSchema);

module.exports = { TaskModel };
