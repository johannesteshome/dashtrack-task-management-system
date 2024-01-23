import { Button, Card, Table } from "antd"
import Meta from "antd/es/card/Meta"
import { useSelector } from "react-redux"
import Chart from "react-apexcharts";
import { Link } from "react-router-dom";



const courseDetailTeacher = require("../sampleData/courseDetailTeacher.json")
const courseDetails = courseDetailTeacher[0].courseDetails
const attendances = courseDetailTeacher[1].attendances
const lineData = courseDetailTeacher[1].attendancePerSectionOverDays

let lineD = []

for (let i = 0; i < courseDetails.sections.length; i++) {
      lineD.push({
        name: "Section " + courseDetails.sections[i],
        data: lineData[i],
      })
}

let xaxis = []
for (let i = 0; i < lineData[0].length; i++){
  xaxis.push("Day " + (i + 1))
}

const attendancePerSection = [
  {
    chart: {
      id: "basic-line",
    },
    xaxis: {
      categories: xaxis,
    },
    yaxis: {
      title: {
        text: "Value",
      },
    },
  },
  lineD,
];

const sectionsPercentage = [
  {
    chart: {
      id: "basic-donut",
    },
    labels: courseDetails.sections,
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  },
  courseDetails.sectionsPercentage,
];

const teacherAttendanceColumns = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "Date",
    dataIndex: "Date",
  },
  {
    title: "Section",
    dataIndex: "Section",
  },
  {
    title: "Percentage",
    dataIndex: "Percentage",
  },
  {
    title: "Goto Attendance",
    render: () => <Link to='attendances/:attendanceId'>View</Link>,
  },
];

const studentAttendanceColumns = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "Date",
    dataIndex: "Date",
  },
  {
    title: "Percentage",
    dataIndex: "Percentage",
  },
  {
    title: "Goto Attendance",
    render: () => <Link to='attendances/:attendanceId'>View</Link>,
  },
];


const CourseDetailsPage = () => {
  console.log(courseDetailTeacher, "here");
  const { user } = useSelector((state) => state.auth);
  return (
    <div className='flex flex-col gap-4'>
      <div className='flex justify-between items-start my-4'>
        <div className='flex flex-col gap-2 '>
          <h1 className='text-3xl font-bold'>{courseDetails.courseName}</h1>
          <p>
            {" "}
            <span className='font-bold'>Course Code: </span>{" "}
            {courseDetails.courseCode}
          </p>
          <p>
            {" "}
            <span className='font-bold'>Teachers:</span>{" "}
            {courseDetails.teachers.map((teacher) => {
              return teacher + ", ";
            })}
          </p>
        </div>
        {user.role === "teacher" && (
          <Button
            type='default'
            className='w-fit bg-blue-500 text-white hover:text-blue-500 hover:bg-white'>
            Take Attendance
          </Button>
        )}
      </div>

      {user.role !== "student" && (
        <div className='flex flex-wrap gap-4'>
          <Card
            style={{
              width: 300,
            }}>
            <Meta
              avatar={
                <h2 className='text-3xl font-bold'>{courseDetails.students}</h2>
              }
              title={"Students"}
              description='Registered'
            />
          </Card>
          <Card
            style={{
              width: 300,
            }}>
            <Meta
              avatar={
                <h2 className='text-3xl font-bold'>
                  {courseDetails.sections.length}
                </h2>
              }
              title={"Sections"}
              description='Registered'
            />
          </Card>
          <Card
            style={{
              width: 300,
            }}>
            <Meta
              avatar={
                <h2 className='text-3xl font-bold'>{attendances.length}</h2>
              }
              title={"Attendances"}
              description='Recorded'
            />
          </Card>
        </div>
      )}

      {user.role === "student" && (
        <div className='flex flex-wrap gap-4'>
          <Card
            style={{
              width: 300,
            }}>
            <Meta
              avatar={
                <h2 className='text-3xl font-bold'>{attendances.length}</h2>
              }
              title={"Your Attendance Percentage"}
              description='Recorded'
            />
          </Card>
        </div>
      )}

      { user.role !== 'student' && <div className='flex flex-wrap gap-4'>
        <Card
          title='Attendances per Section'
          className='w-fit'
          bordered={false}>
          <Chart
            options={attendancePerSection[0]}
            series={attendancePerSection[1]}
            type='line'
            width='500'
          />
        </Card>
        <Card
          title='Sections Percentages'
          className='w-fit'
          bordered={false}>
          <Chart
            options={sectionsPercentage[0]}
            series={sectionsPercentage[1]}
            type='polarArea'
            width='500'
          />
        </Card>
      </div>}

      <div>
        {user.role == "teacher" ? (
          <Table
            columns={teacherAttendanceColumns}
            dataSource={attendances}
          />
        ) : (
          <Table
            columns={studentAttendanceColumns}
            dataSource={attendances}
          />
        )}
      </div>
    </div>
  );
}
export default CourseDetailsPage