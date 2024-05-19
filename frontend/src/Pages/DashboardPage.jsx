import React from "react";
import { Avatar, Card, Table } from "antd";
import Chart from "react-apexcharts";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
const { Meta } = Card;

const DashboardPage = () => {
  const projects = useSelector((state) => state.data.myProjects);
  const unreadNotifications = useSelector(
    (state) => state.data.unreadNotifications
  );

  const adminCardItems = [
    [projects?.length || 0, "Projects", "Registered"],
    [unreadNotifications, "Notifications", "Unread"],
  ];

  return (
    <div className='p-4'>
      <div className='flex flex-wrap gap-2 my-4'>
        {adminCardItems.map((item, index) => {
          return (
            <Card
              style={{
                width: 300,
              }}
              key={index}>
              <Meta
                avatar={<h2 className='text-3xl font-bold'>{item[0]}</h2>}
                title={item[1]}
                description={item[2]}
              />
            </Card>
          );
        })}
      </div>
    </div>
  );
};
export default DashboardPage;
