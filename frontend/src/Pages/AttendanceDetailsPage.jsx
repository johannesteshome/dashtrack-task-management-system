import { Button, Table } from "antd";
import { useSelector } from "react-redux";

const attendanceDetails = require("../sampleData/attendanceDetails.json");

let sectionFilter = [];
let studentSections = [];
attendanceDetails.section.map((section) => {
  if (studentSections.includes(section)) return;
  sectionFilter.push({ text: section, value: section });
  studentSections.push(section);
});

for (let i = 0; i < attendanceDetails.length; i++) {
  attendanceDetails[i].key = attendanceDetails[i].studentID
}

const attendaceFilter = [
    {text: "Present",
        value: true,
    },
    {
        text: "Absent",
        value: false,
    }
]

const columns = [
  {
    title: "Student Name",
    dataIndex: "name",
    sorter: (a, b) => a.name.length - b.name.length,
        sortDirections: ["descend"],
    fixed: "left",
  },
  {
    title: "Student ID",
    dataIndex: "studentID",
    key: "studentID",
  },
  {
    title: "Gender",
    dataIndex: "gender",
  },
  {
    title: "Email",
    dataIndex: "email",
  },
  {
    title: "mobile",
    dataIndex: "mobile",
  },
  {
    title: "Section",
    dataIndex: "section",
    filters: sectionFilter,
    onFilter: (value, record) => record.section.startsWith(value),
    filterMode: "tree",
    filterSearch: true,
    sorter: (a, b) => a.name.length - b.name.length,
    sortDirections: ["descend"],
  },
  {
    title: "Attendace",
    dataIndex: "isPresent",
    render: (isPresent) => (isPresent ? <span className="text-green-500">Present</span> : <span className="text-red-500">Absent</span>),
    fixed: "right",
    filters: attendaceFilter,
    onFilter: (value, record) => record.isPresent === value,
  },
];


const AttendanceDetailsPage = () => {
    const {user} = useSelector((state)=> state.auth)
  return (
    <div className='flex flex-col gap-4'>
      <div className='flex items-center'>
        <h1 className='text-3xl font-bold'>Attendance Details</h1>
      </div>

      <div className='flex justify-between items-start my-4'>
        <div className='flex flex-col gap-2 '>
          <h1 className='text-3xl font-bold'>{attendanceDetails.course}</h1>
          <p>
            {" "}
            <span className='font-bold'>Date Taken: </span>{" "}
            {attendanceDetails.date}
          </p>
          <p>
            {" "}
            <span className='font-bold'>Teacher Taken:</span>{" "}
            {attendanceDetails.teacher}
          </p>
        </div>
        {user.role == "teacher" ? (
          <Button
            type='default'
            className='w-fit bg-blue-500 text-white hover:text-blue-500 hover:bg-white'>
            Edit Attendance
          </Button>
        ) : null}
      </div>

      <div>
        <Table
          columns={columns}
          dataSource={attendanceDetails.studentsList}
          scroll={{
            x: 1500,
            y: 500,
          }}
        />
      </div>
    </div>
  );
};
export default AttendanceDetailsPage;
