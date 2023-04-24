import React, { useContext, useEffect, useState } from 'react'
import { signOut } from "firebase/auth"
import { auth, db } from '../../../firebase'
import { AuthContext } from '../../../Context/AuthContext'
import "./styles.css"
import Modal from '../../Atoms/Modal'
import { useNavigate } from 'react-router-dom'

import { collection, onSnapshot, query, where } from 'firebase/firestore'
import { images } from '../../../Images'
import EditUserProfile from './EditUserProfile'
import { COLLECTION_NAME } from '../../../Shared/Constants'
import CurrentUserProfile from './CurrentUserProfile'

export default function Navbar() {
  const { currentUser } = useContext(AuthContext)
  const [showCurrentUserProfile, setShowCurrentUserProfile] = useState(false)
  const [showProfileEditModal, setShowProfileEditModal] = useState(false)
  const [users, setUsers] = useState([])
  const navigate = useNavigate()
  useEffect(() => {
    const q = currentUser?.uid && query(collection(db, COLLECTION_NAME?.USERS), where("uid", "==", currentUser?.uid))
    const unsubscribe = currentUser?.uid && onSnapshot(q, (querySnapshot) => {
      const r = []
      querySnapshot.forEach((doc) => {
        r.push(doc.data());
      });
      setUsers(r);
    })
    return () => {
      currentUser?.uid && unsubscribe()
    }

  }, [currentUser])
  const logout = () => {
    window.location.reload()
    localStorage.setItem("Token", (""))
    navigate("/login")
    signOut(auth)

  }
  return (
    <div className='navbar'>
      <div className="user">
        <span className='profileNavName'>{currentUser?.displayName}</span>
        <img className='profilepic' src={users[0]?.photoURL} alt="" onClick={() => { setShowCurrentUserProfile(true) }} />
        <Modal show={showCurrentUserProfile} setShow={setShowCurrentUserProfile} showHead={false} showFoot={false} >
          <CurrentUserProfile users={users} images={images} logout={logout} setShowProfileEditModal={setShowProfileEditModal} setShow={setShowCurrentUserProfile} />
        </Modal>
        <Modal show={showProfileEditModal} setShow={setShowProfileEditModal} showHead={true} showFoot={false} title={"Profile Update"}>
          <EditUserProfile setShow={setShowProfileEditModal} />
        </Modal>
      </div>
    </div>
  )
}
