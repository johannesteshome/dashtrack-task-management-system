import {Space, Table, Tag, Typography } from 'antd';
export default function TableComp({data}) {
    const columns = [
        {
            title:"ID",
            dataIndex:"id",
            key:"id",
            sorter:(a, b) => a.id - b.id
        },
        {
            title:"Status",
            dataIndex:"status",
            key:"status",
            filters: [
                {
                    text: 'To Do',
                    value: 'To Do',
                },
                {
                    text: 'In Progress',
                    value: 'In Progress',
                },
                {
                    text: 'Testing',
                    value: 'Testing',
                },
                {
                    text: 'Done',
                    value: 'Done',
                },
            ],
            onFilter: (value, record) => record.status.indexOf(value) === 0,
            render: status => (
                <Tag color={status === "To Do" ? "blue" : status === "In Progress" ? "orange" : status === "Testing" ? "green" : "red"} key={status}>
                    {status}
                </Tag>
            )
        },
        {
            title:"Summary",
            dataIndex:"summary",
            key:"summary"
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
            dataIndex:"Assigned",
            sorter:(a,b)=>a.Assigned.localeCompare(b.Assigned),
            key:"Assigned"
        },
        {
            title: 'Action',
            render: () => (
            <Space>
                <Typography.Link>Edit</Typography.Link>
                <Typography.Link>Delete</Typography.Link>
            </Space>
            ),
        },]

        return (
            <Table 
            columns={columns} 
            dataSource={data} 
            pagination={{
            pageSize: 8,
            }}/>
        )}
