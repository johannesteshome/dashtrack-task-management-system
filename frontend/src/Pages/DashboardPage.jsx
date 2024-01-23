import React from "react";
import { Avatar, Card, Table } from "antd";
import Chart from "react-apexcharts";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
const { Meta } = Card;
const teacherAttendanceData = require("../sampleData/teacherAttendanceData.json");
const studentAttendanceData = require("../sampleData/studentAttendanceData.json");





const DashboardPage = () => {
  const { user } = useSelector((state) => state.auth);
  const students = useSelector((state) => state.data.students);
  const teachers = useSelector((state) => state.data.teachers);
  const admins = useSelector((state) => state.data.admins);
  const courses = useSelector((state) => state.data.courses);
  const userData = useSelector((state) => state.data.loggedInUser);

  const adminCardItems = [
    [teachers?.length || 0, "Teachers"],
    [students?.length || 0, "Students"],
    [courses?.length || 0, "Courses"],
    [admins?.length || 0, "Admins"],
  ];

  const teacherCardItems = [
    [userData?.courses?.length || 0, "Courses"],
    ["12", "Sections"],
  ];

  const studentCardItems = [
    [userData?.courses?.length || 0, "Courses"],
    ["2", "Attendances"],
  ];

  console.log(user.role, "user role");
  const membersPercentages = [
      {
      chart: {
        id: "basic-donut",
      },
      labels: ["Team A", "Team B", "Team C", "Team D", "Team E"],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    },
    [44, 55, 41, 17, 15]
  ]

  const websiteVisits = [
    {
      chart: {
        id: "basic-line",
      },
      xaxis: {
        categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999],
      },
      yaxis: {
        title: {
          text: "Value",
        },
      },
    },
    [{
      name: "series-1",
      data: [30, 40, 45, 50, 49, 60, 70, 91],
    }]
  ];

  const attendancesRecorded = [
    {
      chart: {
        id: "basic-column",
      },
      xaxis: {
        categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999],
      },
      yaxis: {
        title: {
          text: "Value",
        },
      },
    },
    [
      {
        name: "series-1",
        data: [30, 40, 45, 50, 49, 60, 70, 91],
      },
    ],
  ];

  const teacherAttendanceColumns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Date",
      dataIndex: "Date",
    },
    {
      title: "Course",
      dataIndex: "Course",
    },
    {
      title: "Section",
      dataIndex: "Section",
    },
    {
      title: "Percentage",
      dataIndex: "Percentage",
    },
    {
      title: "Goto Attendance",
      render: () => <Link to='/:attendanceId'>View</Link>,
    },
  ];

  const studentAttendanceColumns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "id"
    },
    {
      title: "Course",
      dataIndex: "course",
    },
    {
      title: "teacher",
      dataIndex: 'name'
    }
  ]
        

  return (
    <div className='p-4'>
      <div className='flex flex-wrap gap-2 my-4'>
        {user.role === "admin"
          ? adminCardItems.map((item, index) => {
              return (
                <Card
                  style={{
                    width: 300,
                  }}
                  key={index}>
                  <Meta
                    avatar={<h2 className='text-3xl font-bold'>{item[0]}</h2>}
                    title={item[1]}
                    description='Registered'
                  />
                </Card>
              );
            })
          : user.role === "teahcer"
          ? teacherCardItems.map((item, index) => {
              return (
                <Card
                  style={{
                    width: 300,
                  }}
                  key={index}>
                  <Meta
                    avatar={<h2 className='text-3xl font-bold'>{item[0]}</h2>}
                    title={item[1]}
                    description='Registered'
                  />
                </Card>
              );
            })
          : studentCardItems.map((item, index) => {
              return (
                <Card
                  style={{
                    width: 300,
                  }}
                  key={index}>
                  <Meta
                    avatar={<h2 className='text-3xl font-bold'>{item[0]}</h2>}
                    title={item[1]}
                    description='Registered'
                  />
                </Card>
              );
            })}
      </div>

      {user.role === "admin" ? (
        <div className='flex flex-wrap gap-4 my-4'>
          <Card
            title='Website Visits'
            className='w-fit'
            bordered={false}>
            <Chart
              options={websiteVisits[0]}
              series={websiteVisits[1]}
              type='line'
              width='500'
            />
          </Card>
          <Card
            title='Members Percentages'
            className='w-fit'
            bordered={false}>
            <Chart
              options={membersPercentages[0]}
              series={membersPercentages[1]}
              type='polarArea'
              width='500'
            />
          </Card>
          <Card
            title='Attendances Recorded'
            className='w-fit'
            bordered={false}>
            <Chart
              options={attendancesRecorded[0]}
              series={attendancesRecorded[1]}
              type='bar'
              width='500'
            />
          </Card>
        </div>
      ) : user.role === "teacher" ? (
        <div>
          <div className='flex items-center my-4'>
            <h1 className='text-xl font-bold'>Total Attendances</h1>
          </div>
          <Table
            columns={teacherAttendanceColumns}
            dataSource={teacherAttendanceData}
          />
        </div>
      ) : (
        <div>
          <div className='flex items-center my-4'>
            <h1 className='text-xl font-bold'>Total Attendances</h1>
          </div>
          <Table
            columns={studentAttendanceColumns}
            dataSource={studentAttendanceData}
          />
        </div>
      )}
    </div>
  );
};
export default DashboardPage;
