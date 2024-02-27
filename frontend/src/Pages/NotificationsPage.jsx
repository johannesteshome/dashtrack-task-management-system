import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import io from "socket.io-client";
import { GetAllNotifications, ReadNotification, DeleteNotification } from "../Redux/features/dataActions";
import { List, Avatar, Button } from "antd";
import { Icon } from "@iconify/react";
import moment from "moment/moment";

const NotificationsPage = () => {
  const userID = useSelector((state) => state.auth.user._id);
  // const [notifications, setNotifications] = useState([]);
  const dispatch = useDispatch();
  const socket = io("http://localhost:5000");

  useEffect(() => {
    // Emit the user's ID to the server to subscribe to notifications
    socket.emit("subscribeToNotifications", userID);

    dispatch(GetAllNotifications(userID));

    // Clean up the socket connection when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, []);

  const notificationsData = useSelector((state) => state.data.notifications);
  console.log(notificationsData, "notificationsData");

  const markOneRead = (id) => {
      console.log(id);
      dispatch(ReadNotification(id))

    };
    
    const deleteNotification = (id) => {
        console.log(id);
        dispatch(DeleteNotification(id))
    }

  //   const handleCreateNotification = () => {
  //     console.log("sending the notification");
  //     const newNotification = {
  //       user: userID,
  //       text: "New notification",
  //     };

  //     // Emit the createNotification event to the server
  //     socket.emit("createNotification", newNotification);
  //     // Listen for new notifications from the server
  //     socket.on("notification", (notification) => {
  //       console.log("recieving the notification");
  //       setNotifications((prevNotifications) => [
  //         ...prevNotifications,
  //         notification,
  //       ]);
  //     });
  //   };

  return (
    <div>
      <div className='flex items-center justify-between '>
        <h1 className='text-3xl m-4 '>Notifications</h1>
        <div className='flex items-center gap-4'>
          <Button className='bg-[#21BFD4] text-white hover:bg-white flex items-center justify-center w-fit h-fit '>
            {" "}
            Mark all read{" "}
          </Button>
          <Button className='bg-red-500 text-white hover:bg-white flex items-center justify-center w-fit h-fit '>
            {" "}
            Delete All{" "}
          </Button>
        </div>
      </div>
      {/* <button onClick={handleCreateNotification}>Send Notification</button> */}
      <List
        itemLayout='horizontal'
        className='bg-[#FFFFFF] w-full h-full p-6 rounded'
        dataSource={notificationsData}
        pagination={{
          pageSize: 10,
        }}
        renderItem={(item, index) => (
          <List.Item>
            <List.Item.Meta
                    className={`w-full h-full ${item.read ? "" : "font-bold italic"}`}
                    key={index}
              avatar={
                <Avatar
                  className='text-black w-full h-full'
                  src={
                    <Icon
                      icon='iconamoon:notification'
                      className='w-8 h-8'
                    />
                  }
                />
              }
              title={item.text}
              description={`${moment(item.createdAt).fromNow()} ${
                item.read ? "" : " - Unseen Notification"
              }`}
            />
            <div className='flex items-center justify-between gap-4'>
              <Button
                className='bg-[#21BFD4] text-white hover:bg-white flex items-center justify-center w-fit h-fit '
                onClick={markOneRead(item._id)}>
                {" "}
                <Icon
                  icon='mdi:tick-all'
                  className='w-4 h-4'
                />{" "}
              </Button>
              <Button className='bg-red-500 text-white hover:bg-white flex items-center justify-center w-fit h-fit ' onClick={deleteNotification(item._id)}>
                {" "}
                <Icon
                  icon='material-symbols:delete-outline'
                  className='w-4 h-4'
                />{" "}
              </Button>
            </div>
          </List.Item>
        )}
      />
    </div>
  );
};
export default NotificationsPage;
