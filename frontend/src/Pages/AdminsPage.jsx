import { Table, Tag } from "antd";
import { Button } from "antd";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
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
    title: "Actions",
    key: "_id",
    fixed: "right",
    width: 100,
    render: () => <a>action</a>,
  },
];

const AdminsPage = () => {
  const admins = useSelector((state) => state.data.admins);
  const adminsData = []


  for (let admin of admins) {
    adminsData.push({
      key: admin._id,
      name: admin.name,
      email: admin.email,
      age: admin.age,
      gender: admin.gender,
      mobile: admin.mobile,
      isVerified: admin.isVerified,
    });
  }


  return (
    <div className='flex flex-col gap-4 my-4'>
      <div className='flex items-center'>
        <h1 className='text-3xl font-bold'>Admins List</h1>
      </div>
      <div className='flex items-center justify-end gap-4 '>
        <Button className='flex items-center bg-blue-500 text-white hover:bg-white hover:text-blue-500'>
          <Link
            to='/dashboard/add-admin'
            className='flex items-center text-black gap-2'>
            <Icon
              className='w-8 h-8'
              icon='material-symbols-light:add'
            />
            Add Admin
          </Link>
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={adminsData}
        scroll={{
          x: 1500,
          y: 500,
        }}
      />
    </div>
  );
};
export default AdminsPage;
