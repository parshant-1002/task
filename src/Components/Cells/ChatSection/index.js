import React, { useContext, useEffect, useState } from "react";
import Details from "../../Atoms/ChannelOrUserDetails";
import Add from "../../../assets/add.png";
import More from "../../../assets/more.png";
import edit from "../../../assets/edit.png";
import bg from "../../../assets/bg.png"
import Messages from "../Messages";
import Input from "../Inputs";
import { ChatContext } from "../../../Context/ChatContext";
import { collection, deleteField, doc, getDocs, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import { AuthContext } from "../../../Context/AuthContext";
import SearchingUser from "../SearchingUser";
import "./styles.css"
import Modal from "../../Atoms/Modal";

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
        dispatch({ type: "RESET" })

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
        <img className="bgImage" src={bg} alt="" />
        : <div className="chat">
          <div className="chatInfo">
            {data?.user?.photoURL ? <img className="dp" src={data?.user?.photoURL} alt="" /> : <label>#</label>}
            <label className="userName">    {data?.user?.displayName}</label> <label className="userName">    {groupName && groupName[data?.channelNameId]?.channelInfo?.channelName}</label>
            <div className="chatIcons">
              {data?.groupId && data?.groupId?.includes(currentUser?.uid) && !data?.user?.photoURL ? <div><label>Admin</label><img className="img1" src={Add} alt="" onClick={() => {
                setShowUserModal(true)
                setDetails(false)
                handleGetUsers()
                dispatch({ type: "MembersADDEDSTATUS", payload: true })

              }} />

                <img className="img1"  src={edit} alt="edit" onClick={() => {
                  setEditModal(true)
                  console.log(document.getElementsByClassName("editGroupNameInput"), "iddddd")
                  // document.getElementsByClassName("editGroupNameInput").focus()
                  setEditedGroupName(groupMembers["groupname"])
                }} ></img>
              </div> : !data?.user.uid && <label>Member</label>}
              <img className="img1" src={More} alt="" onClick={() => {
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
            userName={data?.user?.displayName}
            groupName={data?.channelName}
            userImage={data?.user?.photoURL}
            userMail={data?.user?.email}
            groupMembers={groupMembers && groupMembers["participants"]}
            handleDeleteGroupMembers={handleDeleteGroupMembers}
            setDetails={setDetails
            } createdBy={groupMembers && groupMembers["createdBy"]?.name}
            createrMail={groupMembers && groupMembers["createdBy"]?.email}
            createrId={groupMembers && groupMembers["createdBy"]?.id}
          /> : null}


          <Messages />
          <Input />
        </div>}
    </div>
  );
};

export default Chat;
