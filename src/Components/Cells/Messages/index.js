import { updateCurrentUser } from "firebase/auth";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../Context/AuthContext";
import { ChatContext } from "../../../Context/ChatContext";
import { auth, db } from "../../../firebase";
import Message from "./MessageList";
import "./styles.css"
import { COLLECTION_NAME } from "../../../Shared/Constants";
const Messages = () => {
  const [messages, setMessages] = useState([]);
  const { data } = useContext(ChatContext);
  const id = data?.groupId || data?.chatId
  const { currentUser } = useContext(AuthContext)
  useEffect(() => {
    const unSub = onSnapshot(doc(db, COLLECTION_NAME?.CHAT_DATA, id), (doc) => {
      doc?.exists() && setMessages(doc?.data().messages);
    });
    return () => {
      unSub();
    };
  }, [data?.chatId, data?.groupId]);



  return (
    <div className="messages">
      {messages?.map((m) => (
        <Message message={m} key={m?.id} messages={messages} />
      ))}
    </div>
  );
};
export default Messages;

