import React, { useContext, useEffect, useState } from 'react'
import "./styles.css"
import { images } from '../../../Images'
import { ChatContext } from '../../../Context/ChatContext'
import Modal from '../Modal'
import { AuthContext } from '../../../Context/AuthContext'
import { collection, deleteDoc, deleteField, doc, onSnapshot, query, updateDoc, } from 'firebase/firestore'
import { db } from '../../../firebase'
import { STRINGS } from '../../../Shared/Constants'
export default function Details({ userName, groupName, userImage, userId, groupMembers, setDetails, userMail, handleDeleteGroupMembers, createrId }) {
  const { data, dispatch } = useContext(ChatContext)
  const { currentUser } = useContext(AuthContext)
  const [groupData, setGroupData] = useState([])
  const [users, setUsers] = useState([])
  const handleCloseDetails = () => {
    setDetails(false)
    dispatch({ type: STRINGS.MEMBERSADDEDSTATUS, payload: true })
  }

  const handleDeleteGroupData = async (x) => {
    await updateDoc(doc(db, 'userChannels', x), {
      [data?.channelNameId]: deleteField()
    });
  }

  const handleDeleteGroup = async () => {
    await deleteDoc(doc(db, "channels", (createrId + groupName)))
    await deleteDoc(doc(db, "chats", (createrId + groupName)))
    groupData?.length && groupData?.map(val => handleDeleteGroupData(val.uid))
  }
  useEffect(() => {
    const q = query(collection(db, "users"))
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const r = []
      querySnapshot.forEach((doc) => {
        r.push(doc.data());
      });
      setUsers(r);
    })
    return () => {
      unsubscribe()
    }

  }, [data])
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
            {userId ? <h3 className='headingDetails'> User Details</h3> : <h3 className='headingDetails'> Channel Details</h3>}
            <img className='closeDetails' src={images.crossWhite} alt="" onClick={handleCloseDetails}></img>
          </div>
          <div className='detailsHeading'>
            {!userId && <label> #</label>}
            {!userId && <label>{" " + groupName}</label>}
          </div>

        </div>

        {/* individual Details */}

        {userId && <div className='singleUserDetails'>
          <img className="singleUserImage" src={userImage} alt=""></img>
          <div>
            <label className="singleUserName">Name:{" " + userName}</label>
            <label className="singleUserName"> Email:{" " + userMail}</label>
          </div>
        </div>}

        {/* channel Details */}

        {!userId && <div className='members'>
          <div className='CreaterDetails'>

            <h5>
              <h6>Created By: </h6>
              <div className="createrName" >
                Name: {(users?.find(value => value?.uid === createrId))?.displayName}  {createrId === currentUser?.uid && <>   (you)</>}
                <div className="createrMail" >
                  {(users?.find(value => value?.uid === createrId))?.email}
                </div>
              </div>
            </h5>
            <img className="createrDp" src={(users?.find(value => value.uid === createrId))?.photoURL} alt=""></img>
          </div>
          {groupData?.length ? <h5 className='memberHeading'>Members ({groupMembers?.length})</h5> : <h5 className='memberHeading'>No Members !!!</h5>}
          <div className='groupMembersList'>
            {groupData?.length
              ?
              groupData?.map(val => <ol className='memberDetails'>
                <div className='Member'>
                  <img className="membersDp" src={(users?.find(value => value.uid === val.uid))?.photoURL} alt=""></img>
                  <div>

                    <div>
                      <label>{(users?.find(value => value?.uid === val.uid))?.displayName}   {val.uid === currentUser?.uid && <>(you)</>}</label>
                    </div>
                    <label>{(users?.find(value => value?.uid === val.uid))?.email}</label>
                  </div>

                </div>


                <div >
                  {data?.groupId.includes(currentUser?.uid)
                    ?
                    <div>
                      {val.uid === currentUser?.uid
                        ?
                        <button className="deleteGroupButton" onClick={handleDeleteGroup}>Delete Group </button>
                        :
                        <img className="deleteIcon" src={images.deleteIcon} alt="" onClick={() => { handleDeleteGroupMembers(val.uid) }} />}
                    </div>
                    :
                    val.uid === currentUser?.uid && <button className="deleteGroupButton" onClick={() => { handleDeleteGroupMembers(val.uid) }}>Leave Group </button>}
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
