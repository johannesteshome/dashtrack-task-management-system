const { StatusCodes } = require("http-status-codes");
const { UserModel } = require("../../models/User.model");
const { StudentDataModel } = require("../../models/StudentData.model");

const allStudents = async (req, res) => {
  try {
    const students = await UserModel.find({ role: "student" });
    console.log(students);
    if (!students) {
      res.status(StatusCodes.NOT_FOUND).send({ msg: "Students not found" });
    }
    const studentsList = [];

    for (student of students) {
      const studentData = await StudentDataModel.findOne({
        userId: student._id,
      });
      studentsList.push({
        ...student._doc,
        ...studentData._doc,
        _id: student._id,
        studentDataId: studentData._id,
      });
    }

    res.status(StatusCodes.OK).send(studentsList);
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.BAD_REQUEST).send({ error: "Something went wrong" });
  }
};

const getStudent = async (req, res) => {
  const id = req.params.studentId;
  console.log(id);

  try {
    const student = await UserModel.findOne({ _id: id });
    const studentData = await StudentDataModel.findOne({ userId: id });
    console.log(student, studentData);

    const studData = {
      ...student._doc,
      ...studentData._doc,
      _id: student._id,
      studentDataId: studentData._id,
    };

    if (!student) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .send({ message: "User not found" });
    }

    res.status(StatusCodes.OK).send(studData);
  } catch (error) {
    console.error("Error:", error.message);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send({ message: "Server Error" });
  }
};

const updateStudent = async (req, res) => {
  const id = req.params.studentId;
  const payload = req.body;
  const { section, studentID, department, year, courses } = req.body;
  try {
    const student = await UserModel.findByIdAndUpdate({ _id: id }, payload);
    if (!student) {
      res.status(StatusCodes.NOT_FOUND).send({ message: `Student Not Found!` });
    }
    const studentData = await StudentDataModel.findOneAndUpdate(
      { userId: id },
      { section, studentID, department, year, courses }
    );
    res.status(StatusCodes.OK).send({ message: `Student Updated!` });
  } catch (error) {
    console.log(error);
    res
      .status(StatusCodes.BAD_REQUEST)
      .send({ message: "Something went wrong, unable to Update." });
  }
};

const deleteAllStudents = async (req, res) => {
  try {
    await UserModel.deleteMany({ role: "student" });
    await StudentDataModel.deleteMany();
    res.status(StatusCodes.OK).send("All students deleted");
  } catch (error) {
    console.error("Error:", error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
  }
};

const deleteStudent = async (req, res) => {
  const id = req.params.studentId;
  try {
    const student = await UserModel.findByIdAndDelete({ _id: id });
    if (!student) {
      res
        .status(StatusCodes.NOT_FOUND)
        .send({ msg: `student with id ${id} not found` });
    }
    res.status(StatusCodes.OK).send(`student with id ${id} deleted`);
  } catch (error) {
    console.log(error);
    res
      .status(StatusCodes.BAD_REQUEST)
      .send({ error: "Something went wrong, unable to Delete." });
  }
};

module.exports = {
  allStudents,
  getStudent,
  updateStudent,
  deleteAllStudents,
  deleteStudent,
};
