import { Table, Tag } from "antd";
import { Button } from "antd";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import { useState } from "react";
import AssignCourseModal from "./AssignCourseModal";
import { useSelector } from "react-redux";

const columns = [
  {
    title: "Full Name",
    width: 100,
    dataIndex: "name",
    fixed: "left",
  },
  {
    title: "Email",
    width: 100,
    dataIndex: "email",
    key: "_id",
    fixed: "left",
  },
  {
    title: "Age",
    dataIndex: "age",
    width: 80,
  },
  {
    title: "Gender",
    dataIndex: "gender",
    width: 100,
    render: (text) => <span className='capitalize'>{text}</span>,
  },
  {
    title: "Phone Number",
    dataIndex: "mobile",
    width: 150,
    render: (text) => <span>{"(+251) " + text}</span>,
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
    title: "Is Admin",
    dataIndex: "isAdmin",
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
    title: "Actions",
    key: "_id",
    fixed: "right",
    width: 100,
    render: () => <a>action</a>,
  },
];

const TeachersPage = () => {
  const [open, setOpen] = useState(false);
  const teachers = useSelector((state) => state.data.teachers);
  const teachersData = []


  for (let teacher of teachers) {
    teachersData.push({
      key: teacher._id,
      name: teacher.name,
      email: teacher.email,
      age: teacher.age,
      gender: teacher.gender,
      mobile: teacher.mobile,
      isVerified: teacher.isVerified,
      isAdmin: teacher.isAdmin,
    });
  }

  const onCreate = (values) => {
    console.log("Received values of form: ", values);
    setOpen(false);
  };
  return (
    <div className='flex flex-col gap-4 my-4'>
      <div className='flex items-center'>
        <h1 className='text-3xl font-bold'>Teachers List</h1>
      </div>
      <div className='flex items-center justify-end gap-4'>
        <Button
          onClick={() => setOpen(true)}
          className='bg-blue-500 text-white hover:bg-white hover:text-blue-500'>
          Assign Course
        </Button>
        <AssignCourseModal
          open={open}
          onCreate={onCreate}
          onCancel={() => {
            setOpen(false);
          }}
        />
        <Button className='flex items-center bg-blue-500 text-white hover:bg-white hover:text-blue-500'>
          <Link
            to='/dashboard/add-teacher'
            className='flex items-center text-black gap-2'>
            <Icon
              className='w-8 h-8'
              icon='material-symbols-light:add'
            />
            Add Teacher
          </Link>
        </Button>
      </div>
      {
        // TODO change the table with filters and editable rows - you can find it on the snippets extension
      }
      <Table columns={columns} dataSource={teachersData} scroll={{ x: 1500, y: 500 }} />
    </div>
  );
};
export default TeachersPage;
