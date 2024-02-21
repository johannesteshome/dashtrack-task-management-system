const configs = require("./configs/configs");
const express = require("express");
const { connection } = require("./configs/db");
const cors = require("cors");
const cookieParser = require("cookie-parser");

//TODO Error Messages

const authRouter = require("./routes/auth.route");
const userRouter = require("./routes/user.route");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser(configs.cookieSecret));
app.use(
	cors({
		origin: "http://localhost:3000",
		credentials: true,
		optionSuccessStatus: 200,
	})
);
// app.set("trust proxy", 1);

app.use("/auth", authRouter);
app.use("/user", userRouter);

app.listen(configs.port, async () => {
	try {
		await connection;
		console.log("Connected to DB");
	} catch (error) {
		console.log("Unable to connect to DB");
		console.log(error);
	}
	console.log(`Listening at port ${configs.port}`);
});
