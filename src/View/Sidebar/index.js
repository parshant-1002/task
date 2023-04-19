import React, { useContext, useEffect, useState } from 'react'
import AddUserAndChannel from '../../Components/Cells/AddChatsAndChannels'
import Channels from '../../Components/Cells/ChannelList'
import Chats from '../../Components/Cells/ChatList'
import Navbar from '../../Components/Atoms/Navbar'
import "./styles.css"
import { images } from '../../Images'
import { ChatContext } from '../../Context/ChatContext'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../../firebase'
import { AuthContext } from '../../Context/AuthContext'
export default function Sidebar() {
  const [showDirectMessage, setShowDirectMessage] = useState(false)
  const [showChannels, setShowChannels] = useState(false)
  const {dispatch}=useContext(ChatContext)
  const {currentUser}=useContext(AuthContext)
  const [chatList,setChatList]=useState([])
  const [ChannelList,setChannelList]=useState([])
  const [totalUnseenText,setTotalUnseenText]=useState()
  const [totalUnseenGroupText,setTotalUnseenGroupText]=useState()
  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, "userChats", currentUser?.uid), (doc) => {
        setChatList(Object.values(doc.data()))
     
      });
      return () => {
        unsub();
      };
    };

    currentUser?.uid && getChats();
  }, [currentUser?.uid]);
  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, "userChannels", currentUser?.uid), (doc) => {
        setChannelList(Object.values(doc.data()))
     
      });
      return () => {
        unsub();
      };
    };

    currentUser?.uid && getChats();
  }, [currentUser?.uid]);
  useEffect(() => {
    setTotalUnseenText(chatList.reduce((acc,val)=>acc+val?.unseen?.unseen,0))
  }, [chatList])

  useEffect(() => {
    setTotalUnseenGroupText(ChannelList.reduce((acc,val)=>acc+val?.unseen,0))
  }, [ChannelList])

  return (
    <div className='sidebar'>

      <div className='directDiv' >
        <label className='directMessageShow ' onClick={() => {
          setShowChannels(true)
          setShowDirectMessage(false)
        }} >
          Channels  </label>
          { totalUnseenGroupText>0 &&<label className='totalUnseenCount'>{totalUnseenGroupText} </label>}
        {showChannels && <img className='close' src={images.crossWhite} alt="close" onClick={() =>
        { setShowChannels(false)
        dispatch({type:"RESET"})}
        }></img>}
      </div>
      {showChannels && <div >
        <AddUserAndChannel title={"Channel"} />
        <Channels />
      </div>}



      <div className='directDiv' >
        <label className='directMessageShow ' onClick={() => {
          setShowDirectMessage(true)
          setShowChannels(false)
        }} >
          Direct Message </label>
           
          { totalUnseenText>0 &&<label className='totalUnseenCount'>{totalUnseenText} </label>}

        {showDirectMessage && <img className='close' src={images.crossWhite} alt="close" onClick={() => 
            { setShowDirectMessage(false)
              dispatch({type:"RESET"})}
        }></img>}
      </div>
      {showDirectMessage && <div>
        <AddUserAndChannel title={"User"} />
        <Chats showDirectMessage={showDirectMessage} />
      </div>}

    </div >
  )
}
