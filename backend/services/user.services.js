const { UserModel } = require("../models/User.model");

const create = async (data, session) => {
	return await UserModel.create(data);
};

const findOne = async (query) => {
	return await UserModel.findOne(query);
};

const findById = async (id) => {
	return await UserModel.findById(id);
};

const findMany = async (query, offset, limit) => {
	return await UserModel.find(query)
		.skip(offset)
		.limit(limit)
		.select("-password");
};

const update = async (id, data) => {
	return await UserModel.findByIdAndUpdate(
		id,
		{ $set: data },
		{
			new: true,
			runValidators: true,
		}
	);
};

const deleteOne = async (id) => {
	return await UserModel.findByIdAndDelete(id);
};

module.exports = {
	create,
	findOne,
	findById,
	findMany,
	update,
	deleteOne,
};
