import { MessageList } from "react-chat-elements"
import {Form, Button, Input, Avatar} from 'antd'
import "react-chat-elements/dist/main.css"
import { useState, useRef, useEffect } from "react"
export default function ChatComp(){
    const [message]=Form.useForm()
    const inputRef = useRef(null);

    const [chatData,setChatData]=useState([
        {
            position: "left",
            title: "Admin",
            type: "text",
            text: "Hello, how can I help you?",
            date: new Date(),
        },
        {
            position: "left",
            title: "Admin",
            type: "text",
            text: "I am looking for the best chat solution for my website",
            date: new Date(),
        }
    ])
    useEffect(() => {
        // Focus on the input when the component mounts
        inputRef.current.focus();
    }, [chatData]);
    
    return(
    <>
    <div
     className=" p-5 rounded-lg shadow-lg m-auto mt-4 max-h-96 overflow-y-scroll"
    >
    {
        chatData.map((message, index) => (
            <div className= {message.position==="left" ? "flex gap-1" : "flex gap-1 justify-end"}>
            {
                message.position === "left" ? 
                    <Avatar style={{ backgroundColor: '#f56a00' }}>{message.title[0]}</Avatar> : null
            }
            <MessageList
            key={index}
            className="message-list mt-2 mb-2"
            lockable={true}
            toBottomHeight={"100%"}
                dataSource={[
                    {
                        position: message.position,
                        title: message.title,
                        type: message.type,
                        text: message.text,
                        date: message.date,
                    }
                ]}
                />
            {
                message.position === "right" ? 
                    <Avatar style={{ backgroundColor: '#87d068' }}>{message.title[0]}</Avatar> : null
            }
            </div>
        ))
    }
    <Form
    layout="inline"
    className="width-100% flex gap-3 justify-end"
    form={message}
    onFinish={(e)=>{
        setChatData([...chatData,{position: "right", title:"user", type: "text", text: e.message, date: new Date()}]);
        message.resetFields();}}
    >
        <Form.Item
        name="message"
        rules={[
            {
                required: true,
                message: 'Please input the message!',
            },
        ]}
        >
            <Input
                placeholder="Type here..."
                size="large"
                className="mt-2 shadow-md rounded-lg"
                ref={inputRef}
            />
        </Form.Item>

        <Button htmlType="submit" className="mt-2 width-1/3">Send</Button>
    </Form>
    </div>
    </>
    )
}