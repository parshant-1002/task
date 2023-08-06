// libs
import React, { useContext, useEffect, useState } from 'react'
import { signOut } from "firebase/auth"
import { auth, db } from '../../../firebase'
import { collection, onSnapshot, query, where } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'

// context
import { AuthContext } from '../../../Context/AuthContext'

// consts
import { images } from '../../../Images'
import "./styles.css"
import { COLLECTION_NAME, LOCALSTORAGE_KEY_NAME, ROUTES } from '../../../Shared/Constants'

// components
import Modal from '../../Atoms/Modal'
import EditUserProfile from './EditUserProfile'
import CurrentUserProfile from './CurrentUserProfile'

export default function Navbar() {
  const { currentUser } = useContext(AuthContext)
  const navigate = useNavigate()
  const [showCurrentUserProfile, setShowCurrentUserProfile] = useState(false)
  const [showProfileEditModal, setShowProfileEditModal] = useState(false)
  const [users, setUsers] = useState([])
  // seeting users
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

  // to logout app
  const logout = () => {
    window.location.reload()
    localStorage.setItem(LOCALSTORAGE_KEY_NAME.TOKEN, (""))
    localStorage.setItem(LOCALSTORAGE_KEY_NAME.USER, (JSON.stringify({})))
    navigate(ROUTES.LOGIN)
    signOut(auth)

  }
  return (
    <div className='navbar'>
      <div className="user">
        <span
          className='profileNavName'
        >
          {currentUser?.displayName}
        </span>
        <img
          className='profilepic'
          src={users[0]?.photoURL}
          alt=""
          onClick={() => { setShowCurrentUserProfile(true) }}
        />
        <Modal
          show={showCurrentUserProfile}
          setShow={setShowCurrentUserProfile}
          showHead={false}
          showFoot={false}
        >
          <CurrentUserProfile
            users={users}
            images={images}
            logout={logout}
            setShowProfileEditModal={setShowProfileEditModal}
            setShow={setShowCurrentUserProfile}
          />
        </Modal>
        <Modal
          show={showProfileEditModal}
          setShow={setShowProfileEditModal}
          showHead={true}
          showFoot={false}
          title={"Profile Update"}
        >
          <EditUserProfile
            setShow={setShowProfileEditModal}
          />
        </Modal>
      </div>
    </div>
  )
}
