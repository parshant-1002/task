import React, { useState } from 'react'
import "./styles.css"
export default function MessageInput() {
    const [message,setMessage]=useState()
  return (
    <div >
       <input className='messageInput'  type="text" value={message} onChange={(e)=>{setMessage(e.target.value)}}></input>
       <button
       className='Send'>
        Send
       </button>
    </div>
  )
}
