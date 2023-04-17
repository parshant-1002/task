import React, { useContext, useEffect, useState } from 'react'
import { signOut } from "firebase/auth"
import { auth, db } from '../../../firebase'
import { AuthContext } from '../../../Context/AuthContext'
import "./styles.css"
import Modal from '../Modal'
import { useNavigate } from 'react-router-dom'

import { collection, onSnapshot, query, where } from 'firebase/firestore'
import { images } from '../../../Images'
import EditUserProfile from '../../Cells/EditUserProfile'

export default function Navbar() {
  const { currentUser } = useContext(AuthContext)

  const [show, setShow] = useState(false)
  const [showProfileEditModal, setShowProfileEditModal] = useState(false)
  const [users, setUsers] = useState([])
  const navigate = useNavigate()
  useEffect(() => {
    const q = currentUser?.uid && query(collection(db, "users"), where("uid", "==", currentUser?.uid))
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
        <img className='profilepic' src={users[0]?.photoURL} alt="" onClick={() => { setShow(true) }} />
        <Modal show={show} setShow={setShow} showHead={false} showFoot={false} >
          <div className='profile'>

          <img className='showPic' src={users[0]?.photoURL} alt="" />
          <div className='pname'>
            <div>

            <label className='profilename'>Name:{users[0]?.displayName}</label>
            <img className='editbtn' src={images?.profileEdit} alt="" onClick={() => {
              setShowProfileEditModal(true)
              setShow(false)
            }} />
            </div>
            <label className='profilemail'>{users[0]?.email}</label>
            <button className='logoutbtn' onClick={logout}>logout</button>
            <button className='closeBtn' onClick={() => setShow(false)}>Close</button>
          </div>
            </div>
        </Modal>
        <Modal show={showProfileEditModal} setShow={setShowProfileEditModal} showHead={true} showFoot={false} title={"Profile Update"}>
          <EditUserProfile setShow={setShowProfileEditModal}/>
        </Modal>
      </div>
    </div>
  )
}
