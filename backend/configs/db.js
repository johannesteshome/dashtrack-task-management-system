const mongoose = require("mongoose");
const configs = require("./configs");

const connection = mongoose.connect(configs.dbURL);

module.exports = { connection };
