import React, { useContext, useEffect, useState } from 'react'
import AddUserAndChannel from '../../Components/Molecules/AddChatsAndChannels'
import Channels from '../../Components/Cells/ChannelList'
import Chats from '../../Components/Cells/ChatList'
import "./styles.css"
import { images } from '../../Images'
import { ChatContext } from '../../Context/ChatContext'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../../firebase'
import { AuthContext } from '../../Context/AuthContext'
import { COLLECTION_NAME } from '../../Shared/Constants'

export default function Sidebar() {
  const [showDirectMessage, setShowDirectMessage] = useState(false)
  const [showChannels, setShowChannels] = useState(false)
  const { dispatch } = useContext(ChatContext)
  const { currentUser } = useContext(AuthContext)
  const [chatList, setChatList] = useState([])
  const [ChannelList, setChannelList] = useState([])
  const [totalUnseenText, setTotalUnseenText] = useState()
  const [totalUnseenGroupText, setTotalUnseenGroupText] = useState()

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, COLLECTION_NAME?.CHAT_LIST, currentUser?.uid), (doc) => {
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
      const unsub = onSnapshot(doc(db, COLLECTION_NAME?.CHANNEL_LIST, currentUser?.uid), (doc) => {
        setChannelList(Object.values(doc.data()))
      });
      return () => {
        unsub();
      };
    };
    currentUser?.uid && getChats();
  }, [currentUser?.uid]);

  useEffect(() => {
    setTotalUnseenText(chatList.reduce((acc, val) => acc + val?.unseen?.unseen, 0))
  }, [chatList])

  useEffect(() => {
    setTotalUnseenGroupText(ChannelList.reduce((acc, val) => acc + val?.unseen, 0))
  }, [ChannelList])

  const handleChannelsListShow = () => {
    setShowChannels(true)
    setShowDirectMessage(false)
  }
  const handleChannelsListClose = () => {
    setShowChannels(false)
    dispatch({ type: "RESET" })
  }
  const handleChatListListShow = () => {
    setShowDirectMessage(true)
    setShowChannels(false)
  }
  const handleChatListClose = () => {
    setShowDirectMessage(false)
    dispatch({ type: "RESET" })
  }
  return (
    <div className='sidebar'>
      <div className='directDiv' >
        <label className='directMessageShow ' onClick={() => { handleChannelsListShow() }}>Channels  </label>
        {totalUnseenGroupText > 0 && <label className='totalUnseenCount'>{totalUnseenGroupText} </label>}
        {showChannels && <img className='close' src={images.crossWhite} alt="close" onClick={() => { handleChannelsListClose() }} />}
      </div>
      {showChannels &&
        <div >
          <AddUserAndChannel title={"Channel"} />
          <Channels />
        </div>}
      <div className='directDiv' >
        <label className='directMessageShow ' onClick={() => { handleChatListListShow() }} >Direct Message </label>
        {totalUnseenText > 0 && <label className='totalUnseenCount'>{totalUnseenText}</label>}
        {showDirectMessage && <img className='close' src={images.crossWhite} alt="close" onClick={() => { handleChatListClose() }} />}
      </div>
      {showDirectMessage &&
        <div>
          <AddUserAndChannel title={"User"} />
          <Chats showDirectMessage={showDirectMessage} />
        </div>}
    </div >
  )
}
