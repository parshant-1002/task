import React, { useContext, useState } from 'react'
import { signOut } from "firebase/auth"
import { auth } from '../../../firebase'
import { AuthContext } from '../../../Context/AuthContext'
import "./styles.css"
import Modal from '../Modal'
import { useNavigate } from 'react-router-dom'

export default function Navbar() {
  const { currentUser } = useContext(AuthContext)
  const [show,setShow]=useState(false)
  const navigate=useNavigate()
  
  const logout=()=>{
    signOut(auth)
    navigate("/login")
        
  }
  return (
    <div className='navbar'>
      <div className="user">
      <span className='profileNavName'>{currentUser?.displayName}</span>
        <img className='profilepic' src={currentUser?.photoURL} alt=""  onClick={()=>{setShow(true)}}/>
        <Modal show={show} setShow={setShow}showHead={false} showFoot={false} >
        <img className='showPic' src={currentUser?.photoURL} alt=""  />
        <div className='pname'>
          <span className='profilename'>{currentUser?.displayName}</span>
          <label className='profilemail'>{currentUser?.email}</label>
        <button className='logout' onClick={logout  }>logout</button>
        <button className='closeBtn' onClick={() => setShow(false)}>Close</button>
        </div>
        </Modal>
      </div>
    </div>
  )
}
