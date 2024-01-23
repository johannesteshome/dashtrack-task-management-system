import { Button, Table } from "antd";
import { useState } from "react";
const studentData = require("../sampleData/studentData.json");

let sectionFilter = [];
let studentSections = [];
studentData.map((student) => {
    student.key = student.studentID
  if (studentSections.includes(student.section)) return;
  sectionFilter.push({ text: student.section, value: student.section });
  studentSections.push(student.section);
});

const columns = [
  {
    title: "Student Name",
    dataIndex: "name",
    sorter: (a, b) => a.name.length - b.name.length,
    sortDirections: ["descend"],
  },
  {
    title: "Student ID",
    dataIndex: "studentID",
    key: "studentID",
  },
  {
    title: "Gender",
    dataIndex: "gender",
  },
  {
    title: "Section",
    dataIndex: "section",
    filters: sectionFilter,
    onFilter: (value, record) => record.section.startsWith(value),
    filterMode: "tree",
    filterSearch: true,
    sorter: (a, b) => a.name.length - b.name.length,
    sortDirections: ["descend"],
  },
];

const TakeAttendancePage = () => {
//   console.log(sectionFilter, "sectionFilter");
//   console.log(studentData);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    
  const onSelectChange = (newSelectedRowKeys) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
    ],
  };

  return (
    <div className='my-4'>
      <div className='flex items-center my-4'>
        <h1 className='text-3xl font-bold'>Attendance Form</h1>
      </div>
      <div className='flex flex-col items-end justify-center'>
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={studentData}
                  pagination={false}
                  className="w-full"
        />
        <Button
          type='default'
          className='mt-4 w-fit bg-blue-500 text-white hover:bg-white hover:text-blue-500'>
          Take Attendance
        </Button>
      </div>
    </div>
  );
};
export default TakeAttendancePage;
