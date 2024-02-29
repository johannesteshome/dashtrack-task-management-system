import { MessageList } from "react-chat-elements"
import {Form, Button, Input, Avatar} from 'antd'
import "react-chat-elements/dist/main.css"
import { useState, useRef, useEffect } from "react"
import { useSelector } from "react-redux";
import axios from 'axios'

const url="http://localhost:5000/team"
export default function ChatComp({id, socket}) {
    const {_id, name} =useSelector((state)=>state.auth.user)
    const [message]=Form.useForm()
    const inputRef = useRef(null);

    const [chatData,setChatData]=useState([])
    const fetchData=async()=>{
        const {data}=await axios.get(`${url}/getAllChat/${id}`)
        setChatData(data.chats)
    }
    useEffect(() => {
        // Focus on the input when the component mounts
        fetchData()
        inputRef.current.focus();
    }, [id]);

    useEffect(() => {
        socket.on("receiveMessage",(chat)=>{
            fetchData()
            // console.log("Message notified")
            // inputRef.current.focus()
        })
    },[socket])

    const sendChat=async(chat)=>{
        try{
            const response=await axios.put(`${url}/addChat/${id}`,chat)
            socket.emit("send_Message",chat)
            console.log(response.data)
            // inputRef.current.focus();
        }
        catch(error){
            console.log(error)
        }
    }
    
    return(
    <>
    <div
     className=" p-5 rounded-lg shadow-lg m-auto mt-4 max-h-96 overflow-y-scroll"
    >
    {
        chatData.length > 0 && chatData.map((message, index) => (
            <div className= {message.id!==_id ? "flex gap-1" : "flex gap-1 justify-end"}>
            {
                message.id !== _id? 
                    <Avatar style={{ backgroundColor: '#f56a00' }}>{message.name[0]}</Avatar> : null
            }
            <MessageList
            key={index}
            className="message-list mt-2 mb-2"
            lockable={true}
            toBottomHeight={"100%"}
                dataSource={[
                    {
                        position: message.id === _id ? "right":"left",
                        title: message.name,
                        type: "text",
                        text: message.text,
                        date: message.date,
                    }
                ]}
                />
            {
                message.id === _id ? 
                    <Avatar style={{ backgroundColor: '#87d068' }}>{message.name[0]}</Avatar> : null
            }
            </div>
        ))
    }
    <Form
    layout="inline"
    className="width-100% flex gap-3 justify-end"
    form={message}
    onFinish={(e)=>{
        if(chatData){
            setChatData([...chatData,{ id:_id, name :name, text: e.message, date: new Date()}]);
        }
        else{
            setChatData([{ id:_id, name :name, text: e.message, date: new Date()}]);
        }
        sendChat({ id:_id, name :name, text: e.message, date: new Date()});

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