import React, { useContext } from 'react'
import {signOut} from "firebase/auth"
import { auth } from '../../../firebase'
import { AuthContext } from '../../../Context/AuthContext'
import "./styles.css"

export default function Navbar() {
  const {currentUser} = useContext(AuthContext)




  return (
    <div className='navbar'>
    
      <div className="user">
        <img className='profilepic' src={currentUser.photoURL} alt="" />
        <div className='pname'>

        <span className='profilename'>{currentUser.displayName}</span>
        </div>
        <button className='button' onClick={()=>signOut(auth)}>logout</button>
      </div>
    </div>
  

  )
}
