import { arrayUnion, doc, getDoc, serverTimestamp, setDoc, Timestamp, updateDoc } from '@firebase/firestore'

import React, { useContext, useState } from 'react'
import { AuthContext } from '../../../Context/AuthContext'
import { db } from '../../../firebase'
import Modal1 from '../Modal'
import "./styles.css"
export default function AddChannels() {
    const [show,setShow]=useState(false)
    const [channelName,setChannelName]=useState()
    const { currentUser } = useContext(AuthContext);

      const addChannel = async () => {
        //check whether the group(chats in firestore) exists, if not create
        const combinedId = currentUser.uid+channelName
         
        try {
          const res = await getDoc(doc(db, "chats", combinedId),{messages:[]});
    
          if (!res.exists()) {
            //create a chat in chats collection
            await setDoc(doc(db, "chats", combinedId), { messages: [] });
    
            //create user chats
            await updateDoc(doc(db, "userChannels", currentUser.uid), {
            
      
              [combinedId + ".channelInfo"]:{
                channelName,
               
                date: serverTimestamp()
             
             
               
             
          
           } });
    

          }
        } catch (err) {}
        
        setChannelName("");
    
    
      
    }
  return (
    <div className='addChannel'>
    <label className='channelLabel'>Add Channels</label>
    <button className='channelButton' onClick={()=>{setShow(true)}} >Add</button>
    <Modal1 show={show} setShow={setShow} title={"Channel"} channelName={channelName} setChannelName={setChannelName} addChannel={addChannel} />
    </div>
  ) 
}
