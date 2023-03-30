import React, { useContext, useEffect, useState } from "react";
import Details from "../../Atoms/ChannelOrUserDetails";
import Add from "../../../assets/add.png";
import More from "../../../assets/more.png";
import bg from "../../../assets/bg.png"
import Messages from "../Messages";
import Input from "../Inputs";
import { ChatContext } from "../../../Context/ChatContext";
import {collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../../../firebase";
import { AuthContext } from "../../../Context/AuthContext";
import SearchingUser from "../SearchingUser";
import "./styles.css"
const Chat = () => {
  const [showUserModal, setShowUserModal] = useState(false)

  const { data } = useContext(ChatContext);
  const [details, setDetails] = useState(false)
  const [members, setMembers] = useState([])
  const [users,setUsers]=useState([])
  const { currentUser } = useContext(AuthContext);
  const combinedId = currentUser.uid + data?.channelName

 useEffect(() => {
    setDetails(false)
  }, [data])



  const  handleGetUsers=async()=>{
    try {
      const querySnapshot = await getDocs(collection(db, "users"))
      const r=[]
      querySnapshot.forEach((doc) => {
        
          r.push(doc.data())
      });
      setUsers(r);
  } catch (err) {
      console.log(err,"Error in getting User Details")
  }
   }



  const getDetails = async () => {
    const groupData = await getDoc(doc(db, "userChannels", currentUser.uid))
    const groupId = groupData.data()[data?.channelName]["channelInfo"].groupId
    const res = await getDoc(doc(db, "channels", groupId))
    setMembers(res.data())
  }

 return (
    <div className="mess">
      {(data?.chatId == "null"&&data?.groupId=="") ?
        <img className="bgImage" src={bg} />
        : <div className="chat">
          <div className="chatInfo">
            {data?.user?.photoURL ? <img className="dp" src={data?.user?.photoURL} alt="" /> : <label>#</label>}
            <label className="userName">    {data?.user?.displayName}</label> <label className="userName">    {data?.channelName}</label>
            <div className="chatIcons">
              {!data?.user?.photoURL ? <img className="img1" src={Add} alt="" onClick={() => {
                setShowUserModal(true)
                setDetails(false)
                handleGetUsers()
              }} /> : null}
              <img className="img1" src={More} alt="" onClick={() => {
                setDetails(true)
                getDetails()
              }} />
            </div>
          </div>
          <SearchingUser showUserModal={showUserModal} setShowUserModal={setShowUserModal} combinedId={combinedId} users={users}/>
          {details ? <Details
            userName={data?.user?.displayName}
            groupName={data?.channelName}
            userImage={data?.user?.photoURL}
            members={members["participants"]}
            setDetails={setDetails
            } createdBy={members["createdBy"]?.name} /> : null}
          <Messages />
          <Input />
        </div>}
    </div>
  );
};

export default Chat;
