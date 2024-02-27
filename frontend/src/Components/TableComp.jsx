import { useState } from 'react';
import {Space, Table, Tag, Typography, Modal, DatePicker, Select, Button, Form, Input,Popconfirm} from 'antd';

const TextArea = Input.TextArea
export default function TableComp({data,setData, column, team}) {
    const [editTask, setEditTask] = useState(false)
    const [editForm] = Form.useForm();
    const [editData, setEditData] = useState({})
    //TODO: Fix the edit form
    const handleDelete = (Id) => {
        const newData = data.filter((item) => item.Id!== Id);
        setData(newData);
        };
    const columns = [
        {
            title:"ID",
            dataIndex:"Id",
            key:"Id",
            sorter:(a, b) => a.id - b.id
        },
        {
            title:"Status",
            dataIndex:"Status",
            key:"Status",
            filters: column.map((status) => {
                return {text: status, value: status}}),
            onFilter: (value, record) => record.status.indexOf(value) === 0,
            render: status => (
                <Tag color={status === "To Do" ? "blue" : status === "In Progress" ? "orange" : status === "Testing" ? "green" : "red"} key={status}>
                    {status}
                </Tag>
            )
        },
        {
            title:"Summary",
            dataIndex:"Summary",
            key:"Summary"
        },
        {
            title:"Priority",
            dataIndex:"Priority",
            key:"Priority",
            filters: [
                {
                    text: 'Low',
                    value: 'Low',
                },
                {
                    text: 'Medium',
                    value: 'Medium',
                },
                {
                    text: 'High',
                    value: 'High',
                },
                {
                    text: 'Critical',
                    value: 'Critical',
                },
            ],
            onFilter: (value, record) => record.Priority.indexOf(value) === 0,
            render: priority => (
                <Tag color={priority === "Low" ? "blue" : priority === "High" ? "red" : "orange"} key={priority}>
                    {priority}
                </Tag>
            )
        },
        {
            title:"Tags",
            dataIndex:"Tags",
            key:"Tags",
            filters: [
                {
                    text: 'Analyze',
                    value: 'Analyze',
                },
                {
                    text: 'Customer',
                    value: 'Customer',
                },
                {
                    text: 'Improvement',
                    value: 'Improvement',
                },
                {
                    text: 'Testing',
                    value: 'Testing',
                },
                {
                    text: 'Modules',
                    value: 'Modules',
                },
                {
                    text: 'Plan',
                    value: 'Plan',
                },
            ],
            onFilter: (value, record) => record.Tags.indexOf(value) === 0,
            render: tags => (
                tags.split(",").map((tag) => (
                    <Tag color="geekblue" key={tag}>
                        {tag}
                    </Tag>
                ))
            )
        },
        {
            title:"Due Date",
            dataIndex:"date",
            sorter:true,
            key:"date"
        },
        {
            title:"Assigned",
            dataIndex:"Assignee",
            sorter:(a,b)=>a.Assigned.localeCompare(b.Assigned),
            key:"Assignee"
        },
        {
        title: 'Operations',
        dataIndex: 'operations',
        render: (_, record) =>
            data.length >= 1 ? (
            <Space>
                <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.Id)}>
                    <Button danger>Delete</Button>
                </Popconfirm>
                <Button onClick={() => {
                    setEditData(record);
                    console.log(editData)
                    setEditTask(true);
                }}>
                    Edit
                </Button>
            </Space>
            ) : null,

        },]

        return (
            <div>
            <Modal
            open={editTask}
            title="Edit a Task"
            okText="Edit"
            cancelText="Cancel"
            onCancel={() => {setEditTask(false)}}
            onOk={() => {
                editForm
                .validateFields()
                .then((values) => {
                    
                })
                .catch((info) => {
                    console.log('Validate Failed:', info);
                });
            }}
            >
            <Form
                form={editForm}
                layout="vertical"
                size = "small"
                name="add task form"
            >
                <Form.Item
                    name="Id"
                    label="ID"
                    initialValue={editData.Id}
                    rules={[
                        {
                        required: true,
                        message: 'Please input the id of the task!',
                        },
                    ]}
                    >
                    <Input disabled/>
                </Form.Item>
                <Form.Item
                name="Status"
                label="Status"
                initialValue={editData.Status}
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
                initialValue={editData.Summary}
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
                initialValue={editData.Priority}
                rules={[
                    {
                    required: true,
                    message: 'Please input the priority of the task!',
                    },
                ]}
                >
                <Select
                    placeholder="Please select"
                    options={[{value: "Low", label: "Low"}, {value: "Medium", label: "Medium"}, {value: "High", label: "High"}, {value: "Critical", label: "Critical"}]}
                />
                </Form.Item>
                <Form.Item
                name="date"
                label="Due Date"
                // initialValue={editData.date}
                //TODO: Fix the date picker
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
                name="Assignee"
                label="Assigned"
                initialValue={editData.Assignee}
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
                    options={team.map((member) => {
                        return {value: member, label: member}
                    })}
                    />
                </Form.Item>
                <Form.Item
                name="Tags"
                label="Tags"
                initialValue={editData.Tags}
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
            <Table 
            columns={columns} 
            dataSource={data} 
            pagination={{
            pageSize: 8,
            }}/>
            </div>
        )}