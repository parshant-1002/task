import { collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from '@firebase/firestore'
import React, { useContext, useState } from 'react'
import { AuthContext } from '../../../Context/AuthContext'
import { ChatContext } from '../../../Context/ChatContext'
import { db } from '../../../firebase'
import Modal1 from '../../Atoms/Modal'
import Modal from '../../Atoms/Modal'
import SearchingUser from '../SearchingUser'

import "./styles.css"
export default function AddUserAndChannel({ title }) {
  const [showUserModal, setShowUserModal] = useState(false)
  const [showChannelModal, setShowChannelModal] = useState(false)
  const [channelName, setChannelName] = useState()
  const { currentUser } = useContext(AuthContext);
  const [users, setUsers] = useState([])
  const { data } = useContext(ChatContext)

  const handleGetUsers = () => {
    const details=data?.users&&(data?.users)

    const g=[]
   details.map(val=>g.push(val.userInfo.uid)) 
   handleGetUsers1(g)
    // data?.users?.map(val =>    console.log(val) )
  }

  const handleGetUsers1 = async (x) => {
  
    try {
      const querySnapshot = await getDocs(collection(db, "users"))
      const r = []
      querySnapshot.forEach((doc) => {

        r.push(doc.data())
      });
      const y = r.filter(val => !x.some(value=>value==val.uid))
      console.log(x, y, "crucial data",currentUser.uid)
      setUsers(y);
    } catch (err) {
      console.log(err, "Error in getting User Details")
    }
  }

  const addChannel = async () => {
    //check whether the group(chats in firestore) exists, if not create
    const combinedId = currentUser.uid + channelName
    try {
      const res = await getDoc(doc(db, "chats", combinedId), { messages: [] });
      if (!res.exists()) {
        //create a chat in chats collection
        await setDoc(doc(db, "chats", combinedId), { messages: [] });
        await setDoc(doc(db, "channels", combinedId),
          {
            createdBy: { name: currentUser.displayName, id: currentUser.uid },
            groupname: channelName,
            participants: [],
            createdAt: serverTimestamp(),
          }
        )
        //create user chats
        await updateDoc(doc(db, "userChannels", currentUser.uid), {
          [channelName + ".channelInfo"]: {
            channelName,
            groupId: combinedId,
            date: serverTimestamp()
          }
        });
      }
    } catch (err) { console.log(err.message, "error") }
    setChannelName("");
  }


  return (
    <div className='addChannel'>
      <label className='channelLabel'>Add {title}</label>
      {title == "Channel" ? <button className='channelButton' onClick={() => { setShowChannelModal(true) }} >Add</button> : <button className='channelButton' onClick={() => {
        setShowUserModal(true)
        handleGetUsers()
      }} >Add</button>}

      <Modal show={showChannelModal} setShow={setShowChannelModal} title={title} channelName={channelName} setChannelName={setChannelName} addChannel={addChannel} showHead={true} showFoot={true} >
        <div>
          <label>Enter {title} name</label>
          <div>
            <input value={channelName} onChange={(e) => {
              setChannelName(e.target.value)
            }}></input>
          </div>
        </div>
      </Modal>

      <SearchingUser showUserModal={showUserModal} setShowUserModal={setShowUserModal} users={users} />

    </div>
  )
}
