// libs
import React, { useContext, useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { ChatContext } from "../../../Context/ChatContext";
import { db } from "../../../firebase";

// components
import Message from "./MessageList";

// styles
import "./styles.css"

// consts
import { COLLECTION_NAME } from "../../../Shared/Constants";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const { data } = useContext(ChatContext);
  const id = data?.groupId || data?.chatId
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

