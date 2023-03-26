import React, { useState } from 'react'
import Modal1 from '../Modal'
import "./styles.css"
export default function AddChannels() {
    const [show,setShow]=useState(false)
  return (
    <div className='addChannel'>
    <label className='channelLabel'>Add Channels</label>
    <button className='channelButton' onClick={()=>{setShow(true)}} >Add</button>
    <Modal1 show={show} setShow={setShow}/>
    </div>
  )
}
