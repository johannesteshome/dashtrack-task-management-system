import { useEffect, useState } from 'react';
import {Space, Table, Tag, Typography, Modal, DatePicker, Select, Button, Form, Input,Popconfirm} from 'antd';
import axios from 'axios';

const url = "http://localhost:5000"
const TextArea = Input.TextArea
const {RangePicker} = DatePicker

export default function TableComp({data,setData, column, team, id}) {
    const [editTask, setEditTask] = useState(false)
    const [editForm] = Form.useForm();
    const [editData, setEditData] = useState({})

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
    const handleDelete = (Id) => {
        const newData = data.filter((item) => item.Id!== Id);
        setData(newData);
        updateData(newData);
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
            title:"Date Range",
            dataIndex:"Date",
            sorter:true,
            key:"Date",
            render: date => (
                <Typography.Text>{new Date(date[0]).toLocaleDateString()} - {new Date(date[1]).toLocaleDateString()}</Typography.Text>
            )
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
                    editForm.resetFields()
                    setEditData({Id: record.Id, Status: record.Status, Summary: record.Summary, Priority: record.Priority, Assignee: record.Assignee, Tags: record.Tags});
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
                    console.log(values);
                    const newData = data.map((item) => {
                        if (item.Id === values.Id) {
                            return {...values, Title:values.Id, Date: values.Date.$d};
                        }
                        return item;
                    });
                    setData(newData);
                    updateData(newData)
                    setEditTask(false);
                    editForm.resetFields();
                    
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
                initialValues={editData}
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
                    <Input disabled/>
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
                    options={[{value: "Low", label: "Low"}, {value: "Medium", label: "Medium"}, {value: "High", label: "High"}, {value: "Critical", label: "Critical"}]}
                />
                </Form.Item>
                <Form.Item
                name="Date"
                label="Due Date"
                //TODO: Fix the date picker
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
                    options={team.map((member) => {
                        return {value: member, label: member}
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
            <Table 
            columns={columns} 
            dataSource={data} 
            pagination={{
            pageSize: 8,
            }}/>
            </div>
        )}
