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
        <img className='img' src={currentUser.photoURL} alt="" />
        <span className='name'>{currentUser.displayName}</span>
        <button className='button' onClick={()=>signOut(auth)}>logout</button>
      </div>
    </div>
  

  )
}
