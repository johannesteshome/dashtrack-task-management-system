import {useEffect, useState} from 'react'
import {DatePicker, Select, Button, Form, Input, Modal, Tabs } from 'antd';
import { TaskData } from '../sampleData/tasksData'
import { TeamData } from '../sampleData/teamData';
import KanbanBoard from '../Components/KanbanBoard';
import TableComp from '../Components/TableComp';
import CalendarComp from '../Components/CalendarComp';
import ChatComp from '../Components/ChatComp';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {useSelector} from 'react-redux'
import io from "socket.io-client";

const url = "http://localhost:5000"
const TextArea = Input.TextArea
const { RangePicker } = DatePicker;


const  TasksPage= () => {
  const navigate = useNavigate();
  const [queryParameters] = useSearchParams();
  const id = queryParameters.get('id')
  const [teamName,setTeamName] = useState("")
  const socket = io("http://localhost:5000");

  
  const [form] = Form.useForm();
  const [taskForm] = Form.useForm();
  
  const [data, setData] = useState([])
  const [columns, setColumns] = useState([...new Set(data.map((task) => task.Status))])
  const {members} = useSelector((state) => state.data.currentProject)
  // console.log(members,"Members")
  const [open, setOpen] = useState(false)
  useEffect(() => {
    if(!id){
      navigate('/dashboard')}

    socket.emit("followTeamChat", id);
    const fetchData = async () => {
      try {
        const response = await axios.get(`${url}/team/getOne/${id}`);
        console.log(response.data.team)
        setTeamName(response.data.team.name)
        setData(response.data.team.tasks)
        setColumns([...new Set(response.data.team.tasks.map((task) => task.Status))])
        console.log(columns, "Columns")
      }
      catch (error) {
        console.log(error);
      }
    } 
    fetchData()
  }, [id])

  const updateData= async (data) => {
    try {
      console.log(data, "Update Data")
      const response = await axios.put(`${url}/task/teamTasks/${id}`, data);
      console.log(response.data)
    }
    catch (error) {
      console.log(error);
    }
  }

  const [addTask, setAddTask] = useState(false)
  const items = [
          {
            key: '1',
            label: 'Board',
            children: <KanbanBoard data = {data} columns = {columns} team={members} id={id} />,
          },
          {
            key: '2',
            label: 'Table',
            children: <TableComp data = {data} setData={setData} column={columns} team={members} id={id}/>,
          },
          {
            key: '3',
            label: 'Calendar',
            children: <CalendarComp data={data}/>,
          },
          {
            key: '4',
            label: 'Chat',
            children: <ChatComp id={id}/>
          },
        ];
  return (
      <div 
      className="flex flex-col w-full h-full bg-gray-100"
      >
        <Modal
          open={open}
          title="Create a new status"
          okText="Create"
          cancelText="Cancel"
          onCancel={() => {setOpen(false)}}
          onOk={() => {
            form
              .validateFields()
              .then((values) => {
                form.resetFields();
                setOpen(false);
                setColumns((prev) => [...prev, values.title]);
              })
              .catch((info) => {
                console.log('Validate Failed:', info);
              });
          }}
        >
          <Form
            form={form}
            layout="vertical"
            name="form_in_modal"
          >
            <Form.Item
              name="title"
              label="Title"
              rules={[
                {
                  required: true,
                  message: 'Please input the status title!',
                },
              ]}
            >
              <Input />
            </Form.Item>
            
          </Form>

        </Modal>
        <Modal
          open={addTask}
          title="Create a new Task"
          okText="Create"
          cancelText="Cancel"
          onCancel={() => {setAddTask(false)}}
          onOk={() => {
            taskForm
              .validateFields()
              .then((values) => {
                console.log(values)
                const task={...values, Title: values.Id,Date: [values.Date[0].$d,values.Date[1].$d]}
                setAddTask(false);
                taskForm.resetFields();
                if(data){
                  updateData([...data,task])
                  setData((prev) => [...prev, task]);
                }
                else{
                  setData([task]);
                  updateData([task])
                }
              })
              .catch((info) => {
                console.log('Validate Failed:', info);
              });
          }}
        >
          <Form
            form={taskForm}
            layout="vertical"
            size = "small"
            name="add task form"
          >
            <Form.Item
              name="Id"
              label="ID"
              rules={[
                {
                  required: true,
                  message: 'Please input the id of the task!',
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="Status"
              label="Status"
              rules={[
                {
                  required: true,
                  message: 'Please input the status of the task!',
                },
              ]}
            >
              <Select
                style={{ width: 120 }}
                options={columns.map((column) => {
                  return {value: column, label: column}
                })}
                />

            </Form.Item>
            <Form.Item
              name="Summary"
              label="Summary"
              rules={[
                {
                  required: true,
                  message: 'Please input the summary of the task!',
                },
              ]}
            >
              <TextArea rows={2}/>
            </Form.Item>
            
            <Form.Item
              name="Priority"
              label="Priority"
              rules={[
                {
                  required: true,
                  message: 'Please input the priority of the task!',
                },
              ]}
            >
              <Select
                placeholder="Please select"
                options={[{value: "Low", label: "Low"}, {value: "Normal", label: "Normal"}, {value: "High", label: "High"}, {value: "Critical", label: "Critical"}]}
              />
            </Form.Item>
            <Form.Item
              name="Date"
              label="Date Range"
              rules={[
                {
                  required: true,
                  message: 'Please input the estimation of the task!',
                },
              ]}
            >
              <RangePicker />
            </Form.Item>
            <Form.Item
              name="Assignee"
              label="Assigned"
              rules={[
                {
                  required: true,
                  message: 'Please input the assigned of the task!',
                },
              ]}
            >
                <Select
                  allowClear
                  placeholder="Please select"
                  options={members.map((member) => {
                    return {value: member.user.name, label: member.user.name}
                  })}
                />
            </Form.Item>
            <Form.Item
              name="Tags"
              label="Tags"
              rules={[
                {
                  required: true,
                  message: 'Please input the Tags of the task!',
                },
              ]}
            >
              <Input />
            </Form.Item>
         
          </Form>

        </Modal>

        <div className="flex justify-between p-5">
          <h1 className="text-3xl my-4 ">{teamName}</h1>
          <div className="flex gap-4">
          <Button
            type="primary"
            className='bg-blue-500 text-white hover:text-blue-500 hover:bg-white'
            onClick={() => {
              setOpen(true);
            }}     
              
          >Create Status</Button>
          <Button
            type="primary"
            className='bg-blue-500 text-white hover:text-blue-500 hover:bg-white'
            onClick={() => {
              setAddTask(true);
            }}
          >Create Tasks</Button>
          </div>


          </div>
          <Tabs defaultActiveKey="1" items={items} className='px-5'/>
         
    </div>
  )
}
export default TasksPage