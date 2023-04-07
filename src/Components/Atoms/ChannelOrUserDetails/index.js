import React, { useContext, useEffect, useState } from 'react'
import "./styles.css"
import deleteIcon from "../../../assets/delete.png"
import cross from "../../../assets/favpng_close-icon.png"
import { ChatContext } from '../../../Context/ChatContext'
import Modal from '../Modal'
import { AuthContext } from '../../../Context/AuthContext'
import { deleteDoc, deleteField, doc, onSnapshot, updateDoc } from 'firebase/firestore'
import { db } from '../../../firebase'
export default function Details({ userName, groupName, userImage, groupMembers, setDetails, createrMail, createdBy, userMail, handleDeleteGroupMembers, createrId }) {
  const { data, dispatch } = useContext(ChatContext)
  const { currentUser } = useContext(AuthContext)
  const [groupData, setGroupData] = useState([])

  const handleCloseDetails = () => {
    setDetails(false)
    dispatch({ type: "MEMBERSADDEDSTATUS", payload: true })
  }

  const handleDeleteGroupData = async (x) => {
    await updateDoc(doc(db, 'userChannels', x), {
      [data?.channelNameId]: deleteField()
    });
  }

  const handleDeleteGroup = async () => {
    await deleteDoc(doc(db, "channels", (createrId + groupName)))
    groupData?.length && groupData?.map(val => handleDeleteGroupData(val.uid))
  }

  useEffect(() => {
    const unSub = data?.groupId && onSnapshot(doc(db, "channels", data?.groupId), (doc) => {
      doc?.exists() && setGroupData(doc?.data()["participants"])
    });
    return () => {
      data?.groupId && unSub();
    };
  }, [data?.chatId, data?.groupId, groupMembers]);

  return (
    <Modal show={true}    >
      <div className='details'>
        <div className='detailsHeader'>

          <div className='head'>
            {userImage ? <h3 className='headingDetails'> User Details</h3> : <h3 className='headingDetails'> Group Details</h3>}
            <img className='closeDetails' src={cross} alt="" onClick={handleCloseDetails}></img>
          </div>

          <div className='detailsHeading'>
            {!userImage && <label> #</label>}
            {!userImage && <label>{" " + groupName}</label>}
          </div>

        </div>

        {/* individual Details */}

        {userImage && <div className='singleUserDetails'>
          <img className="singleUserImage" src={userImage} alt=""></img>
          <div>
            <label className="singleUserName">Name:{" " + userName}</label>
            <label className="singleUserName"> Email:{" " + userMail}</label>
          </div>
        </div>}

        {/* channel Details */}

        {!userImage && <div className='members'>
          <h5>
            <div>
              Created By : {createdBy}  {createrId === currentUser?.uid && <>   (you)</>}
              <div>
                {createrMail}
              </div>
            </div>
          </h5>

          {groupData?.length ? <h5 className='memberHeading'>Members</h5> : <h5 className='memberHeading'>No Members !!!</h5>}
          <div className='groupMembersList'>
            {groupData?.length
              ?
              groupData?.map(val => <ol className='memberDetails'>
                <div>
                  {val.name}
                  <div>
                    {val.email}
                  </div>
                </div>
                {val.uid === currentUser?.uid && <>(you)</>}

                <div >
                  {data?.groupId.includes(currentUser?.uid)
                    ?
                    <div>
                      {val.uid === currentUser?.uid
                        ?
                        <button className="deleteGroupButton" onClick={handleDeleteGroup}>Delete Group </button>
                        :
                        <img className="deleteIcon" src={deleteIcon} alt="" onClick={() => { handleDeleteGroupMembers(val.uid) }} />}
                    </div>
                    :
                    null}
                </div>
              </ol>)
              :
              null}
          </div>
        </div>}
      </div>
    </Modal >
  )
}
