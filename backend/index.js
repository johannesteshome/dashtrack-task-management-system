const configs = require("./configs/configs");
const express = require("express");
const { connection } = require("./configs/db");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const mongoose = require("mongoose");

//TODO Error Messages

// custome routes
const authRouter = require("./routes/auth.route");
const userRouter = require("./routes/user.route");
const projetRouter = require("./routes/project.route");
const notificationRouter = require("./routes/notification.route");
const teamRouter = require("./routes/team.route");
const taskRouter = require("./routes/task.route");
const homeRouter = require("./routes/dashboard.route");

const app = express();
connection;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// console.log(configs.productionClientURL, "url");

app.use(cookieParser(configs.cookieSecret));
app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: "GET, POST",
    optionsSuccessStatus: 200,
  })
);
// app.set("trust proxy", 1);

const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});
require("./socket/socketio.js")(io);
// const io = socketIO(server);

app.use("/home", homeRouter);
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/project", projetRouter);
app.use("/team", teamRouter);
app.use("/task", taskRouter);
app.use("/notification", notificationRouter);

// app.listen(configs.port, async () => {
//   try {
//     await connection;
//     console.log("Connected to DB");
//   } catch (error) {
//     console.log("Unable to connect to DB");
//     console.log(error);
//   }
//   console.log(`Listening at port ${configs.port}`);
// });

mongoose.connection.once("open", () => {
  server.listen(configs.port, () => {
    console.log(`Listening at port ${configs.port}`);
    console.log("Connected to DB");
  });
});

mongoose.connection.on("error", (error) => {
  console.log("Unable to connect to DB");
});
