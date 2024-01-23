const fs = require("fs");
const path = require("path");
const { UserModel } = require("../../models/User.model");
const { CourseModel } = require("../../models/Course.model");
const { LogModel } = require("../../models/Log.model");
const { DepartmentModel } = require("../../models/Department.model");
const { AttendanceModel } = require("../../models/Attendance.model");
const { StudentDataModel } = require("../../models/StudentData.model");
const { TeacherDataModel } = require("../../models/TeacherData.model");
const { TokenModel } = require("../../models/Token.model");
const { OTPModel } = require("../../models/OTP.model");
const { google } = require("googleapis");
const clientCredentials = require("./clientCredentials.json");
const credentials = require("./credentials.json");
const { StatusCodes } = require("http-status-codes");
const { GoogleAuth } = require("google-auth-library");
const mongoToCsv = require("mongo-to-csv");
// const folderId = "your_folder_id"; // The ID of the Google Drive folder where you want to store the file

const createJSONFile = async () => {
  try {
    const userData = await UserModel.find({}); // Replace YourModel with your Mongoose model
    const courseData = await CourseModel.find({});
    const logData = await LogModel.find({});
    const departmentData = await DepartmentModel.find({});
    const attendanceData = await AttendanceModel.find({});
    const studentData = await StudentDataModel.find({});
    const teacherData = await TeacherDataModel.find({});
    const tokenData = await TokenModel.find({});
    const otpData = await OTPModel.find({});

    // Convert the data to a JSON string
    const userJSONData = JSON.stringify(userData, null, 2); // Use null and 2 for pretty-printing
    const courseJSONData = JSON.stringify(courseData, null, 2);
    const logJSONData = JSON.stringify(logData, null, 2);
    const departmentJSONData = JSON.stringify(departmentData, null, 2);
    const attendanceJSONData = JSON.stringify(attendanceData, null, 2);
    const studentJSONData = JSON.stringify(studentData, null, 2);
    const teacherJSONData = JSON.stringify(teacherData, null, 2);
    const tokenJSONData = JSON.stringify(tokenData, null, 2);
    const otpJSONData = JSON.stringify(otpData, null, 2);

    const combinedData = {
      userData,
      courseData,
      logData,
      departmentData,
      attendanceData,
      studentData,
      teacherData,
      tokenData,
      otpData,
    };

    const combinedJSONData = JSON.stringify(combinedData, null, 2);

    // Write the JSON data to a file
    let date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    date = day + "-" + month + "-" + year;
    const fileName = "backup-" + date + ".json";
    const combinedJSONDataFilePath = path.join(__dirname, fileName);

    return { combinedJSONDataFilePath, combinedJSONData, fileName };
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

const exportData = async (req, res) => {
  try {
    let filePath = null;
    let jsonData = null;
    let fileName = null;

    await createJSONFile().then(
      (json) => (
        (filePath = json.combinedJSONDataFilePath),
        (jsonData = json.combinedJSONData),
        (fileName = json.fileName)
      )
    );

    // fs.writeFileSync(filePath, jsonData);

    // if (fs.existsSync(filePath)) {
    //   // Set the content-disposition header to prompt the user to download the file
    //   res.setHeader(
    //     "Content-Disposition",
    //     'attachment; filename="backup.json"'
    //   );

    //   // Set the content type to application/json
    //   res.setHeader("Content-Type", "application/json");

    //   // Send the file as the response
    //   const fileStream = fs.createReadStream(filePath);
    //   fileStream.pipe(res);
    // } else {
    //   res.status(404).json({ error: "File not found" });
    // }

    res.json({
      message: "Data exported successfully",
      jsonData,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

const exportDataCloud = async (req, res) => {
  try {
    let filePath = null;
    let jsonData = null;
    let fileName = null;

    await createJSONFile().then(
      (json) => (
        (filePath = json.combinedJSONDataFilePath),
        (jsonData = json.combinedJSONData),
        (fileName = json.fileName)
      )
    );

    fs.writeFileSync(filePath, jsonData);

    // Upload the file to Google Drive
    const auth = new GoogleAuth({
      keyFile: credentials,
      scopes: ["https://www.googleapis.com/auth/drive", 'profile'],
    });
    // console.log(auth, "auth");

    const drive = google.drive({ version: "v3", auth });
    const fileMetadata = {
      name: filePath,
      parents: ["1udq6lR6NHx8CEpj8xWJcgO-f7bEBOv__"],
    };
    // console.log(filePath, "fileMetadata");
    const media = {
      mimeType: "application/json",
      body: fs.createReadStream(filePath),
    };
    // console.log(media, "media");
    const uploadedFile = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: "id",
    });
    // console.log("here");
    console.log(uploadedFile, "uploadedFile");

    // Send the Google Drive file ID as a response
    res.json({ fileId: uploadedFile.data.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const importData = async (req, res) => {
  try {
    // Read the JSON file
    const filePath = "path/to/your/json/file.json"; // Replace with the path to your JSON file
    const jsonData = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(jsonData);

    // Insert the data into MongoDB using Mongoose
    await YourModel.insertMany(data);

    // Send a success response
    res.json({ message: "Data imported successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { exportData, exportDataCloud };
