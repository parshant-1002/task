import React from 'react'

export default function CurrentUserProfile({users,images,logout,setShowProfileEditModal,setShow}) {
  return (
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
  )
}
