import { doc, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../Context/AuthContext";
import { ChatContext } from "../../../Context/ChatContext";
import { db } from "../../../firebase";
import "./styles.css"
const Chats = ({ showDirectMessage }) => {
  const [chats, setChats] = useState([]);
  const [visible, setVisible] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        setChats(doc.data())
        doc.exists() && setVisible(true)
        showDirectMessage && dispatch({ type: "GETUSERS", payload: (Object.values(doc.data())) })
      });
      return () => {
        unsub();
      };
    };

    currentUser.uid && getChats();
  }, [currentUser.uid]);

  const handleSelect = (u) => {
    dispatch({ type: "CHANGE_USER", payload: u });
    dispatch({ type: "GETUSERS", payload: (Object.values(chats)) })
  };

  return (
    <div>{
      !visible
        ? <label className="warnmessage">Loading ...</label>
        : <div className="chats">
          {Object.entries(chats)?.sort((a, b) => b[1].date - a[1].date).map((chat) => (
            <div
              className="userChat"
              key={chat[0]}
              onClick={() => handleSelect(chat[1].userInfo)}
            >

              <img src={chat[1]?.userInfo?.photoURL} alt="" />
              <div className="userChatInfo">
                <span className="info">{chat[1]?.userInfo?.displayName}</span>
               { chat[1]?.lastMessage?.text&& <p className="lastmessage">{chat[1]?.lastMessage?.text}</p>}
               {  !chat[1]?.lastMessage?.text&&chat[1]?.lastMessage?.img?<p className="lastmessage">{chat[1]?.lastMessage?.img}</p>:null}
               { !chat[1]?.lastMessage?.text&& chat[1]?.lastMessage?.pdf? <p className="lastmessage">{chat[1]?.lastMessage?.pdf}</p>:null}
              </div>
            </div>
          ))}
        </div>}
    </div>
  );
};

export default Chats;
