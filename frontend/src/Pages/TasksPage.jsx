import {useState} from 'react'
import {DatePicker, Select, Button, Form, Input, Modal, Tabs } from 'antd';
import { TaskData } from '../sampleData/tasksData'
import { TeamData } from '../sampleData/teamData';
import KanbanBoard from '../Components/KanbanBoard';


const TextArea = Input.TextArea
const  TasksPage= () => {
  const [form] = Form.useForm();
  const [taskForm] = Form.useForm();
  

  const [data, setData] = useState(TaskData)
  const [columns, setColumns] = useState(["To Do", "In Progress", "Testing", "Done"])
  const [team, setTeam] = useState(TeamData)
  const [open, setOpen] = useState(false)
  const [addTask, setAddTask] = useState(false)
  const items = [
          {
            key: '1',
            label: 'Board',
            children: <KanbanBoard data = {data} columns = {columns}/>,
          },
          {
            key: '2',
            label: 'Table',
            children: 'Content of Tab Pane 2',
          },
          {
            key: '3',
            label: 'Calendar',
            children: 'Content of Tab Pane 3',
          },
          {
            key: '4',
            label: 'Chat',
            children: 'Content of Tab Pane 4',
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
                console.log(values);
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
                form.resetFields();
                console.log(values);
                setAddTask(false);
                setData((prev) => [...prev, values]);
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
              name="id"
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
              name="status"
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
              name="summary"
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
              name="priority"
              label="Priority"
              rules={[
                {
                  required: true,
                  message: 'Please input the priority of the task!',
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="date"
              label="Due Date"
              rules={[
                {
                  required: true,
                  message: 'Please input the estimation of the task!',
                },
              ]}
            >
              <DatePicker />
            </Form.Item>
            <Form.Item
              name="assigned"
              label="Assigned"
              rules={[
                {
                  required: true,
                  message: 'Please input the assigned of the task!',
                },
              ]}
            >
                <Select
                  mode="multiple"
                  allowClear
                  placeholder="Please select"
                  options={team.map((member) => {
                    return {value: member, label: member}
                  })}
                />
            </Form.Item>
          </Form>

        </Modal>

        <div className="flex justify-between p-5">
          <h1 className="text-3xl m-4 ">Tasks Page</h1>
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
          <Tabs defaultActiveKey="1" items={items} />
         
    </div>
  )
}
export default TasksPage