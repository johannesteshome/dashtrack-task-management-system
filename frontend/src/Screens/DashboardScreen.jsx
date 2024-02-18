import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { Avatar, Layout, Menu, theme } from "antd";
import { Outlet, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import dashtrack from '../img/dashtrack-banner.png'
import {
  authLogout
} from "../Redux/features/authActions";
import { FetchAdmin, FetchAllAdmins, FetchAllCourses, FetchAllStudents, FetchAllTeachers, FetchStudent, FetchTeacher } from "../Redux/features/dataActions";
import { ToastContainer, toast } from "react-toastify";
const { Header, Content, Footer, Sider } = Layout;

const notify = (text) => toast(text);


const DashboardScreen = () => {
  
  const [collapsed, setCollapsed] = useState(false);
  const dispatch = useDispatch();
  const { role, _id } = useSelector((state) => state.auth.user);
  console.log(role, _id);


  // useEffect(() => {
  //   if (role === "admin") {
  //     // console.log("here", role, _id);F
  //     dispatch(FetchAdmin(_id)).then((res) => {
  //       if (res.meta.requestStatus === "fulfilled") {
  //         // console.log(res.payload, "payload");
  //         // setInitialValues({...initialValues, name: res.payload.name});
  //       } else if (res.meta.requestStatus === "rejected") {
  //         return notify(res.payload);
  //       }
  //     });
  //     dispatch(FetchAllTeachers())
  //     dispatch(FetchAllAdmins())
  //     dispatch(FetchAllStudents())
  //     dispatch(FetchAllCourses())
  //   } else if (role === "teacher") {
  //     dispatch(FetchTeacher(_id)).then((res) => {
  //       if (res.meta.requestStatus === "fulfilled") {
  //         // console.log(res.payload, "payload");
  //         // setInitialValues({...initialValues, name: res.payload.name});
  //       } else if (res.meta.requestStatus === "rejected") {
  //         return notify(res.payload);
  //       }
  //     });
  //   } else if (role === "student") {
  //     dispatch(FetchStudent(_id)).then((res) => {
  //       if (res.meta.requestStatus === "fulfilled") {
  //         // console.log(res.payload, "payload");
  //         // setInitialValues({...initialValues, name: res.payload.name});
  //       } else if (res.meta.requestStatus === "rejected") {
  //         return notify(res.payload);
  //       }
  //     });
  //   }
  // }, []);


  function getItem(label, key, icon, children, type, danger, disabled) {
    return {
      key,
      icon,
      children,
      label,
      danger,
      disabled,
      type
    };
  }
  const adminItems = [
    getItem(
      <Link to=''>Dashboard</Link>,
      "1",
      <Icon icon='akar-icons:dashboard' />
    ),
    getItem(
      "Your Projects",
      "grp1",
      <Icon icon='icon-park-outline:workbench' />,
      [
        getItem(
          <Link to='project'>Capstone project</Link>,
          "grp2",
          <Icon icon='icon-park-outline:workbench' />,
          [
            getItem(<Link to=''>Frontend Team</Link>, "2"),
            getItem(<Link to=''>Backend Team</Link>, "3"),
            getItem(<Link to=''>Design Team</Link>, "4"),
          ]
        ),
      ],
      "group"
    ),
    { type: "divider" },
    getItem(
      <Link to='create-project'>Create New Project</Link>,
      "5",
      <Icon icon='mdi:create-new-folder-outline' />
    ),
    getItem(
      <span onClick={() => dispatch(authLogout())}>Logout</span>,
      "6",
      <Icon icon='humbleicons:logout' />,
      null,
      null,
      true
    ),
  ];

  const teacherItems = [
    getItem(
      <Link to=''>Dashboard</Link>,
      "1",
      <Icon icon='akar-icons:dashboard' />
    ),
    getItem(
      <Link to='take-attendance'>Take Attendance</Link>,
      "2",
      <Icon icon='mdi:tick-all' />
    ),
    getItem(
      <Link to='my-courses'>My Courses</Link>,
      "3",
      <Icon icon='tdesign:course' />
    ),
    getItem(
      <span onClick={() => dispatch(authLogout())}>Logout</span>,
      "5",
      <Icon icon='humbleicons:logout' />,
      null,
      true
    ),
  ];
  const studentItems = [
    getItem(
      <Link to=''>Dashboard</Link>,
      "1",
      <Icon icon='akar-icons:dashboard' />
    ),
    getItem(
      <Link to='my-courses'>My Courses</Link>,
      "2",
      <Icon icon='tdesign:course' />
    ),
    getItem(
      <span onClick={() => dispatch(authLogout())}>Logout</span>,
      "3",
      <Icon icon='humbleicons:logout' />,
      null,
      true
    ),
  ];
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <Layout
      style={{
        minHeight: "100vh",
      }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        theme='light'>
        <div className='demo-logo-vertical p-4' >
          <img
          src={dashtrack}
          alt='dashtrack'
          className=''
          />
        </div>
        <Menu
          theme='light'
          defaultSelectedKeys={["1"]}
          mode='inline'
          items= {adminItems}
        />
      </Sider>
      <Layout>
        <Header
          className='flex justify-between items-center'
          style={{
            padding: 16,
            background: colorBgContainer,
          }}>
          <h1 className='text-2xl'>Hello there, Admin</h1>
          <Link to="profile">
            <Avatar
              className='cursor-pointer flex items-center justify-center'
              size='large'
              icon={<Icon icon='ep:user' />}
            />
          </Link>
        </Header>
        <Content
          style={{
            margin: "0 16px",
          }}>
          <ToastContainer/>
          <Outlet />
        </Content>
        <Footer
          style={{
            textAlign: "center",
          }}>
        </Footer>
      </Layout>
    </Layout>
  );
};
export default DashboardScreen;
