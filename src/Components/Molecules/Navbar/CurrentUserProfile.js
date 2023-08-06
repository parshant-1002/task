import React from 'react'
import { BUTTON_TEXT, TEXT } from '../../../Shared/Constants'

export default function CurrentUserProfile({ users, images, logout, setShowProfileEditModal, setShow }) {
  return (
    <div className='profile'>
      <img
        className='showPic'
        src={users[0]?.photoURL}
        alt=""
      />
      <div className='pname'>
        <div>
          <label className='profilename'>{TEXT.NAME}:{users[0]?.displayName}</label>
          <img
            className='editbtn'
            src={images?.profileEdit}
            alt=""
            onClick={() => {
              setShowProfileEditModal(true)
              setShow(false)
            }} />
        </div>
        <label className='profilemail'>{users[0]?.email}</label>
        <button
          className='logoutbtn'
          onClick={logout}
        >
          {BUTTON_TEXT.LOGOUT}
        </button>
        <button
          className='closeBtn'
          onClick={() => setShow(false)}
        >
          {BUTTON_TEXT.CLOSE}
        </button>
      </div>
    </div>
  )
}
