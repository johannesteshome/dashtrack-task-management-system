import { Divider, Button, Table, Popconfirm } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Icon } from "@iconify/react";
import AddTeamMemberModal from "./AddTeamMemberModal";
import CreateTeamModal from "./CreateTeamModal";
import { DeleteProject, GetMyProjects } from "../Redux/features/dataActions";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ProjectsPage = () => {
  const [teamModalOpen, setTeamModalOpen] = useState(false);
  const [membersModalOpen, setMembersModalOpen] = useState(false);
  const dispatch = useDispatch();
  const project = useSelector((state) => state.data.currentProject);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [popOpen, setPopOpen] = useState(false);
  const notify = (message) => {
    toast(message);
  };
  const navigate = useNavigate();

  useEffect(() => {
    if (!project) {
      navigate("/dashboard");
    }
  }, [project]);

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

  const teamData = [];

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
        <a className='bg-red-500 text-white px-4 py-1 rounded '>Remove</a>
      ),
    },
  ];

  let membersData = [];

  if (!project) {
    navigate("/dashboard");
  } else {
    for (let team of project.teams) {
      console.log(team, "team");
      teamData.push({
        key: team._id,
        name: team.name,
        count: team.members.length,
      });
    }

    for (let member of project.members) {
      membersData.push({
        key: member.user._id,
        name: member.user.name,
        email: member.user.email,
      });
    }
  }

  const showPopConfirm = () => {
    setPopOpen(true);
  };

  const handleOk = () => {
    setConfirmLoading(true);
    dispatch(DeleteProject(project._id)).then((res) => {
      console.log(res);
      if (res.payload.success) {
        // setIsLoading(false);
        navigate("/dashboard");
        console.log("here after deleting the project");
        setPopOpen(false);
        setConfirmLoading(false);
        dispatch(GetMyProjects());
        return notify(res.payload.message);
      } else {
        // setIsLoading(false);
        setPopOpen(false);
        setConfirmLoading(false);
        return notify(res.payload.message);
      }
    });
  };
  const handleCancel = () => {
    console.log("Clicked cancel button");
    setPopOpen(false);
  };

  const onTeamModalCreate = (values) => {
    console.log("Received values of form: ", values);
    setTeamModalOpen(false);
  };

  const onMembersModalCreate = (values) => {
    console.log("Received values of form: ", values);
    setMembersModalOpen(false);
  };
  return (
    <div>
      <ToastContainer />
      <div className='flex justify-between items-center'>
        <h1 className='text-3xl m-4 '>{project?.name}</h1>
        <div className='flex items-center gap-4'>
          <Button
            type='default'
            size={"large"}
            className='bg-[#21BFD4] text-white hover:bg-white hover:text-[#21BFD4] flex items-center justify-between gap-2'>
            <Icon icon='clarity:edit-line' />
            Edit Project
          </Button>
          <Popconfirm
            title='Delete Project'
            description='Are you Sure to Delete the Project?'
            open={popOpen}
            onConfirm={handleOk}
            okButtonProps={{
              loading: confirmLoading,
            }}
            onCancel={handleCancel}>
            <Button
              type='default'
              size={"large"}
              className='bg-[#e71313] text-white hover:bg-white hover:text-[#e71313] flex items-center justify-between gap-2'
              onClick={showPopConfirm}>
              <Icon icon='material-symbols:delete-outline' />
              Delete Project
            </Button>
          </Popconfirm>
        </div>
      </div>
      <div>
        <div className='flex justify-between items-center'>
          <h2 className='text-xl my-4'>Teams List</h2>
          <Button
            type='default'
            size={"large"}
            onClick={() => {
              setTeamModalOpen(true);
            }}
            className='bg-[#21BFD4] text-white hover:bg-white hover:text-[#21BFD4] flex items-center gap-2'>
            <Icon icon='fluent:people-team-16-regular' />
            Create Team
          </Button>
          <CreateTeamModal
            open={teamModalOpen}
            onCreate={onTeamModalCreate}
            onCancel={() => {
              setTeamModalOpen(false);
              console.log(teamModalOpen, "the modal");
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
              setMembersModalOpen(true);
            }}
            className='bg-[#21BFD4] text-white hover:bg-white hover:text-[#21BFD4] flex gap-2 items-center'>
            <Icon icon='solar:user-broken' />
            Invite Member
          </Button>
          <AddTeamMemberModal
            open={membersModalOpen}
            onCreate={onMembersModalCreate}
            onCancel={() => {
              setMembersModalOpen(false);
            }}
          />
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
