const mongoose = require("mongoose");

const catchAsync = (fn) => {
	return async (req, res, next) => {
		try {
			await fn(req, res, next);
			console.log("Transaction Committed");
		} catch (error) {
			console.log("Transaction Aborted");
			next(error);
		} finally {
			console.log("Session Ended");
		}
	};
};

module.exports = { catchAsync };
