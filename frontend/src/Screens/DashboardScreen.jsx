import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { Avatar, Layout, Menu, theme, Badge } from "antd";
import { Outlet, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import io from "socket.io-client";

import dashtrack from "../img/dashtrack-banner.png";
import { authLogout } from "../Redux/features/authActions";
import LoadingScreen from "./LoadingScreen";
import ReactLoading from "react-loading";

import { ToastContainer, toast } from "react-toastify";
import {
  FetchCurrentUser,
  GetMyProjects,
  GetOneProject,
  GetUnreadNotifications,
  GetAllNotifications
} from "../Redux/features/dataActions";
const { Header, Content, Footer, Sider } = Layout;

const notify = (text) => toast(text);

const DashboardScreen = () => {
  const [collapsed, setCollapsed] = useState(false);
  const dispatch = useDispatch();
  const cookieExists = Cookies.get("refreshToken") === undefined;
  const isLoading = useSelector(
    (state) => state.data.loading || state.auth.loading
  );
  const socket = io("http://localhost:5000");


  if (!cookieExists) {
    dispatch(authLogout());
  }

  const {_id} = useSelector((state) => state.auth.user)

  const { email, name } = useSelector((state) => state.data.loggedInUser);
  const projects = useSelector((state) => state.data.myProjects) || [];
  let menuItems = [];
  // const [menuItems, setMenuItems] = useState([])

  useEffect(() => {
    socket.emit("subscribeToNotifications", email);
    dispatch(GetMyProjects());
    dispatch(GetUnreadNotifications(_id));
    dispatch(FetchCurrentUser(_id))

    return () => {
      socket.disconnect();
    };
  }, []);

  socket.on("notification", (notification) => {
    console.log("recieving the notification");
    dispatch(GetUnreadNotifications(_id));
    dispatch(GetAllNotifications(_id));
    notify('New notification: ' + notification.text)

  });

  const unreadNotifications = useSelector(
    (state) => state.data.unreadNotifications
  );

  for (let project of projects) {
    let teams = [];
    let i = 0;
    if (project.teams.length === 0) {
      teams.push(
        getItem(
          <Link to='create-team'>No Team</Link>,
          ++i,
          <Icon icon='radix-icons:value-none' />,
          null,
          null,
          null,
          true
        )
      );
    } else {
      for (let team of project.teams) {
        teams.push(getItem(<Link to={`teams/?id=${team._id}`}>{team.name}</Link>, ++i));
      }
    }

    menuItems.push(
      getItem(
        <Link
          to={`project/${project._id}`}
          onClick={() => dispatch(GetOneProject(project._id))}>
          {project.name}
        </Link>,
        project._id,
        <Icon icon='icon-park-outline:workbench' />,
        teams
      )
    );
  }

  function getItem(label, key, icon, children, type, danger, disabled) {
    return {
      key,
      icon,
      children,
      label,
      danger,
      disabled,
      type,
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
      menuItems,
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
        <div className='demo-logo-vertical p-4'>
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
          items={adminItems}
        />
      </Sider>
      <Layout>
        <Header
          className='flex justify-between items-center'
          style={{
            padding: 16,
            background: colorBgContainer,
          }}>
          <h1 className='text-2xl'>{'Hello there, ' + name}</h1>
          <div className='flex items-center justify-center gap-4'>
            <Link to='notifications'>
              <Badge
                size='small'
                dot={ unreadNotifications > 0 ? true : false}>
                <Avatar
                  className='cursor-pointer flex items-center justify-center'
                  size='large'
                  icon={<Icon icon='iconamoon:notification' />}
                />
              </Badge>
            </Link>
            <Link to='profile'>
              <Avatar
                className='cursor-pointer flex items-center justify-center'
                size='large'
                icon={<Icon icon='ep:user' />}
              />
            </Link>
          </div>
        </Header>
        <Content
          style={{
            margin: "0 16px",
          }}>
          <ToastContainer />
          {isLoading ? (
            <div className='flex items-center justify-center h-full'>
              <ReactLoading
                type='balls'
                color='#21BFD4'
              />
            </div>
          ) : (
            <Outlet />
          )}
        </Content>
        <Footer
          style={{
            textAlign: "center",
          }}></Footer>
      </Layout>
    </Layout>
  );
};
export default DashboardScreen;
