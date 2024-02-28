import { Button, Form, Input } from "antd";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { CreateNewProject, GetMyProjects } from "../Redux/features/dataActions";
import { ToastContainer, toast } from "react-toastify";

const CreateProject = () => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const notify = (message) => {
    toast(message);
  }

  // submit the form when clicked
  const onFinish = (values) => {
    console.log(values);
    setIsLoading(true);
    dispatch(CreateNewProject(values)).then((res) => {
      console.log(res);
      if (res.payload.success) {
        setIsLoading(false);
        form.resetFields();
        dispatch(GetMyProjects())
        return notify(res.payload.message);
      } else {
        setIsLoading(false);
        return notify(res.payload.message);
      }
    });
  };

  return (
    <div>
      <h1 className='text-3xl my-4'>Create your Project</h1>
      <Form
        form={form}
        layout='vertical'
      onFinish={onFinish}>
        <Form.Item
          label='Project Name'
          name={'name'}
          required
          rules={[
            {
              required: true,
              message: "Please input Project Name",
            },
          ]}
          tooltip='This is a required field'>
          <Input placeholder='Enter Project Name' />
        </Form.Item>
        <Form.Item
          name='description'
          label='Description'
          required
          rules={[
            {
              required: true,
              message: "Please input Description of your project",
            },
          ]}>
          <Input.TextArea
            showCount
            maxLength={100}
          />
        </Form.Item>
        <Form.Item>
          <Button
            type='default'
            className='bg-[#21BFD4] text-white hover:bg-white hover:text-[#21BFD4]'
            htmlType="submit"
          >
            {isLoading ? "Loading..." : "Create Project"}

          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
export default CreateProject;
