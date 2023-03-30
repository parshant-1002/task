import { doc, getDoc } from "firebase/firestore";
import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../../Context/AuthContext";
import { ChatContext } from "../../../Context/ChatContext";
import { db } from "../../../firebase";
import "./styles.css"
import pdfIcon from "../../../assets/download11.png"
const Message = ({ message }) => {

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  const [gotdata, setGotData] = useState()
  const date = new Date()
  const time = `${date.getHours()}:${date.getMinutes()}`
  const ref = useRef();

  useEffect(() => {
    const get = async () => {
      const res = await getDoc(doc(db, "users", message.senderId))
      setGotData(res.data())
    }
    get()
  }, []);

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);
  console.log(message.senderId === currentUser.uid,"weugr")
  return (
    <div
      ref={ref}
      className={`message${message.senderId === currentUser.uid && "owner"}`} >
      <div className="messageInfo">
        <div>

        {gotdata && <img className="senderimg"
          src={
            gotdata?.photoURL
          }
          alt=""
          />}
          </div>
      <div className="messageContent">
        <div>

          {gotdata && <label className="senderName">    {gotdata.displayName}</label>}
        {message?.date == time ? <span className="atTime">Just Now</span> : <span className="atTime">{message.date}</span>}
        </div>
        {message?.text && <p className="messgtext">{message.text}</p>}
        {message?.img && <img className="chatimg" src={message.img} alt="" />}
        {message?.file && <a href={message.file} download  ><img className="pdf" src={pdfIcon}></img></a>}
        {message?.fileName && <label className="fileName">{message.fileName}</label>}

      </div>
      </div>
    </div>
  );
};

export default Message;
