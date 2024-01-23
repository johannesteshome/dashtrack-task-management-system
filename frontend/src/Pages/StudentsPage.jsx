import { Button, Table, Tag } from "antd";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
const columns = [
  {
    title: "Full Name",
    width: 100,
    dataIndex: "name",
    key: "name",
    fixed: "left",
  },
  {
    title: "Student ID",
    width: 100,
    dataIndex: "studentID",
    key: "studentID",
    fixed: "left",
  },
  {
    title: "Section",
    dataIndex: "section",
    key: "4",
    width: 100,
  },
  {
    title: "Email",
    width: 150,
    dataIndex: "email",
    key: "email",
  },
  {
    title: "Gender",
    dataIndex: "gender",
    key: "1",
    width: 100,
    render: (text) => <span className='capitalize'>{text}</span>,
  },
  {
    title: "Phone Number",
    dataIndex: "mobile",
    key: "2",
    width: 150,
    render: (text) => <span>{"(+251) " + text}</span>,
  },
  {
    title: "Department",
    dataIndex: "department",
    key: "3",
    width: 150,
  },
  {
    title: "Is Verified",
    dataIndex: "isVerified",
    width: 80,
    render: (text) => (
      <Tag
        className={text ? "text-green-500" : "text-red-500"}
        color={text ? "green" : "red"}>
        {text ? "Yes" : "No"}
      </Tag>
    ),
  },
  {
    title: "Action",
    key: "operation",
    fixed: "right",
    width: 100,
    render: () => <a>action</a>,
  },
];


const StudentsPage = () => {
  const students = useSelector((state) => state.data.students);
  const studentsData = []


  for (let student of students) {
    studentsData.push({
      key: student._id,
      name: student.name,
      studentID: student.studentID,
      email: student.email,
      section: student.section,
      gender: student.gender,
      mobile: student.mobile,
      department: student.department.name,
      isVerified: student.isVerified,
    });
  }

  return (
    <div className='flex flex-col gap-4 my-4'>
      <div className='flex items-center'>
        <h1 className='text-3xl font-bold'>Students List</h1>
      </div>
      <div className='flex items-center justify-end gap-4'>
        <Button className="flex items-center bg-blue-500 text-white hover:bg-white hover:text-blue-500">
          <Link
            to='/dashboard/add-student'
            className='flex items-center text-black gap-2'>
            <Icon
              className='w-8 h-8'
              icon='material-symbols-light:add'
            />
            Add Student
          </Link>
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={studentsData}
        scroll={{
          x: 1500,
          y: 500,
        }}
      />
    </div>
  );
};
export default StudentsPage;
