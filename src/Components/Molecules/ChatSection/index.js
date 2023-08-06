// libs
import React, { useContext, useEffect, useState } from "react";
import { collection, deleteField, doc, getDocs, onSnapshot, query, updateDoc, where } from "firebase/firestore";
import { db } from "../../../firebase";

// components
import SearchingUser from "../AddingUsers";
import Details from "../../Cells/ChannelOrUserDetails";
import Messages from "../../Cells/Messages";
import Input from "../Inputs";
import Modal from "../../Atoms/Modal";
import SetAndEditChannelName from "../../Atoms/SetAndEditChannelName";

// consts
import { images } from "../../../Images";
import { COLLECTION_NAME, STRINGS, TEXT } from "../../../Shared/Constants";

// context
import { ChatContext } from "../../../Context/ChatContext";
import { AuthContext } from "../../../Context/AuthContext";

// styles
import "./styles.css"

const Chat = () => {
  
  const { data, dispatch } = useContext(ChatContext);
  const { currentUser } = useContext(AuthContext);
  
  const combinedId = currentUser?.uid + data?.channelNameId

  const [showUserModal, setShowUserModal] = useState(false)
  const [editModal, setEditModal] = useState(false)
  const [details, setDetails] = useState()
  const [groupMembers, setGroupMembers] = useState([])
  const [groupName, setGroupName] = useState([])
  const [users, setUsers] = useState([])
  const [editedGroupName, setEditedGroupName] = useState("")
  const [error, setError] = useState("")

  // setting users list
  useEffect(() => {
    const q = data?.user?.uid &&
      query(collection(db, COLLECTION_NAME?.USERS), where("uid", "==", data?.user?.uid))
    const unsubscribe = data?.user?.uid && onSnapshot(q, (querySnapshot) => {
      const r = []
      querySnapshot.forEach((doc) => {
        r.push(doc.data());
      });
      setUsers(r);
    })
    return () => {
      data?.user?.uid && unsubscribe()
    }
  }, [data])

  // setting grp members
  useEffect(() => {
    const unSub = data?.groupId &&
      onSnapshot(doc(db, COLLECTION_NAME?.CHANNELS_DATA, data?.groupId), (doc) => {
        setGroupMembers(doc?.data())
      });
    return () => {
      data?.groupId && unSub();
    };
  }, [data, details]);

  // setting grp name
  useEffect(() => {
    const unSub = data?.groupId &&
      onSnapshot(doc(db, COLLECTION_NAME?.CHANNEL_LIST, currentUser?.uid), (doc) => {
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

  const handleEditGroupNamePerMember = async (x) => {
    await updateDoc(doc(db, COLLECTION_NAME?.CHANNEL_LIST, x), {
      [data?.channelNameId + ".channelInfo.channelName"]: editedGroupName
    });
  }

  const handleEditGroupName = async () => {
    if (editedGroupName?.length > 2 && (editedGroupName.split("").some(val => isNaN(val)))) {
      setError("")
      await updateDoc(doc(db, COLLECTION_NAME?.CHANNEL_LIST, currentUser?.uid), {
        [data?.channelNameId + ".channelInfo.channelName"]: editedGroupName
      });
      data?.groupId && await updateDoc(doc(db, COLLECTION_NAME?.CHANNELS_DATA, data?.groupId), {
        groupname: editedGroupName
      });
      groupMembers["participants"]?.map(val => handleEditGroupNamePerMember(val.uid))
      setEditedGroupName(data?.channelName)
    }
    else {
      setError(TEXT.ENTER_LIMITED_TEXT)
    }
  }

  const handleDeleteGroupMembers = async (x) => {
    const participantsRef = doc(db, COLLECTION_NAME?.CHANNELS_DATA, data?.groupId);

    const filteredParticipants = groupMembers &&
      groupMembers["participants"]?.filter(val => val.uid !== x)

    setGroupMembers({ ...groupMembers, participants: filteredParticipants })
    await updateDoc(participantsRef, {
      participants: groupMembers.participants.filter(val => val.uid !== x)
    });
    await updateDoc(doc(db, COLLECTION_NAME?.CHANNEL_LIST, x), {
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
      const querySnapshot = await getDocs(collection(db, COLLECTION_NAME?.USERS))
      const r = []
      querySnapshot.forEach((doc) => {
        r.push(doc.data())
      });
      setUsers(r.filter(val => (!x.some(value => value === val.uid) && (val.uid !== currentUser?.uid))));
    } catch (err) {
      console.log(err, "Error in getting User Details")
    }
  }

  return (
    <div className="mess">
      {(data?.chatId === "null" && data?.groupId === "") ?
        <img className="bgImage" src={images.bg} alt="" />
        : <div className="chat">
          <div className="chatInfo">
            {/* profile img or icon  */}
            {data?.user?.uid ?
              <img className="dp" src={users[0]?.photoURL} alt="" />
              :
              <label>#</label>}
            {/* User or group Profile name  */}
            {data?.user?.uid ?
              <label className="userName">
                {users[0]?.displayName}
              </label>
              : <label className="userName">
                {groupName &&
                  groupName[data?.channelNameId]?.channelInfo?.channelName}
              </label>}
            {/* chat icons edit add info  */}
            <div className="chatIcons">
              {data?.groupId && data?.groupId?.includes(currentUser?.uid) && !data?.user?.uid
                ?
                <div>
                  <label>{TEXT.ADMIN}</label>
                  <img
                    className="img1"
                    src={images.add}
                    alt=""
                    onClick={() => {
                      setShowUserModal(true)
                      setDetails(false)
                      handleGetUsers()
                      dispatch({ type: STRINGS.MEMBERSADDEDSTATUS, payload: true })
                    }} />
                  <img
                    className="img1"
                    src={images.edit}
                    alt="edit"
                    onClick={() => {
                      setEditModal(true)
                      setEditedGroupName(groupMembers["groupname"])
                    }} />
                </div>
                :
                !data?.user?.uid && <label>{TEXT.MEMBERS}</label>}
              <img
                className="img1"
                src={images.more}
                alt=""
                onClick={() => {
                  setDetails(true)
                }} />
            </div>
          </div>
          <Modal
            show={editModal}
            type={TEXT.EDIT_GROUP_NAME}
            setShow={setEditModal}
            showHead={true}
            showFoot={true}
            title={TEXT.ENTER_CHANNEL_NAME}
            editedGroupName={editedGroupName}
            setEditedGroupName={setEditedGroupName}
            handleEditGroupName={handleEditGroupName}
          >
            <SetAndEditChannelName
              type={TEXT.EDIT_CHANNEL_NAME}
              editedGroupName={editedGroupName}
              setEditedGroupName={setEditedGroupName}
              setError={setError}
              error={error}
              handleEditGroupName={handleEditGroupName}
              setEditModal={setEditModal}
            />

          </Modal>
          <SearchingUser
            groupName={groupName[data?.channelNameId]?.channelInfo?.channelName}
            showUserModal={showUserModal}
            setShowUserModal={setShowUserModal}
            combinedId={combinedId}
            users={users}
            groupMembers={groupMembers}
          />
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
