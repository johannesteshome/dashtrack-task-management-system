import { Table, Tag } from "antd";
import { Button } from "antd";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { ExportDataLocal, FetchLogs } from "../Redux/features/dataActions";
import { useEffect } from "react";
import download from "downloadjs";

const columns = [
  {
    title: "User Name",
    width: 100,
    dataIndex: "username",
    key: "username",
    fixed: "left",
  },
  {
    title: "Email",
    width: 100,
    dataIndex: "email",
    key: "email",
    fixed: "left",
  },
  {
    title: "Role",
    dataIndex: "role",
    key: "2",
    width: 150,
    render: (text) => {
      if (text === "admin") {
        return <Tag color='red'>Admin</Tag>;
      } else if (text === "teacher") {
        return <Tag color='green'>Teacher</Tag>;
      } else if (text === "student") {
        return <Tag color='geekblue'>Student</Tag>;
      }
    },
  },
  {
    title: "IP Address",
    dataIndex: "ipAddress",
    key: "1",
    width: 150,
  },

  {
    title: "Action",
    dataIndex: "action",
    key: "3",
    width: 150,
  },
  {
    title: "Time",
    dataIndex: "time",
    key: "4",
    width: 150,
  },
];

const LogsPage = () => {
  const dispatch = useDispatch();
  // useEffect to fetch the logs
  useEffect(() => {
    dispatch(FetchLogs());
  }, []);

  // const exportData = () => {
  //   dispatch(ExportDataLocal()).then((res) => {
  //     console.log(res);
  //     return download(res.payload.jsonData, "logs.json", "application/json");
  //   });
  // }

  const logs = useSelector((state) => state.data.logs);
  const logsData = [];

  for (let log of logs) {
    logsData.push({
      key: log._id,
      username: log.username,
      email: log.email,
      role: log.role,
      ipAddress: log.ipAddress,
      action: log.action,
      time: log.time,
    });
  }
  return (
    <div className='flex flex-col gap-4 my-4'>
      <div className='flex items-center'>
        <h1 className='text-3xl font-bold'>System Activity</h1>
      </div>
      <div className='flex items-center justify-end gap-4'>
        <Button
          download={true}
          onClick={() => {
            dispatch(ExportDataLocal()).then((res) => {
              console.log(res);
              return download(
                res.payload.jsonData,
                "logs.json",
                "application/json"
              );
            });
          }}
          className='flex items-center gap-2 bg-blue-500 text-white hover:text-blue-500 hover:bg-white'>
          <Icon icon='clarity:export-line' />
          Export Data Locally
        </Button>
        <Button className='flex items-center gap-2 bg-blue-500 text-white hover:text-blue-500 hover:bg-white'>
          <Icon icon='material-symbols:cloud-outline' />
          Export Data to Cloud
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={logsData}
        scroll={{
          x: 1500,
          y: 500,
        }}
      />
    </div>
  );
};
export default LogsPage;
