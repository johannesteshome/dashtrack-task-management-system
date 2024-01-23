import { Table } from "antd";
import { Button, Form, Input, Modal, Radio } from "antd";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useSelector } from "react-redux";

const columns = [
  {
    title: "Department Name",
    width: 100,
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Action",
    key: "operation",
    width: 100,
    render: () => <a>action</a>,
  },
];

const data = [];
for (let i = 0; i < 100; i++) {
  data.push({
    key: i,
    name: `Software Engineering ${i}`
  });
}

const CollectionCreateForm = ({ open, onCreate, onCancel }) => {
  const [form] = Form.useForm();

  return (
    <Modal
      open={open}
      title='Create a new department'
      okText='Add Department'
      okType='default'
      cancelText='Cancel'
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            console.log(values);
            form.resetFields();
            onCreate(values);
          })
          .catch((info) => {
            console.log("Validate Failed:", info);
          });
      }}>
      <Form
        form={form}
        layout='vertical'
        name='form_in_modal'
        initialValues={{}}>
        <Form.Item
          name='name'
          label='Department Name'
          rules={[
            {
              required: true,
              message: "Please input the department name!",
            },
          ]}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

const DepartmentsPage = () => {
  const [open, setOpen] = useState(false);
  const departments = useSelector((state) => state.data.departments);
  let departmentsData = [];

  for (let department of departments) {
    departmentsData.push({
      key: department._id,
      name: department.name,
    });
  }
    const onCreate = (values) => {
      console.log("Received values of form: ", values);
      setOpen(false);
    };
  return (
    <div className='flex flex-col gap-4 my-4'>
      <div className='flex items-center'>
        <h1 className='text-3xl font-bold'>Departments List</h1>
      </div>
      <div className='flex items-center justify-end gap-4'>
        <CollectionCreateForm
          open={open}
          onCreate={onCreate}
          onCancel={() => {
            setOpen(false);
          }}
        />
        <Button
          className='flex items-center gap-2 bg-blue-500 text-white hover:bg-white hover:text-blue-500'
          onClick={() => setOpen(true)}>
          <Icon
            className='w-8 h-8'
            icon='material-symbols-light:add'
          />
          Add Department
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={departmentsData}
        scroll={{
          x: 1500,
          y: 500,
        }}
      />
    </div>
  );
};
export default DepartmentsPage;
