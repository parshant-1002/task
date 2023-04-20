import { collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from '@firebase/firestore'
import React, { useContext, useState } from 'react'
import { AuthContext } from '../../../Context/AuthContext'
import { ChatContext } from '../../../Context/ChatContext'
import { db } from '../../../firebase'
import Modal from '../../Atoms/Modal'
import SearchingUser from '../AddingUsers'
import "./styles.css"
import { COLLECTION_NAME, STRINGS } from '../../../Shared/Constants'
import SetAndEditChannelName from '../../Atoms/SetAndEditChannelName'

export default function AddUserAndChannel({ title }) {
  const [showUserModal, setShowUserModal] = useState(false)
  const [showChannelModal, setShowChannelModal] = useState(false)
  const [channelName, setChannelName] = useState()
  const { currentUser } = useContext(AuthContext);
  const [users, setUsers] = useState([])
  const [error, setError] = useState("")
  const [string, setString] = useState("")
  const { data, dispatch } = useContext(ChatContext)



  const handleGetRegisteredUsers = () => {
    const details = data?.users && ((data?.users) || [])
    const g = []
    details?.length && details?.map(val => g.push(val?.userInfo?.uid))
    handleGetRegisteredUsersOneByOne(g)
  }

  const handleGetRegisteredUsersOneByOne = async (x) => {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTION_NAME?.USERS))
      const r = []
      querySnapshot.forEach((doc) => {
        r.push(doc.data())
      });
      const y = r.filter(val => (!x.some(value => value === val.uid) && val.uid !== currentUser?.uid))
      setUsers(y);
    } catch (err) {
      console.log(err, "Error in getting User Details")
    }
  }

  const addChannel = async () => {
    //check whether the group(chats in firestore) exists, if not create

    if (channelName?.length > 2 && (channelName.split("").some(val => isNaN(val)))) {
      setError("")

      const combinedId = currentUser?.uid + channelName
      try {
        const res = await getDoc(doc(db, COLLECTION_NAME?.CHAT_DATA, combinedId), { messages: [] });
        if (!res.exists()) {
          //create a chat in chats collection
          await setDoc(doc(db, COLLECTION_NAME?.CHAT_DATA, combinedId), { messages: [] });
          await setDoc(doc(db, COLLECTION_NAME?.CHANNELS_DATA, combinedId),
            {
              createdBy: { name: currentUser?.displayName, id: currentUser?.uid, email: currentUser?.email },
              groupname: channelName,
              participants: [{
                name: currentUser?.displayName,
                uid: currentUser?.uid,
                email: currentUser?.email
              }],
              createdAt: serverTimestamp(),
            }
          )
          //create user chats
          await updateDoc(doc(db, COLLECTION_NAME?.CHANNEL_LIST, currentUser?.uid), {
            [channelName + ".channelInfo"]: {
              channelNameId: channelName,
              channelName,
              groupId: combinedId,
              date: serverTimestamp()
            },
            [channelName + ".unseen"]: 0
          });
        }
      } catch (err) { console.log(err.message, "error") }
      setChannelName("");
    }
    else {
      setError("Enter Character more than 2 and should include alphabets")
    }
  }

  return (
    <div className='addChannel'>
      <label className='channelLabel'> {title}</label>
      {title === "Channel" ? <button className='channelButton' onClick={() => {
        setShowChannelModal(true)
      }} >Add</button>
        :
        <button className='channelButton' onClick={() => {
          setShowUserModal(true)
          handleGetRegisteredUsers()
          setString(false)
          dispatch({ type: STRINGS.RESET });
        }} >Add</button>}

      <Modal show={showChannelModal} setShow={setShowChannelModal} error={error} setError={setError} title={title} channelName={channelName} setChannelName={setChannelName} addChannel={addChannel} showHead={true} showFoot={true} >
        <SetAndEditChannelName titl={title} channelName={channelName} addChannel={addChannel} setShowChannelModal={setShowChannelModal} setChannelName={setChannelName} setError={setError} error={error} />
      </Modal>
      <SearchingUser string={string} showUserModal={showUserModal} setShowUserModal={setShowUserModal} users={users} />
    </div>
  )
}
