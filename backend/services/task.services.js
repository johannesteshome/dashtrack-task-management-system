const { TaskModel } = require("../models/task.model");

const create = async (data) => {
	return await TaskModel.create(data);
};

const findMany = async (query, offset, limit) => {
	return await TaskModel.find(query).skip(offset).limit(limit);
};

const findOne = async (query) => {
	return await TaskModel.findOne(query);
};

const update = async (id, data) => {
	return await TaskModel.findByIdAndUpdate(
		id,
		{ $set: data },
		{ new: true, runValidators: true }
	);
};

const exists = async (query) => {
	return await TaskModel.exists(query);
};

// const countDocuments = async () => {
// 	return await TaskModel.
// }

module.exports = {
	create,
	findMany,
	findOne,
	update,
	exists,
};
