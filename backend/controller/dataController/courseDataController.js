const { StatusCodes } = require("http-status-codes");
const { CourseModel } = require("../../models/Course.model");
const { TeacherModel } = require("../../models/Teacher.model");
const { DepartmentModel } = require("../../models/Department.model");
const { StudentModel } = require("../../models/Student.model");
const { UserModel } = require("../../models/User.model");
const { StudentDataModel } = require("../../models/StudentData.model");
const { TeacherDataModel } = require("../../models/TeacherData.model");

const allCourses = async (req, res) => {
  try {
    // const courses = await CourseModel.find().populate("teacher", "name");
    const courses = await CourseModel.find()
      .populate("assignment.teacher", "name")
      .populate("assignment.students.department", "name");
    res.status(StatusCodes.OK).send({
      courses,
      success: true,
      message: "Successfully fetched all courses.",
    });
  } catch (error) {
    console.log(error);
    res
      .status(StatusCodes.BAD_REQUEST)
      .send({ error: "Something went wrong", success: false });
  }
};

const getCourse = async (req, res) => {
  const { id } = req.params;

  try {
    const course = await CourseModel.findById(id)
      .populate("assignment.teacher", "name")
      .populate("assignment.students.department", "name");

    if (!course) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .send({ message: "Course not found", success: false });
    }

    res
      .status(StatusCodes.OK)
      .send({ course, success: true, message: "Successfully fetched course." });
  } catch (error) {
    console.error("Error:", error.message);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send({ message: "Server Error", success: false });
  }
};

const addCourse = async (req, res) => {
  const { courseCode } = req.body;

  try {
    const course = await CourseModel.findOne({ courseCode });
    if (course) {
      return res.send({
        message: "Course already exists",
        success: true,
      });
    }

    let value = new CourseModel(req.body);
    await value.save();
    const data = await CourseModel.findOne({ courseCode });
    return res.send({ data, message: "Course created", success: true });
  } catch (error) {
    res.send({ message: "error", success: false });
  }
};

const updateCourse = async (req, res) => {
  const id = req.params.courseId;
  const payload = req.body;
  try {
    const course = await CourseModel.findByIdAndUpdate({ _id: id }, payload);
    if (!course) {
      res
        .status(StatusCodes.NOT_FOUND)
        .send({ message: `course with id ${id} not found`, success: false });
    }
    res
      .status(StatusCodes.OK)
      .send({ message: `course with id ${id} updated`, success: true });
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.BAD_REQUEST).send({
      error: "Something went wrong, unable to Update.",
      success: false,
    });
  }
};

const courseAssignment = async (req, res) => {
  const courseId = req.params.courseId;
  const { teacherId, departmentId, section, year } = req.body;

  try {
    const course = await CourseModel.findById(courseId);
    const teacher = await UserModel.findOne({
      _id: teacherId,
      role: "teacher",
    });
    const department = await DepartmentModel.findById(departmentId);
    // console.log(course, teacher, department);
    if (!course) {
      return res.status(StatusCodes.NOT_FOUND).send({
        message: "Course not found",
        success: false,
      });
    }
    if (!teacher) {
      return res.status(StatusCodes.NOT_FOUND).send({
        message: "Teacher not found",
        success: false,
      });
    }
    if (!department) {
      return res.status(StatusCodes.NOT_FOUND).send({
        message: "Department not found",
        success: false,
      });
    }

    const students = await StudentDataModel.find({
      department: departmentId,
      section,
      year,
    });
    console.log(students);
    await TeacherDataModel.updateMany(
      { userId: teacherId },
      {
        $addToSet: {
          courses: {
            courseId,
            students: {
              department: departmentId,
              section: section,
              year: year,
            },
          },
        },
      }
    );
    await StudentDataModel.updateMany(
      { _id: { $in: students.map((student) => student._id) } },
      {
        $addToSet: {
          courses: {
            courseId,
            teacherId: teacherId,
      } } }
    );
    await CourseModel.updateOne(
      { _id: courseId },
      {
        $addToSet: {
          assignment: {
            teacher: teacherId,
            students: {department: departmentId, section: section, year: year},
          }
        },
      }
    );

    //update teacher model property of course to push this courseId
    res.status(StatusCodes.OK).send({
      message: `course with id ${courseId} assigned to teacher with id ${teacherId}`,
      success: true,
    });

    //catch error
  } catch (error) {
    console.error("Error:", error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({message: "Server Error", success: false});
  }
};

const deleteAllCourses = async (req, res) => {
  try {
    await CourseModel.deleteMany();
    res
      .status(StatusCodes.OK)
      .send({ message: "All courses deleted", success: true });
  } catch (error) {
    console.error("Error:", error.message);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send({ message: "Server Error", success: false });
  }
};

const deleteCourse = async (req, res) => {
  const id = req.params.courseId;
  try {
    const course = await CourseModel.findByIdAndDelete({ _id: id });
    if (!course) {
      res
        .status(StatusCodes.NOT_FOUND)
        .send({ message: `course with id ${id} not found`, success: false });
    }
    res
      .status(StatusCodes.OK)
      .send({ message: `course with id ${id} deleted`, success: true });
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.BAD_REQUEST).send({
      error: "Something went wrong, unable to Delete.",
      success: false,
    });
  }
};

module.exports = {
  allCourses,
  getCourse,
  updateCourse,
  addCourse,
  courseAssignment,
  deleteAllCourses,
  deleteCourse,
};
