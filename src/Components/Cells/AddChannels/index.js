import { addDoc, arrayUnion, collection, doc, getDoc, serverTimestamp, setDoc, Timestamp, updateDoc, where } from '@firebase/firestore'

import React, { useContext, useState } from 'react'
import { AuthContext } from '../../../Context/AuthContext'
import { db } from '../../../firebase'
import Modal1 from '../../Atoms/Modal'
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
            await setDoc(doc(db,"channels",combinedId),
            {
              createdBy:{name:currentUser.displayName,id:currentUser.uid},
              groupname:channelName,
              participants:[],
              createdAt:serverTimestamp(),
          }
               
             )
     
            //create user chats
            await updateDoc(doc(db, "userChannels", currentUser.uid), {
            
      
              [channelName + ".channelInfo"]:{
                channelName,
                groupId:combinedId,
                date: serverTimestamp()
             
             
               
             
          
           } });
        

          }
        } catch (err) {console.log(err.message,"error")}
        
        setChannelName("");
    
    
      
    }
  return (
    <div className='addChannel'>
    <label className='channelLabel'>Add Channels</label>
    <button className='channelButton' onClick={()=>{setShow(true)}} >Add</button>
    <Modal1 show={show} setShow={setShow} title={"Channel"} channelName={channelName} setChannelName={setChannelName} addChannel={addChannel} >
     
    <label>Enter channel name</label>
      <div>
      <input value={channelName} onChange={(e)=>{setChannelName(e.target.value)
   }}></input>
       
      </div>

      </Modal1>
    </div>
  ) 
}
