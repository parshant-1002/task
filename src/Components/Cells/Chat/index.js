import React, { useContext } from "react";
import Cam from "../../../assets/cam.png";
import Add from "../../../assets/add.png";
import More from "../../../assets/more.png";
import Messages from "../Messages";
import Input from "../Inputs";
import { ChatContext } from "../../../Context/ChatContext";
import "./styles.css"
const Chat = () => {
  const { data } = useContext(ChatContext);

  console.log(data?.chatId, data?.chatId =="null", "  data")
  return (
    <div className="mess">
      {data?.chatId =="null"?
        <div className="divDirect">
        <h1 className="directMessage">Select the person to chat</h1>
        </div>
          : <div className="chat">
          <div className="chatInfo">
            <img className="dp" src={data?.user?.photoURL} alt="" />
            <label className="userName">    {data?.user?.displayName}</label>
            <div className="chatIcons">
              <img className="img1" src={Cam} alt="" />
              <img className="img1" src={Add} alt="" />
              <img className="img1" src={More} alt="" />
            </div>
          </div>
          <Messages />
          <Input />
        </div> }
    </div>
  );
};

export default Chat;
