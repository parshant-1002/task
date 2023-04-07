import { doc, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../Context/AuthContext";
import { ChatContext } from "../../../Context/ChatContext";
import { db } from "../../../firebase";
import "./styles.css"
import eye from "../../../assets/eye.png"
const Chats = ({ showDirectMessage }) => {
  const [chats, setChats] = useState({});
  const [visible, setVisible] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);
  const [selected, setSelected] = useState(false);
  const [seenColor,setSeenColor]=useState("Gold")

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, "userChats", currentUser?.uid), (doc) => {
        
        setChats(doc.data())
        doc.exists() && setVisible(true)
        showDirectMessage && dispatch({ type: "GETUSERS", payload: (Object.values(doc.data())) })
      });
      return () => {
        unsub();
      };
    };

    currentUser?.uid && getChats();
  }, [currentUser?.uid]);

  const handleSelect = (u) => {
setSeenColor("white")
    dispatch({ type: "CHANGE_USER", payload: u });
    dispatch({ type: "GETUSERS", payload: (Object.values(chats)) })
  };

  return (
    <div>{
      !visible
        ? <label className="warnmessage">Loading ...</label>
        : <div className="chats">
          {Object.entries(chats)?.sort((a, b) => b[1].date - a[1].date).map((chat,i) => {

            return <div
            className="userChat"
            key={chat[0]}
            onClick={() =>{ handleSelect(chat[1].userInfo)
              setSelected(chat[1].userInfo.uid)
            }}
            >

              <img src={chat[1]?.userInfo?.photoURL} alt="" />
              <div className="userChatInfo">
                <span className="info">{chat[1]?.userInfo?.displayName}</span>
               { chat[1]?.lastMessage?.text&& <label className="lastmessage" activeStyle={{color:`gold`}}>{chat[1]?.lastMessage?.text}</label>}
               {  !chat[1]?.lastMessage?.text&&chat[1]?.lastMessage?.img?<p className="lastmessage">{chat[1]?.lastMessage?.img}</p>:null}
               { !chat[1]?.lastMessage?.text&& chat[1]?.lastMessage?.pdf? <p className="lastmessage">{chat[1]?.lastMessage?.pdf}</p>:null}
              </div>
               {/* {false&&<div className="recent"></div>} */}
               {chat[1].userInfo.uid==selected&&<img className="eyeImg" src={eye} alt=""></img>}
            </div>
          })}
        </div>}
    </div>
  );
};

export default Chats;
