import React, { useContext, useEffect, useState } from "react";
import Details from "../../Atoms/ChannelOrUserDetails";
import { images } from "../../../Images";
import Messages from "../Messages";
import Input from "../Inputs";
import { ChatContext } from "../../../Context/ChatContext";
import { arrayUnion, collection, deleteField, doc, getDocs, onSnapshot, query, updateDoc, where } from "firebase/firestore";
import { db } from "../../../firebase";
import { AuthContext } from "../../../Context/AuthContext";
import SearchingUser from "../AddingUsers";
import "./styles.css"
import Modal from "../../Atoms/Modal";
import { STRINGS } from "../../../Shared/Constants";

const Chat = () => {
  const [showUserModal, setShowUserModal] = useState(false)
  const [editModal, setEditModal] = useState(false)
  const { data, dispatch } = useContext(ChatContext);
  const [details, setDetails] = useState()
  const { currentUser } = useContext(AuthContext);
  const [groupMembers, setGroupMembers] = useState([])
  const [groupName, setGroupName] = useState([])
  const [users, setUsers] = useState([])
  const combinedId = currentUser?.uid + data?.channelNameId
  const [editedGroupName, setEditedGroupName] = useState("")


  useEffect(() => {
    const q =data?.user?.uid&& query(collection(db, "users"),where("uid","==",data?.user?.uid))
    const unsubscribe =data?.user?.uid&& onSnapshot(q, (querySnapshot) => {
      const r = []
      querySnapshot.forEach((doc) => {
          r.push(doc.data());
      });
      setUsers(r);})
  return ()=>{
    data?.user?.uid&& unsubscribe()
  }
  
  }, [data])

  useEffect(() => {
    const unSub = data?.groupId && onSnapshot(doc(db, "channels", data?.groupId), (doc) => {
      setGroupMembers(doc?.data())
    });
    return () => {
      data?.groupId && unSub();
    };
  }, [data, details]);
  
  useEffect(() => {
    const unSub = data?.groupId && onSnapshot(doc(db, "userChannels", currentUser?.uid), (doc) => {
      setGroupName(doc?.data())
      if (!doc?.data()[data?.channelNameId]?.channelInfo?.channelName) {
        dispatch({ type: STRINGS.RESET })
      }
    });
    return () => {
      data?.groupId && unSub();
    };
  }, [data?.chatId, data?.groupId, editedGroupName]);

  useEffect(() => {
    setDetails(false)

  }, [data])


  const handleKey = (e) => {
    if (e.code === "Enter") {
      handleEditGroupName()
      setEditModal(false)
    }
  }

  const handleEditGroupNamePerMember = async (x) => {
    await updateDoc(doc(db, 'userChannels', x), {
      [data?.channelNameId + ".channelInfo.channelName"]: editedGroupName
    });
  }

  const handleEditGroupName = async () => {
    await updateDoc(doc(db, 'userChannels', currentUser?.uid), {
      [data?.channelNameId + ".channelInfo.channelName"]: editedGroupName
    });
    data?.groupId && await updateDoc(doc(db, 'channels', data?.groupId), {
      groupname: editedGroupName
    });
    groupMembers["participants"]?.map(val => handleEditGroupNamePerMember(val.uid))
    setEditedGroupName(data?.channelName)
  }

  const handleDeleteGroupMembers = async (x) => {
    const participantsRef = doc(db, 'channels', data?.groupId);
    const filteredParticipants = groupMembers && groupMembers["participants"]?.filter(val => val.uid !== x)
    setGroupMembers({ ...groupMembers, participants: filteredParticipants })
    await updateDoc(participantsRef, {
      participants: groupMembers.participants.filter(val => val.uid !== x)
    });
    await updateDoc(doc(db, 'userChannels', x), {
      [data?.channelNameId]: deleteField()
    });
  }

  const handleGetUsers = () => {
    const g = []
    groupMembers["participants"]?.map(val => g.push(val.uid))
    handleGetUsersOneByOne(g)
  }

  const handleGetUsersOneByOne = async (x) => {
    try {
      const querySnapshot = await getDocs(collection(db, "users"))
      const r = []
      querySnapshot.forEach((doc) => {
        r.push(doc.data())
      });
      setUsers(r.filter(val => (!x.some(value => value === val.uid) && val.uid !== currentUser?.uid)));
    } catch (err) {
      alert(err, "Error in getting User Details")
    }
  }

  return (
    <div className="mess">
      {(data?.chatId === "null" && data?.groupId === "") ?
        <img className="bgImage" src={images.bg} alt="" />
        : <div className="chat">
          <div className="chatInfo">
            {data?.user?.uid? <img className="dp" src={users[0]?.photoURL} alt="" /> : <label>#</label>}
           {data?.user?.uid? <label className="userName">    {users[0]?.displayName}</label> :<label className="userName">    {groupName && groupName[data?.channelNameId]?.channelInfo?.channelName}</label>}
            <div className="chatIcons">
              {data?.groupId && data?.groupId?.includes(currentUser?.uid) && !data?.user?.uid
                ?
                <div>
                  <label>Admin</label>
                  <img className="img1" src={images.add} alt="" onClick={() => {
                    setShowUserModal(true)
                    setDetails(false)
                    handleGetUsers()
                    dispatch({ type: STRINGS.MEMBERSADDEDSTATUS, payload: true })
                  }} />
                  <img className="img1" src={images.edit} alt="edit" onClick={() => {
                    setEditModal(true)
                    setEditedGroupName(groupMembers["groupname"])
                  }} />
                </div>
                :
                !data?.user?.uid && <label>Member</label>}
              <img className="img1" src={images.more} alt="" onClick={() => {
                setDetails(true)
              }} />
            </div>
          </div>
          <Modal show={editModal} type={"editGroupName"} setShow={setEditModal} showHead={true} showFoot={true} title={"Edit Channel Name"} editedGroupName={editedGroupName} setEditedGroupName={setEditedGroupName} handleEditGroupName={handleEditGroupName}>
            <div className="editGroupNameInput">
              <input value={editedGroupName} onKeyDown={handleKey} onChange={(e) => { setEditedGroupName(e.target.value) }}></input>
            </div>
          </Modal>
          <SearchingUser groupName={groupName[data?.channelNameId]?.channelInfo?.channelName} showUserModal={showUserModal} setShowUserModal={setShowUserModal} combinedId={combinedId} users={users} groupMembers={groupMembers} />
          {details ? <Details
            userName={users[0]?.displayName}
            groupName={groupName[data?.channelNameId]?.channelInfo?.channelName}
            userImage={users[0]?.photoURL}
            userMail={users[0]?.email}
            userId={data?.user?.uid}
            groupMembers={groupMembers && groupMembers["participants"]}
            handleDeleteGroupMembers={handleDeleteGroupMembers}
            setDetails={setDetails}
            createrId={groupMembers && groupMembers["createdBy"]?.id}
          /> : null}
          <Messages />
          <Input />
        </div>}
    </div>
  );
};

export default Chat;
