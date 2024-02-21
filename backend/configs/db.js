const mongoose = require("mongoose");
const configs = require("./configs");

mongoose.set("debug", true);
mongoose.set("strictQuery", true);
const connection = mongoose.connect(configs.dbURL);

module.exports = { connection };
