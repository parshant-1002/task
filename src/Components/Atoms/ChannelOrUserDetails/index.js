import React, { useContext, useState } from 'react'
import "./styles.css"
import deleteIcon from "../../../assets/delete.png"
import cross from "../../../assets/favpng_close-icon.png"
import { ChatContext } from '../../../Context/ChatContext'
import Modal from '../Modal'
import { AuthContext } from '../../../Context/AuthContext'
export default function Details({ userName, groupName, userImage, members, setDetails, createdBy,       userMail, handleDeleteGroupMembers, createrId }) {
  const { data, dispatch } = useContext(ChatContext)
  const { currentUser } = useContext(AuthContext)
  return (
    <Modal show={true}    >

      <div className='details'>
        <div className='detailsHeader'>
          <div className='head'>

            {userImage ? <h3 className='headingDetails'> User Details</h3> : <h3 className='headingDetails'> Group Details</h3>}
            <img className='closeDetails' src={cross} onClick={() => {
              setDetails(false)
              dispatch({ type: "MEMBERSADDEDSTATUS", payload: true })
            }}></img>
          </div>


          <div className='detailsHeading'>
            {!userImage && <label> #</label>}
            {!userImage && <label>{" " + groupName}</label>}
          </div>
        </div>
       {userImage && <div className='singleUserDetails'>

        <img className="singleUserImage" src={userImage} alt=""></img>
        <div>
       <label className="singleUserName">Name:{" " + userName}</label>
       <label  className="singleUserName"> Email:{" " + userMail}</label>

       </div>
       </div>}
        {!userImage && <div className='members'>
          <h5>Created By : {createdBy}{createrId == currentUser.uid && <>   (you)</>}</h5>
          {members?.length? <h5 className='memberHeading'>Members</h5> : <h5 className='memberHeading'>No Members !!!</h5>}
          {members?.length ? members?.map(val => <ol className='memberDetails'>{val.name}{val.uid == currentUser.uid && <>   (you)</>}
            <div >

              {data?.groupId.includes(currentUser.uid) ? <img className="deleteIcon" src={deleteIcon} alt="" onClick={() => {
                handleDeleteGroupMembers(val.uid)
              }}></img> : null}
            </div>
          </ol>) : null}
        </div>}

      </div>
    </Modal>
  )
}
