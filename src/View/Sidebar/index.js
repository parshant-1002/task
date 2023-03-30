import React, { useState } from 'react'
import AddUserAndChannel from '../../Components/Cells/AddUserAndChannel'
import Channels from '../../Components/Cells/ChannelList'
import Chats from '../../Components/Cells/ChatList'
import Navbar from '../../Components/Atoms/Navbar'
import "./styles.css"
import close from "../../assets/favpng_close-icon.png"
export default function Sidebar() {
  const [showDirectMessage, setShowDirectMessage] = useState(false)
  const [showChannels, setShowChannels] = useState(false)
  return (
    <div className='sidebar'>
     
     <div className='directDiv' >
        <label className='directMessageShow ' onClick={() => { setShowChannels(true) 
        setShowDirectMessage(false)
        }} >
          Channels  </label>
        {showChannels && <img className='close' src={close} alt="close" onClick={() => setShowChannels(false)}></img>}
      </div>
      {showChannels && <div >
        <AddUserAndChannel title={"Channel"} />
        <Channels />
      </div>}



      <div className='directDiv' >
        <label className='directMessageShow ' onClick={() => { setShowDirectMessage(true)
           setShowChannels(false) }} >
          Direct Message  </label>
        {showDirectMessage && <img className='close' src={close} alt="close" onClick={() => setShowDirectMessage(false)}></img>}
      </div>
      {showDirectMessage && <div>
        <AddUserAndChannel title={"User"} />
        <Chats />
      </div>}
    
    </div >
  )
}
