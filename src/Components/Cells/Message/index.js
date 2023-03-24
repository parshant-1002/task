import React, { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../../../Context/AuthContext";
import { ChatContext } from "../../../Context/ChatContext";
import "./styles.css"
const Message = ({ message }) => {
    // const [messagetime,setMessageTime]=useState()
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  const date =new Date()
  const time=`${date.getHours()}:${date.getMinutes()}`
  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  return (
    <div
      ref={ref}
      className={`message${message.senderId === currentUser.uid && "owner"}`}
    >
      <div className="messageInfo">
        <img className="senderimg"
          src={
            message.senderId === currentUser.uid
              ? currentUser.photoURL
              : data.user.photoURL
          }
          alt=""
        />
    
      {message.date==time?<span>Just Now</span>:  <span>{message.date}</span>}
      </div>
      <div className="messageContent">
        <p className="messgtext">{message.text}</p>
        {message.img && <img className="chatimg" src={message.img} alt="" />}
      </div>
    </div>
  );
};

export default Message;
