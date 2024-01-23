const { StatusCodes } = require("http-status-codes");
const { UserModel } = require("../../models/User.model");
const { TeacherDataModel } = require("../../models/TeacherData.model");

const allTeachers = async (req, res) => {
  try {
    const teachers = await UserModel.find({ role: "teacher" });
    if (!teachers) {
      res
        .status(StatusCodes.NOT_FOUND)
        .send({ message: "Students not found", success: false });
    }
    const teachersList = [];

    for (teacher of teachers) {
      const teacherData = await TeacherDataModel.findOne({
        userId: teacher._id,
      })
        .populate("courses.course", "courseTitle courseCode creditHour")
        .populate("courses.students.department", "name");
      teachersList.push({
        ...teacher._doc,
        ...teacherData._doc,
        _id: teacher._id,
        teacherDataId: teacherData._id,
      });
    }

    res.status(StatusCodes.OK).send(teachersList);
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.BAD_REQUEST).send({ error: "Something went wrong" });
  }
};

const getTeacher = async (req, res) => {
  const id = req.params.teacherId;

  try {
    const teacher = await UserModel.findOne({ _id: id, role: "teacher" });

    if (!teacher) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .send({ message: "User not found" });
    }

    const teacherData = await TeacherDataModel.findOne({ userId: id })
      .populate("courses.course", "courseTitle courseCode creditHour")
      .populate("courses.students.department", "name");
    console.log(teacher, "teacher", teacherData, "teacherData");

    const teachData = {
      ...teacher._doc,
      ...teacherData._doc,
      _id: teacher._id,
      teacherDataId: teacherData._id,
    };

    res.status(StatusCodes.OK).send(teachData);
  } catch (error) {
    console.error("Error:", error.message);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send({ message: "Server Error" });
  }
};

const updateTeacher = async (req, res) => {
  const id = req.params.teacherId;
  const payload = req.body;
  const { courses, isAdmin } = req.body;
  try {
    const teacher = await UserModel.findByIdAndUpdate({ _id: id }, payload);

    if (!teacher) {
      res
        .status(StatusCodes.NOT_FOUND)
        .send({ message: `teacher not found`, success: false });
    }
    const teacherData = await TeacherDataModel.findOneAndUpdate(
      { userId: id },
      { courses, isAdmin }
    );
    res
      .status(StatusCodes.OK)
      .send({ message: `teacher updated`, success: true });
  } catch (error) {
    console.log(error);
    res
      .status(StatusCodes.BAD_REQUEST)
      .send({
        error: "Something went wrong, unable to Update.",
        success: false,
      });
  }
};

const deleteAllTeachers = async (req, res) => {
  try {
    await UserModel.deleteMany({ role: "teacher" });
    await TeacherDataModel.deleteMany();
    res.status(StatusCodes.OK).send("All teachers deleted");
  } catch (error) {
    console.error("Error:", error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
  }
};

const deleteTeacher = async (req, res) => {
  const id = req.params.teacherId;
  try {
    const teacher = await UserModel.findByIdAndDelete({ _id: id });
    if (!teacher) {
      res
        .status(StatusCodes.NOT_FOUND)
        .send({ msg: `teacher with id ${id} not found` });
    }
    res.status(StatusCodes.OK).send(`teacher with id ${id} deleted`);
  } catch (error) {
    console.log(error);
    res
      .status(StatusCodes.BAD_REQUEST)
      .send({ error: "Something went wrong, unable to Delete." });
  }
};

module.exports = {
  allTeachers,
  getTeacher,
  updateTeacher,
  deleteAllTeachers,
  deleteTeacher,
};
