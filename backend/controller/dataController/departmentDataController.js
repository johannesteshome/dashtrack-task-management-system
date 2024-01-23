const { StatusCodes } = require("http-status-codes");
const { DepartmentModel } = require("../../models/Department.model");

const allDepartments = async (req, res) => {
  try {
    const departments = await DepartmentModel.find();
    res.status(StatusCodes.OK).send(departments);
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.BAD_REQUEST).send({ error: "Something went wrong" });
  }
};

const getDepartment = async (req, res) => {
  const { id } = req.params;

  try {
    const department = await DepartmentModel.findById(id)

    if (!department) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .send({ message: "department not found" });
    }

    res.status(StatusCodes.OK).send(department);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
  }
};

const addDepartment = async (req, res) => {
  const { name } = req.body;

  try {
    const department = await DepartmentModel.findOne({ name });
    if (department) {
      return res.send({
        message: "department already exists",
      });
    }

    let value = new DepartmentModel(req.body);
    await value.save();
    const data = await DepartmentModel.findOne({ name });
    return res.send({ data, message: "department created" });
  } catch (error) {
    res.send({ message: "error" });
  }
};

const updateDepartment = async (req, res) => {
  const id = req.params.departmentId;
  const payload = req.body;
  try {
    const department = await DepartmentModel.findByIdAndUpdate({ _id: id }, payload);
    if (!department) {
      res
        .status(StatusCodes.NOT_FOUND)
        .send({ msg: `department with id ${id} not found` });
    }
    res.status(StatusCodes.OK).send(`department with id ${id} updated`);
  } catch (error) {
    console.log(error);
    res
      .status(StatusCodes.BAD_REQUEST)
      .send({ error: "Something went wrong, unable to Update." });
  }
};

const deleteAllDepartments = async (req, res) => {
  try {
    await DepartmentModel.deleteMany();
    res.status(StatusCodes.OK).send("All departments deleted");
  } catch (error) {
    console.error("Error:", error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
  }
};

const deleteDepartment = async (req, res) => {
  const id = req.params.departmentId;
  try {
    const department = await DepartmentModel.findByIdAndDelete({ _id: id });
    if (!department) {
      res
        .status(StatusCodes.NOT_FOUND)
        .send({ msg: `department with id ${id} not found` });
    }
    res.status(StatusCodes.OK).send(`department with id ${id} deleted`);
  } catch (error) {
    console.log(error);
    res
      .status(StatusCodes.BAD_REQUEST)
      .send({ error: "Something went wrong, unable to Delete." });
  }
};

module.exports = {
  allDepartments,
  getDepartment,
  addDepartment,
  updateDepartment,
  deleteAllDepartments,
  deleteDepartment,
};
