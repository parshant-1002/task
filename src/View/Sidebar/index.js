// libs
import React, { useContext, useEffect, useState } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../../firebase'

// components
import AddUserAndChannel from '../../Components/Molecules/AddChatsAndChannels'
import Channels from '../../Components/Cells/ChannelList'
import Chats from '../../Components/Cells/ChatList'

// styles
import "./styles.css"

// icons
import { images } from '../../Images'

// context
import { ChatContext } from '../../Context/ChatContext'
import { AuthContext } from '../../Context/AuthContext'

// consts
import { COLLECTION_NAME, TEXT } from '../../Shared/Constants'

export default function Sidebar() {
  // hooks
  const { dispatch } = useContext(ChatContext)
  const { currentUser } = useContext(AuthContext)
  // state
  const [showDirectMessage, setShowDirectMessage] = useState(false)
  const [showChannels, setShowChannels] = useState(false)
  const [chatList, setChatList] = useState([])
  const [ChannelList, setChannelList] = useState([])
  const [totalUnseenText, setTotalUnseenText] = useState()
  const [totalUnseenGroupText, setTotalUnseenGroupText] = useState()

  // to get chat lists
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
  // to get channel list
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

  // calculating total unseen count for direct chats
  useEffect(() => {
    setTotalUnseenText(chatList.reduce((acc, val) => acc + val?.unseen?.unseen, 0))
  }, [chatList])

  // calcul;ating total unseen count for channels
  useEffect(() => {
    setTotalUnseenGroupText(ChannelList.reduce((acc, val) => acc + val?.unseen, 0))
  }, [ChannelList])

  // showing channel list in div click
  const handleChannelsListShow = () => {
    setShowChannels(true)
    setShowDirectMessage(false)
  }
  const handleChannelsListClose = () => {
    setShowChannels(false)
    dispatch({ type: "RESET" })
  }

  // showing chat list on div click
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
      {/* Channels List view */}
      <div className='directDiv' >
        <label
          className='directMessageShow '
          onClick={handleChannelsListShow}>
          {TEXT.CHANNELS}
        </label>

        {totalUnseenGroupText > 0 &&
          <label
            className='totalUnseenCount'>
            {totalUnseenGroupText}
          </label>}

        {showChannels &&
          <img className='close'
            src={images.crossWhite}
            alt="close"
            onClick={handleChannelsListClose}
          />}
      </div>
      {showChannels &&
        <div >
          <AddUserAndChannel title={"Channel"} />
          <Channels />
        </div>}
      {/* Direct chat list view */}
      <div className='directDiv' >
        <label
          className='directMessageShow '
          onClick={handleChatListListShow}
        >
          {TEXT.DIRECT_MESSAGE}
        </label>
        {totalUnseenText > 0 &&
          <label className='totalUnseenCount'>
            {totalUnseenText}
          </label>
        }
        {showDirectMessage &&
          <img className='close'
            src={images.crossWhite}
            alt="close"
            onClick={handleChatListClose}
          />}
      </div>

      {showDirectMessage &&
        <div>
          <AddUserAndChannel title={"User"} />
          <Chats showDirectMessage={showDirectMessage} />
        </div>}
    </div >
  )
}
