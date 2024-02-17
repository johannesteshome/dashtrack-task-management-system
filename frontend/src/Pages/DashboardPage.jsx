import React from "react";
import { Avatar, Card, Table } from "antd";
import Chart from "react-apexcharts";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
const { Meta } = Card;
const teacherAttendanceData = require("../sampleData/teacherAttendanceData.json");
const studentAttendanceData = require("../sampleData/studentAttendanceData.json");





const DashboardPage = () => {

  const adminCardItems = [
    [ 0, "Projects", "Registered"],
    [ 0, "Tasks", "Assigned"],
    [ 0, "Tasks", "Overdue"],
    [ 0, "Notifications", "Unread"],
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
            })
            }
      </div>
    </div>
  );
};
export default DashboardPage;
