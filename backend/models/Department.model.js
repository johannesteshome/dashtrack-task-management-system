const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

const DepartmentModel = mongoose.model("departments", departmentSchema);

module.exports = { DepartmentModel };
