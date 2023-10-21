import React , { useEffect, useState, useRef } from "react"
// import { Row , Col } from "react-bootstrap"
import { Row, Col } from 'antd';

import {ChatFeed, ChatBubble, Message} from 'react-chat-ui'
// import Sidebar from "../../component/Sidebar"
import "../styles/chat.css";
import user_icon from "../imgs/user.png";
import Iris from "../imgs/IRIS.png";
import send from "../imgs/send.png"
import api from "../utils/api";

// socket
const endpoint = "http://140.117.71.98:4001"
// const socket = socketIOClient(endpoint);

function Chatbox() {
  const [message, setMessage] = useState([new Message({id:1 ,message: 'Hello World!'})])
  
  // const [current, setCurrent] = useState(1);
  let input = useRef();

  const onMessageSubmit = (e) => {
    const data = input;
    e.preventDefault();
    if (!input.value) {
      return false;
    }
    pushMessage(0, data.value);
    // api code
    // get dialog key : localStorage.getItem('key');
    const api_data = {
      'zone' : "HQ",
      "start_date" : "2023-09-18",
      "end_date" : "2023-09-24",
      "dept" : "DEPT4",
      "conversation_id" : localStorage.getItem("conversation_id"),
    };
    api.post("/hr/dashboard/llmrealtime/",api_data).then(res => {
      console.log(res);
    })
    // setCurrent(1)
    data.value = '';
    return true;
  }

  useEffect(()=>{
    localStorage.setItem('conversation_id', 0)
  })

  function pushMessage(recipient, msg) {
    const newMessage = new Message({
      id: recipient,
      message : msg,
      senderName: recipient,
    });
    setMessage([...message, newMessage]);
  }

  //const messages = message;
  const messages = message.map((msg,id)=>{
    return(
      <Row >
        <div className={"chat"+"-"+msg.id}>
          {msg.id? <img className="chat-icon" src={Iris} alt="profile_pic" />:""}
          {msg.id?"":<img className="chat-icon" src={user_icon} alt="profile_pic" />}
          <ChatBubble  message={msg} />
        </div>
      </Row>
    )
  })
  

  return(
    <div className="chatbox">
      {messages}
      <div>
        <form id="message-form" onSubmit={onMessageSubmit}>
          <input ref={m => input = m} id="input" placeholder="Type your message..."></input>
          <img id="send-btn" onClick={onMessageSubmit} src={send}></img>
        </form>
      </div>
    </div>
  )
}

export default Chatbox;