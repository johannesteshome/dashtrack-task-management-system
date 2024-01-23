import { Table } from "antd";
import { Button, Popconfirm } from "antd";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import { useState } from "react";
import AssignCourseModal from "./AssignCourseModal";
import { useSelector } from "react-redux";

const handleDelete = (key) => {
  console.log(key);
};

const columns = [
  {
    title: "Course Name",
    width: 180,
    dataIndex: "courseTitle",
    key: "name",
  },
  {
    title: "Course Code",
    width: 80,
    dataIndex: "courseCode",
    key: "courseCode",
  },
  {
    title: "Credit Hour",
    dataIndex: "creditHour",
    key: "1",
    width: 50,
  },
  {
    title: "Action",
    key: "operation",
    fixed: "right",
    width: 100,
    render: (_, record) => {

        <Popconfirm
          title='Sure to delete?'
          onConfirm={() => handleDelete(record.key)}>
          <Button
            type='default'
            className='bg-red-500 text-white '>
            Delete
          </Button>
        </Popconfirm>
    },
  },
];

const CoursesPage = () => {
  const [open, setOpen] = useState(false);
  const courses = useSelector((state) => state.data.courses);
  const coursesData = [];


  for (let course of courses) {
    coursesData.push({
      key: course._id,
      courseTitle: course.courseTitle,
      courseCode: course.courseCode,
      creditHour: course.creditHour,
    });
  }

  const onCreate = (values) => {
    console.log("Received values of form: ", values);
    setOpen(false);
  };
  return (
    <div className='flex flex-col gap-4 my-4'>
      <div className='flex items-center'>
        <h1 className='text-3xl font-bold'>Courses List</h1>
      </div>
      <div className='flex items-center justify-end gap-4'>
        <Button
          onClick={() => setOpen(true)}
          className='bg-blue-500 text-white hover:bg-white hover:text-blue-500'>
          Assign Teacher
        </Button>
        <AssignCourseModal
          open={open}
          onCreate={onCreate}
          onCancel={() => {
            setOpen(false);
          }}
        />
        <Button className='flex items-center gap-2 bg-blue-500 text-white hover:bg-white hover:text-blue-500'>
          <Link
            to={"/dashboard/add-course"}
            className='flex items-center'>
            <Icon
              className='w-8 h-8'
              icon='material-symbols-light:add'
            />
            Add Course
          </Link>
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={coursesData}
        scroll={{
          x: 1500,
          y: 500,
        }}
      />
    </div>
  );
};
export default CoursesPage;
