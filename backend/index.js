const express = require("express");
const { connection } = require("./configs/db");
require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");

//TODO Error Messages


const adminAuthRouter = require("./routes/authRoutes/AdminsAuth.Route");
const teacherAuthRouter = require("./routes/authRoutes/TeacherAuthRoute");
const studentAuthRouter = require("./routes/authRoutes/StudentAuthRoute");
const userAuthRouter = require("./routes/authRoutes/UsersAuthRoute");

const adminRouter = require("./routes/dataRoutes/Admins.Route");
const studentRouter = require("./routes/dataRoutes/Students.Route");
const teacherRouter = require("./routes/dataRoutes/Teachers.Route");
const attendanceRouter = require("./routes/dataRoutes/Attendances.Route");
const courseRouter = require("./routes/dataRoutes/Courses.Routes");
const departmentRouter = require("./routes/dataRoutes/Departments.Route");
const Logs = require("./routes/dataRoutes/Logs.Route");
const DataBackup = require("./routes/dataRoutes/DataBackup.Route");


const app = express();

app.use(express.json());

app.use(cookieParser(process.env.JWT_SECRET));
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    optionSuccessStatus: 200,
  })
);
// app.set("trust proxy", 1);

app.use("/admin/auth", adminAuthRouter);
app.use("/teacher/auth", teacherAuthRouter);
app.use("/student/auth", studentAuthRouter);
app.use("/user/auth", userAuthRouter);
app.use("/admins", adminRouter)
app.use("/students", studentRouter)
app.use("/teachers", teacherRouter)
app.use("/attendances", attendanceRouter);
app.use("/courses", courseRouter);
app.use("/departments", departmentRouter);
app.use("/logs", Logs);
app.use("/data-backup", DataBackup);

app.listen(process.env.port, async () => {
  try {
    await connection;
    console.log("Connected to DB");
  } catch (error) {
    console.log("Unable to connect to DB");
    console.log(error);
  }
  console.log(`Listening at port ${process.env.port}`);
});
