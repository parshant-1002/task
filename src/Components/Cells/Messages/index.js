import { updateCurrentUser } from "firebase/auth";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../Context/AuthContext";
import { ChatContext } from "../../../Context/ChatContext";
import { auth, db } from "../../../firebase";
import Message from "../../Atoms/MessageList";
import "./styles.css"
const Messages = () => {
  const [messages, setMessages] = useState([]);
  const { data } = useContext(ChatContext);
  const id = data?.groupId || data?.chatId

 useEffect(() => {
   const unSub = onSnapshot(doc(db, "chats", id), (doc) => {
     doc?.exists() && setMessages(doc?.data().messages);
    });
    return () => {
      unSub();
    };
  }, [data?.chatId, data?.groupId]);
  
  return (
    <div className="messages">
      {messages?.map((m) => (
        <Message message={m} key={m?.id} messages={messages}/>
      ))}
    </div>
  );
};
export default Messages;

