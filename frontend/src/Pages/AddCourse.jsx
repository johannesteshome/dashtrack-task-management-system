import React from "react";
import { Button, Form, Input, InputNumber } from "antd";
import { ToastContainer, toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { AdminRegister } from "../Redux/features/authActions";
const notify = (text) => toast(text);

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

const AddCourse = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const onFinish = (values) => {
    console.log(values);
  };

  return (
    <div className='flex flex-col gap-4 my-4'>
      <ToastContainer />
      <div className='flex items-center'>
        <h1 className='text-3xl font-bold'>Register Admin</h1>
      </div>
      <Form
        {...formItemLayout}
        form={form}
        name='add-course'
        onFinish={onFinish}
        style={{
          maxWidth: 600,
        }}
        scrollToFirstError>
        <Form.Item
          name='courseTitle'
          label='Course Title'
          rules={[
            {
              required: true,
              message: "Please input course title!",
              whitespace: true,
            },
          ]}>
          <Input />
        </Form.Item>

        <Form.Item
          name='courseCode'
          label='Course Code'
          rules={[
            {
              required: true,
              message: "Please input course code!",
              whitespace: true,
            },
          ]}>
          <Input />
        </Form.Item>

        <Form.Item
          name='creditHour'
          label='Credit Hour'
          rules={[
            {
              required: true,
              message: "Please input the credit hour!",
              whitespace: true,
            },
          ]}>
          <InputNumber
            style={{
              width: "100%",
            }}
          />
        </Form.Item>

        <Form.Item {...tailFormItemLayout}>
          <Button
            htmlType='submit'
            className='bg-blue-500 text-white hover:bg-white hover:text-blue-500'>
            Add Course
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
export default AddCourse;
