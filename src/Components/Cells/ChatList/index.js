import { collection, deleteField, doc, getDocs, onSnapshot, query, updateDoc } from "firebase/firestore";
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
  const [selectedUser, setSelectedUser] = useState(false);
  const [users, setUsers] = useState([])
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
  const q = query(collection(db, "users"))
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const r = []
    querySnapshot.forEach((doc) => {
        r.push(doc.data());
    });
    setUsers(r);})
return ()=>{
  unsubscribe()
}

}, [])



useEffect(() => {
  chatId&& updateStatus()
  if(data?.user?.uid===selected){
    resetSeenStatus()
  }
}, [messageList])

const removeUser=(id)=>{
  setSelected(null)
updateDoc(doc(db,"userChats",currentUser?.uid),{
  [data?.chatId]:deleteField()
})
dispatch({type:"RESET"})

}

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
  
   selected&& resetSeenStatus()
     }

  return (
    <div>{
      !visible
        ? <label className="warnmessage">Loading ...</label>
        : <div className="chats">
          {Object.entries(chats)?.sort((a, b) => b[1].date - a[1].date).map((chat, i) => {
            return <div id={`chatItem`}>
              <div
              className="userChat"
              key={chat[0]}
              onClick={() => {            
                handleSelect(chat[0],(users.find(val=>val.uid===chat[1]?.userInfo?.uid)))
                setSelected(chat[1]?.userInfo?.uid)
           
              }}>
               <img className="profilePic" src={(users.find(val=>val.uid===chat[1]?.userInfo?.uid))?.photoURL} alt=""/>
              <div className="userChatInfo">
                <span className="info">{(users.find(val=>val.uid===chat[1]?.userInfo?.uid))?.displayName}</span> 
                 {chat[1]?.unseen?.unseen>0&&chat[1]?.lastMessage?.text.trim() && <label className="lastmessage" style={{ color: `gold` }}>{chat[1]?.lastMessage?.text}</label>}
                {!chat[1]?.lastMessage?.text && chat[1]?.lastMessage?.img ? <p className="lastmessage">{chat[1]?.lastMessage?.img}</p> : null}
                {!chat[1]?.lastMessage?.text && chat[1]?.lastMessage?.pdf ? <p className="lastmessage">{chat[1]?.lastMessage?.pdf}</p> : null}
                           </div>
                   
              {chat[1]?.unseen?.unseen>0&&<div className="unseenCount">{chat[1]?.unseen?.unseen}</div>}
              {chat[1]?.userInfo?.uid === selected && <img className="eyeImg" src={images.eye} alt=""></img>}
              </div >
              {chat[1]?.userInfo?.uid === selected &&< div className="clearUser">
              {chat[1]?.userInfo?.uid === selected && <img className="clearUserBtn" src={images.crossWhite} alt="" onClick={()=>{removeUser(chat[1]?.userInfo?.uid)}}></img>}
                </div>}
            </div>
          })}
        </div>}
    </div>
  );
};

export default Chats;
