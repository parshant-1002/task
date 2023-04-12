import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../Context/AuthContext";
import { ChatContext } from "../../../Context/ChatContext";
import { db } from "../../../firebase";
import "./styles.css"
import { images } from "../../../Images";

const Chats = ({ showDirectMessage }) => {
  const [chats, setChats] = useState({});
  const [visible, setVisible] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);
  const [selected, setSelected] = useState(false);
  const [messageList, setMessages] = useState([])
  const [chatId, setChatId] = useState("");
 
  const { data } = useContext(ChatContext);
  const id = data?.groupId || data?.chatId


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

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", id), (doc) => {
      doc?.exists() && setMessages(doc?.data().messages);
    });
    return () => {
      unSub();
    };
  }, [data?.chatId, data?.groupId]);

  useEffect(() => {
   chatId&& updateStatus()
   if(data?.user?.uid===selected){

    resetSeenStatus()
  }
  }, [messageList])


 
   const resetSeenStatus=async()=>{
    await updateDoc(doc(db,"userChats",currentUser?.uid),{
      [chatId+".unseen"]:{
        unseen:0
      },
      [chatId+".lastMessage"]:{
        img:"",
        pdf:"",
        text:""
      }
    })
   } 
 const updateStatus=async()=>{
  messageList?.map((val,i)=>{if(messageList[i].senderId!=currentUser.uid){messageList[i]["status"]=true}})
   await updateDoc(doc(db,"chats",chatId),{
    messages:messageList
});
 
 }
  const handleSelect = async(chatId,u) => {
    setChatId(chatId)
    dispatch({ type: "CHANGE_USER", payload: u });
    dispatch({ type: "GETUSERS", payload: (Object.values(chats)) })
    resetSeenStatus()
     }

  return (
    <div>{
      !visible
        ? <label className="warnmessage">Loading ...</label>
        : <div className="chats">
          {Object.entries(chats)?.sort((a, b) => b[1].date - a[1].date).map((chat, i) => {
            return <div
              className="userChat"
              key={chat[0]}
              onClick={() => {            
                handleSelect(chat[0],chat[1]?.userInfo)
                setSelected(chat[1]?.userInfo?.uid)
              }}>
              <img className="profilePic" src={chat[1]?.userInfo?.photoURL} alt="" />
              <div className="userChatInfo">
                <span className="info">{chat[1]?.userInfo?.displayName}</span> 
                 {chat[1]?.unseen?.unseen>0&&chat[1]?.lastMessage?.text.trim() && <label className="lastmessage" style={{ color: `gold` }}>{chat[1]?.lastMessage?.text}</label>}
                {!chat[1]?.lastMessage?.text && chat[1]?.lastMessage?.img ? <p className="lastmessage">{chat[1]?.lastMessage?.img}</p> : null}
                {!chat[1]?.lastMessage?.text && chat[1]?.lastMessage?.pdf ? <p className="lastmessage">{chat[1]?.lastMessage?.pdf}</p> : null}
                           </div>
                   
              { chat[1]?.unseen?.unseen>0&&<div className="unseenCount">{chat[1]?.unseen?.unseen}</div>}
              {chat[1]?.userInfo?.uid === selected && <img className="eyeImg" src={images.eye} alt=""></img>}
            </div>
          })}
        </div>}
    </div>
  );
};

export default Chats;
