import React, { useEffect, useState, useRef } from "react";
import { Drawer, Form, Input, Button } from "antd";
import ReCAPTCHA from "react-google-recaptcha";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import banner from "../img/banner.png";
import dashtrack from "../img/dashtrack-banner.png";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  UserLogin,
  UserForgetPassword,
  UserRegister
} from "../Redux/features/authActions";
import FormItem from "antd/es/form/FormItem";

const notify = (text) => toast(text);

const LoginScreen = () => {
  const [current, setCurrent] = useState("login");
  const [form] = Form.useForm(); // Registration Form
  const [open, setOpen] = useState(false);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const captchaRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated]);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const [isLoading, setIsLoading] = useState(false);
  const [formvalue, setFormvalue] = useState({
    email: "",
    password: "",
  });
  const dispatch = useDispatch();

  const Handlechange = (e) => {
    setFormvalue({ ...formvalue, [e.target.name]: e.target.value });
  };

  const HandleSubmit = (e) => {
    // e.preventDefault();
    setIsLoading(true);
    if (formvalue.email !== "" && formvalue.password !== "") {
        let data = {
          ...formvalue,
          email: formvalue.email,
        };
        dispatch(UserLogin(data)).then((res) => {
          if (res.meta.requestStatus === "fulfilled") {
            notify("Login Successful");
            setIsLoading(false);
            return navigate("/verify-otp?email=" + formvalue.email);
          }
          if (res.meta.requestStatus === "rejected") {
            // console.log(res.payload.message);
            setIsLoading(false);
            notify(res.payload.message);
          }
          if (res.payload.message === "Error") {
            setIsLoading(false);
            notify("Something went Wrong, Please Try Again");
          }
        });
      }
    }

  const onFinishRegister = (values) => {
    setIsLoading(true);
    const token = captchaRef.current.getValue();
    captchaRef.current.reset();
    // console.log("Received values of form: ", values, token);
    if (token) {
      console.log(values);
      dispatch(UserRegister({ ...values, token, role: "user" })).then(
        (res) => {
          console.log(res);
          if (res.payload.success) {
            setIsLoading(false);
            form.resetFields();
            return notify(res.payload.message);
          } else {
            setIsLoading(false);
            return notify(res.payload.message);
          }
        }
      );
    } else {
      notify("Please Verify Captcha");
    }
  };


  const [ForgetPassword, setForgetPassword] = useState({
    email: "",
  });

  const HandleForgetPassword = (e) => {
    setForgetPassword({ ...ForgetPassword, [e.target.name]: e.target.value });
  };

  const loginToggle = () => {
    if (current === "login") {
      setCurrent("register");
    } else {
      setCurrent("login");
    }
  };

  const [forgetLoading, setforgetLoading] = useState(false);

  const HandleChangePassword = () => {
    console.log( ForgetPassword.email);
    if (ForgetPassword.email === "") {
      return notify("Please Fill all Details");
    }
    setforgetLoading(true);
      dispatch(UserForgetPassword({email: ForgetPassword.email})).then((res) => {
        console.log(ForgetPassword.email, "email");
        if (res.meta.requestStatus === "rejected") {
          setforgetLoading(false);
          return notify("User Not Found");
        }
        setForgetPassword({
          email: "",
        });
        onClose();
        setforgetLoading(false);
        return notify("Please check your email for reset password link!");
      });
  
      }

  return (
    <>
      <ToastContainer />

      <div className='mainLoginPage flex w-full h-screen bg-[#F5F5F5]'>
        <div className='leftside w-full flex items-center justify-center bg-white'>
          <img
            className='w-full'
            src={banner}
            alt='banner'
          />
        </div>
        <div className='rightside flex flex-col items-center justify-center w-full scale-90'>
          <div className='flex flex-col items-center gap-2'>
            <img
              src={dashtrack}
              alt='dashtrack Logo'
              className='w-1/2'
            />
            <h1 className='text-3xl font-bold'>{current === 'login' ? 'Login' : 'Register'}</h1>
            <div className='w-full flex flex-col items-center justify-center'>
              {current === "login" && (
                <Form
                  className='flex flex-col items-center justify-center w-full'
                  layout='vertical'
                  onFinish={HandleSubmit}>
                  <Form.Item
                    className='w-1/2'
                    name='email'
                    label={"Email"}
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
                    <Input
                      type='email'
                      name='email'
                      className='w-full'
                      value={formvalue.email}
                      onChange={Handlechange}
                      required
                    />
                  </Form.Item>
                  <FormItem
                    className='w-1/2'
                    name='password'
                    label='Password'
                    rules={[
                      {
                        required: true,
                        message: "Please input your password!",
                      },
                    ]}>
                    <Input
                      type='password'
                      name='password'
                      value={formvalue.password}
                      onChange={Handlechange}
                      required
                    />
                  </FormItem>
                  <Form.Item
                    label=' '
                    colon={false}>
                    <Button
                      type='default'
                      className='bg-blue-500 text-white hover:text-blue-500 hover:bg-white text-lg flex items-center justify-center px-12 py-5 rounded-3xl'
                      htmlType='submit'>
                      {isLoading ? "Loading..." : "Login"}
                    </Button>
                  </Form.Item>
                </Form>
              )}

              {current === "register" && (
                <Form
                  className='flex flex-col items-center justify-center w-full'
                  layout='vertical'
                  form={form}
                  onFinish={onFinishRegister}
                  scrollToFirstError>
                  <Form.Item
                    className='w-1/2'
                    name='name'
                    label={"Name"}
                    rules={[
                      {
                        required: true,
                        message: "Please input your E-mail!",
                      },
                    ]}>
                    <Input />
                  </Form.Item>
                  <Form.Item
                    className='w-1/2'
                    name='email'
                    label={"E-mail"}
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
                  <FormItem
                    className='w-1/2'
                    name='password'
                    label='Password'
                    rules={[
                      {
                        required: true,
                        message: "Please input your password!",
                      },
                    ]}>
                    <Input />
                  </FormItem>
                  <Form.Item
                    label='Captcha'
                    extra='We must make sure that your are a human.'>
                    <ReCAPTCHA
                      sitekey='6LcWdU8pAAAAAP2zleYMT6sLGPyzhIoOrFY3l21Y'
                      ref={captchaRef}
                    />
                  </Form.Item>
                  <Form.Item
                    label=' '
                    colon={false}>
                    <Button
                      type='default'
                      className='bg-blue-500 text-white hover:text-blue-500 hover:bg-white text-lg flex items-center justify-center px-12 py-5 rounded-3xl'
                      htmlType='submit'>
                      {isLoading ? "Loading..." : "Register"}
                    </Button>
                  </Form.Item>
                </Form>
              )}

              <p
                className='flex gap-8'
                style={{ marginTop: "10px" }}>
                <span
                  style={{ color: "blue", cursor: "pointer" }}
                  onClick={loginToggle}>
                  {current === "login" ? "Create Account" : "Login"}
                </span>
                <span
                  style={{ color: "blue", cursor: "pointer" }}
                  onClick={showDrawer}>
                  Forgot Password
                </span>
              </p>
              {/* Forgot Password Drawer */}
              <Drawer
                title='Forget Password'
                placement='left'
                onClose={onClose}
                open={open}>
                <Form
                  onFinish={HandleChangePassword}
                  className='flex flex-col gap-4'
                  layout='vertical'>
                  <Form.Item
                    name='email'
                    label='Email'
                    onChange={HandleForgetPassword}
                    rules={[
                      {
                        required: true,
                        message: "Email is required",
                      },
                    ]}>
                    <Input
                      placeholder='Input your Email'
                      value={ForgetPassword.email}
                      name='email'
                    />
                  </Form.Item>

                  <Form.Item colon={false}>
                    <Button
                      type='default'
                      className='bg-blue-500 text-white hover:text-blue-500 hover:bg-white text-md flex items-center justify-center px-8 py-4 rounded-3xl'
                      htmlType='submit'>
                      {forgetLoading ? "Loading..." : " Send Mail"}
                    </Button>
                  </Form.Item>
                </Form>
              </Drawer>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginScreen;
