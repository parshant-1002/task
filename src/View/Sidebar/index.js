import React, { useState } from 'react'
import AddChannels from '../../Components/Cells/AddChannels'
import Channels from '../../Components/Cells/Channels'
import Chats from '../../Components/Cells/Chats'
import Navbar from '../../Components/Cells/Navbar'
import Search from '../../Components/Cells/search'
import "./styles.css"
import close from "../../assets/favpng_close-icon.png"
export default function Sidebar
  () {

  const [showDirectMessage, setShowDirectMessage] = useState(false)

  const [showChannels, setShowChannels] = useState(false)
  return (
    <div className='sidebar'>
      <Navbar />
      <div className='directDiv' >

        <label className='directMessageShow ' onClick={() => { setShowDirectMessage(true) }} >
          Direct Message  </label>
        {showDirectMessage && <img className='close' src={close} alt="close" onClick={() => setShowDirectMessage(false)}></img>}
      </div>

      {showDirectMessage && <div>
        <Search />
        <Chats />
      </div>}
      <div className='directDiv' >

        <label className='directMessageShow ' onClick={() => { setShowChannels(true) }} >
          Channels  </label>
        {showChannels && <img className='close' src={close} alt="close" onClick={() => setShowChannels(false)}></img>}
      </div>
      {showChannels && <div >

        <AddChannels />
        <Channels />
      </div>}
    </div >
  )
}
