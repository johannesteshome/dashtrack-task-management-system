import React, { useState, useRef } from "react";
import { Button, Form, Input, InputNumber, Select } from "antd";
import ReCAPTCHA from "react-google-recaptcha";
import { ToastContainer, toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { UserRegister } from "../Redux/features/authActions";



const notify = (text) => toast(text);


const { Option } = Select;

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

const AddTeacher = () => {
  const [form] = Form.useForm();
  const captchaRef = useRef(null);
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(false);

  const onFinish = (values) => {
    setIsLoading(true);
    const token = captchaRef.current.getValue();
    captchaRef.current.reset();
    // console.log("Received values of form: ", values, token);
    if (token) {
      dispatch(UserRegister({ ...values, token, role: 'teacher' })).then((res) => {
        console.log(res);
        if (res.payload.success) {
          setIsLoading(false);
          form.resetFields()
          return notify(res.payload.message);
        }
        else {
          setIsLoading(false);
          return notify(res.payload.message);
        }
      })
    }
    else {
      notify("Please Verify Captcha");
    }
  };
  const prefixSelector = (
    <Form.Item
      name='prefix'
      noStyle>
      <Select
        style={{
          width: 100,
        }}>
        <Option value='251'>+251</Option>
      </Select>
    </Form.Item>
  );

    return (
      <div className='flex flex-col gap-4 my-4'>
        <ToastContainer />
        <div className='flex items-center'>
          <h1 className='text-3xl font-bold'>Register Teacher</h1>
        </div>
        <Form
          {...formItemLayout}
          form={form}
          name='register'
          onFinish={onFinish}
          initialValues={{
            prefix: "251",
          }}
          style={{
            maxWidth: 600,
          }}
          scrollToFirstError>
          <Form.Item
            name='email'
            label='E-mail'
            rules={[
              {
                type: "email",
                message: "The input is not valid E-mail!",
              },
              {
                required: true,
                message: "Please input your E-mail!",
              },
            ]}>
            <Input />
          </Form.Item>

          <Form.Item
            name='name'
            label='Name'
            tooltip='What do you want others to call you?'
            rules={[
              {
                required: true,
                message: "Please input your name!",
                whitespace: true,
              },
            ]}>
            <Input />
          </Form.Item>

          <Form.Item
            name='mobile'
            label='Phone Number'
            rules={[
              {
                required: true,
                message: "Please input your phone number!",
              },
            ]}>
            <Input
              addonBefore={prefixSelector}
              style={{
                width: "100%",
              }}
              maxLength={9}
              minLength={9}
            />
          </Form.Item>

          <Form.Item
            name='gender'
            label='Gender'
            rules={[
              {
                required: true,
                message: "Please select gender!",
              },
            ]}>
            <Select placeholder='Select your Gender'>
              <Option value='male'>Male</Option>
              <Option value='female'>Female</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name='age'
            label='Age'
            rules={[
              {
                required: true,
                message: "Please input your age!",
              },
            ]}>
            <InputNumber
              style={{
                width: "100%",
              }}
            />
          </Form.Item>

          <Form.Item
            label='Captcha'
            extra='We must make sure that your are a human.'>
            <ReCAPTCHA
              sitekey='6LcWdU8pAAAAAP2zleYMT6sLGPyzhIoOrFY3l21Y'
              ref={captchaRef}
            />
          </Form.Item>

          <Form.Item {...tailFormItemLayout}>
            <Button
              htmlType='submit'
              className='bg-blue-500 text-white hover:bg-white hover:text-blue-500'>
              {isLoading ? "Registering" : "Register"}
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
};
export default AddTeacher;
