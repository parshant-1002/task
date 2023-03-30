import {  collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc,  updateDoc, where } from '@firebase/firestore'
import React, { useContext, useState } from 'react'
import { AuthContext } from '../../../Context/AuthContext'
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
      {title=="Channel"?<button className='channelButton' onClick={() => {setShowChannelModal(true) }} >Add</button>:<button className='channelButton' onClick={() => {setShowUserModal(true) }} >Add</button>}
      {/* <Modal1 show={showChannelModal} setShow={setShowChannelModal} title={title} channelName={channelName} setChannelName={setChannelName} addChannel={addChannel} >
       <div>
          <label>Enter {title} name</label>
          <div>
            <input value={channelName} onChange={(e) => {
              setChannelName(e.target.value)
            }}></input>
          </div>
        </div>
      </Modal1> */}
      <Modal show={showChannelModal} setShow={setShowChannelModal}title={title} channelName={channelName} setChannelName={setChannelName} addChannel={addChannel} showHead={true} showFoot={true} >
      <div>
          <label>Enter {title} name</label>
          <div>
            <input value={channelName} onChange={(e) => {
              setChannelName(e.target.value)
            }}></input>
          </div>
        </div>
      </Modal>
   
          <SearchingUser showUserModal={showUserModal} setShowUserModal={setShowUserModal}/>
     
    </div>
  )
}
