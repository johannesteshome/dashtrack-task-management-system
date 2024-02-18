import { Divider, Button, Table } from "antd";
import { useState } from "react";
import { Icon } from "@iconify/react";
import AddTeamMemberModal from "./AddTeamMemberModal";
import CreateTeamModal from "./CreateTeamModal";
const teamColumns = [
  {
    title: "Team Name",
    dataIndex: "name",
  },
  {
    title: "Team Members Count",
    dataIndex: "count",
    width: "180px",
  },
  {
    title: "Action",
    render: () => (
      <a className='bg-red-500 text-white px-4 py-1 rounded '>Delete</a>
    ),
  },
];

const teamData = [
  {
    key: "1",
    name: "Frontend Team",
    count: 4,
  },
  {
    key: "2",
    name: "Backend Team",
    count: 2,
  },
  {
    key: "3",
    name: "Design Team",
    count: 3,
  },
];

const membersColumns = [
  {
    title: "Name",
    dataIndex: "name",
  },
  {
    title: "Email",
    dataIndex: "email",
  },
  {
    title: "Action",
    render: () => (
      <a className='bg-red-500 text-white px-4 py-1 rounded '>Delete</a>
    ),
  },
];

const membersData = [
  {
    key: "1",
    name: "Yabsera Haile",
    email: "yabserahaile@gmail.com",
  },
  {
    key: "2",
    name: "Haymanot Demis",
    email: "haymanotdemis@gmail.com",
  },
  {
    key: "3",
    name: "Mihret Tibebe",
    email: "mihrettibebe@gmail.com",
  },
];

const ProjectsPage = () => {
  const [open, setOpen] = useState(false);

  const onCreate = (values) => {
    console.log("Received values of form: ", values);
    setOpen(false);
  };
  return (
    <div>
      <div className='flex justify-between items-center'>
        <h1 className='text-3xl m-4 '>Capstone Project</h1>
        <Button
          type='default'
          size={"large"}
          className='bg-[#21BFD4] text-white hover:bg-white hover:text-[#21BFD4] flex items-center justify-between gap-2'>
          <Icon icon='clarity:edit-line' />
          Edit Project
        </Button>
      </div>
      <div>
        <div className='flex justify-between items-center'>
          <h2 className='text-xl my-4'>Teams List</h2>
          <Button
            type='default'
            size={"large"}
            onClick={() => {
              setOpen(true);
            }}
            className='bg-[#21BFD4] text-white hover:bg-white hover:text-[#21BFD4] flex items-center gap-2'>
            <Icon icon='fluent:people-team-16-regular' />
            Create Team
          </Button>
          <CreateTeamModal
            open={open}
            onCreate={onCreate}
            onCancel={() => {
              setOpen(false);
              console.log(open);
            }}
          />
        </div>
        <Table
          columns={teamColumns}
          dataSource={teamData}
          size='middle'
        />
      </div>
      <div>
        <div className='flex justify-between items-center'>
          <h2 className='text-xl my-4'>Team Members List</h2>
          <Button
            type='default'
            size={"large"}
            onClick={() => {
              setOpen(true);
            }}
            className='bg-[#21BFD4] text-white hover:bg-white hover:text-[#21BFD4] flex gap-2 items-center'>
            <Icon icon='solar:user-broken' />
            Add Member
            <AddTeamMemberModal
              open={open}
              onCreate={onCreate}
              onCancel={() => {
                setOpen(false);
              }}
            />
          </Button>
        </div>
        <Table
          columns={membersColumns}
          dataSource={membersData}
          size='middle'
        />
      </div>
    </div>
  );
};
export default ProjectsPage;
