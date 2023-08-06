// libd
import React, { useContext, useEffect, useState } from 'react'
import { collection, deleteDoc, deleteField, doc, onSnapshot, query, updateDoc, } from 'firebase/firestore'
import { db } from '../../../firebase'

// styles
import "./styles.css"

// consts
import { images } from '../../../Images'
import { BUTTON_TEXT, COLLECTION_NAME, STRINGS, TEXT } from '../../../Shared/Constants'

// context
import { ChatContext } from '../../../Context/ChatContext'
import { AuthContext } from '../../../Context/AuthContext'

// componnets
import Modal from '../../Atoms/Modal'

export default function Details({
  userName,
  groupName,
  userImage,
  userId,
  groupMembers,
  setDetails,
  userMail,
  handleDeleteGroupMembers,
  createrId
}) {
  const { data, dispatch } = useContext(ChatContext)
  const { currentUser } = useContext(AuthContext)

  const [groupData, setGroupData] = useState([])
  const [users, setUsers] = useState([])

  const findingMemberDetails = (val) => (users?.find(value => value.uid === val.uid));
  const creatorDetails = users?.find(value => value?.uid === createrId);
  const detailsHeading = userId ? TEXT.USER_DETAILS : TEXT.CHANNEL_DETAILS;
  const membersHeading = groupData?.length ? `${TEXT.MEMBERS} (${groupMembers?.length})` : "No Members !!!";
  const createrName = () => {
    if (createrId === currentUser?.uid) {
      return `${creatorDetails?.displayName}  (you)`;
    } else {
      return creatorDetails?.displayName
    }
  }
  const displayMemberName = (val) => {
    const memberDetails = findingMemberDetails(val);
    if (val.uid === currentUser?.uid) {
      return `${memberDetails?.displayName}  (you)`;
    } else {
      return memberDetails?.displayName;
    }
  }

  const handleCloseDetails = () => {
    setDetails(false)
    dispatch({ type: STRINGS.MEMBERSADDEDSTATUS, payload: true })
  }

  const handleDeleteGroupData = async (x) => {
    await updateDoc(doc(db, COLLECTION_NAME?.CHANNEL_LIST, x), {
      [data?.channelNameId]: deleteField()
    });
  }

  const handleDeleteGroup = async () => {
    await deleteDoc(doc(db, COLLECTION_NAME?.CHANNELS_DATA, (createrId + groupName)))
    await deleteDoc(doc(db, COLLECTION_NAME?.CHAT_DATA, (createrId + groupName)))
    if (groupData?.length) {
      groupData?.map(val => handleDeleteGroupData(val.uid))
    }
  }

  useEffect(() => {
    const q = query(collection(db, COLLECTION_NAME?.USERS))
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
    const unSub = data?.groupId &&
      onSnapshot(
        doc(db, COLLECTION_NAME?.CHANNELS_DATA, data?.groupId), (doc) => {
          doc?.exists() && setGroupData(doc?.data()["participants"])
        }
      );
    return () => {
      if (data?.groupId) {
        unSub();
      }
    };
  }, [data?.chatId, data?.groupId, groupMembers]);

  return (
    <Modal show={true}    >
      <div className='details'>
        <div className='detailsHeader'>
          {/* condition display of heading of details  */}
          <div className='head'>
            <h3 className='headingDetails'>
              {detailsHeading}
            </h3>

            <img
              className='closeDetails'
              src={images.crossWhite}
              alt=""
              onClick={handleCloseDetails}
            />
          </div>
          {!userId ? <div className='detailsHeading'>
            <label>{"# " + groupName}</label>
          </div> : null}
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

            {/* displaying creator name or direct user name  */}
            <h5>
              <h6>{TEXT.CREATED_BY}</h6>
              <div className="createrName" >
                {TEXT.NAME} : {createrName()}
                <div className="createrMail" >
                  {creatorDetails?.email}
                </div>
              </div>
            </h5>
            {/* displaying dp of channel or user  */}
            <img
              className="createrDp"
              src={creatorDetails?.photoURL}
              alt=""
            />
          </div>
          {/* displaying members list  */}
          <h5 className='memberHeading'>
            {membersHeading}
          </h5>
          <div className='groupMembersList'>
            {groupData?.length
              ?
              groupData?.map(val => <ol className='memberDetails'>
                <div className='Member'>
                  <img
                    className="membersDp"
                    src={findingMemberDetails(val)?.photoURL}
                    alt=""
                  />
                  <div>
                    <div>
                      <label>
                        {displayMemberName(val)}
                      </label>
                    </div>
                    <label>{findingMemberDetails(val)?.email}</label>
                  </div>
                </div>
                <div >
                  {data?.groupId.includes(currentUser?.uid)
                    ?
                    <div>
                      {val.uid === currentUser?.uid
                        ?
                        <button
                          className="deleteGroupButton"
                          onClick={handleDeleteGroup}
                        >
                          {BUTTON_TEXT.DELETE_GRP}
                        </button>
                        :
                        <img
                          className="deleteIcon"
                          src={images.deleteIcon}
                          alt=""
                          onClick={() => { handleDeleteGroupMembers(val.uid) }}
                        />}
                    </div>
                    :
                    val.uid === currentUser?.uid &&
                    <button
                      className="deleteGroupButton"
                      onClick={() => { handleDeleteGroupMembers(val.uid) }}>
                      {BUTTON_TEXT.LEAVE_GRP}
                    </button>
                  }
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
