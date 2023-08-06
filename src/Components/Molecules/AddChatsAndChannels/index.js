// libs
import React, { useContext, useState } from 'react'
import { collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from '@firebase/firestore'
import { db } from '../../../firebase'

// context
import { AuthContext } from '../../../Context/AuthContext'
import { ChatContext } from '../../../Context/ChatContext'

// components
import Modal from '../../Atoms/Modal'
import SearchingUser from '../AddingUsers'
import SetAndEditChannelName from '../../Atoms/SetAndEditChannelName'
import Loader from '../../Atoms/Loader'

// styles
import "./styles.css"

// consts
import { BUTTON_TEXT, COLLECTION_NAME, Messages, STRINGS } from '../../../Shared/Constants'

export default function AddUserAndChannel({ title }) {
  const { currentUser } = useContext(AuthContext);
  const { data, dispatch } = useContext(ChatContext)

  const [showUserModal, setShowUserModal] = useState(false)
  const [showChannelModal, setShowChannelModal] = useState(false)
  const [channelName, setChannelName] = useState()
  const [users, setUsers] = useState([])
  const [error, setError] = useState("")
  const [string, setString] = useState("")
  const [loader, setLoader] = useState(false)

  const handleGetRegisteredUsers = () => {
    const details = data?.users && ((data?.users) || [])
    const g = []
    details?.length && details?.map(val => g.push(val?.userInfo?.uid))
    handleGetRegisteredUsersOneByOne(g)
  }

  const handleGetRegisteredUsersOneByOne = async (x) => {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTION_NAME?.USERS))
      const r = []
      querySnapshot.forEach((doc) => {
        r.push(doc.data())
      });
      const y = r.filter(val => (!x.some(value => value === val.uid) && val.uid !== currentUser?.uid))
      setUsers(y);
    } catch (err) {
      console.log(err, Messages.errorInGettingUsrDetails)
    }
  }

  const addChannel = async () => {
    //check whether the group(chats in firestore) exists, if not create
    if (channelName?.length > 2 && (channelName.split("").some(val => isNaN(val)))) {
      const combinedId = currentUser?.uid + channelName
      try {
        setError("")
        setLoader(true)
        const res = await getDoc(doc(db, COLLECTION_NAME?.CHAT_DATA, combinedId), { messages: [] });
        if (!res.exists()) {
          //create a chat in chats collection
          await setDoc(doc(db, COLLECTION_NAME?.CHAT_DATA, combinedId), { messages: [] });
          await setDoc(doc(db, COLLECTION_NAME?.CHANNELS_DATA, combinedId),
            {
              createdBy: { name: currentUser?.displayName, id: currentUser?.uid, email: currentUser?.email },
              groupname: channelName,
              participants: [{
                name: currentUser?.displayName,
                uid: currentUser?.uid,
                email: currentUser?.email
              }],
              createdAt: serverTimestamp(),
            }
          )
          //create user chats
          await updateDoc(doc(db, COLLECTION_NAME?.CHANNEL_LIST, currentUser?.uid), {
            [channelName + ".channelInfo"]: {
              channelNameId: channelName,
              channelName,
              groupId: combinedId,
              date: serverTimestamp()
            },
            [channelName + ".unseen"]: 0
          });
        }
      } catch (err) { console.log(err.message, "error") }
      setChannelName("");
      setLoader(false)
    }
    else {
      setError(Messages.enterCharacterOfLimit)
    }
  }

  return (
    <div className='addChannel'>
      <label className='channelLabel'> {title}</label>
      {title === "Channel"
        ? <button className='channelButton'
          onClick={() => {
            setShowChannelModal(true)
          }} >
          {BUTTON_TEXT.ADD}
        </button>
        :
        <button className='channelButton'
          onClick={() => {
            setShowUserModal(true)
            handleGetRegisteredUsers()
            setString(false)
            dispatch({ type: STRINGS.RESET });
          }} >
          {BUTTON_TEXT.ADD}
        </button>}

      <Modal
        show={showChannelModal}
        setShow={setShowChannelModal}
        error={error}
        setError={setError}
        title={title}
        channelName={channelName}
        setChannelName={setChannelName}
        addChannel={addChannel}
        showHead={true}
        showFoot={true} >
        <SetAndEditChannelName
          title={title}
          channelName={channelName}
          addChannel={addChannel}
          setShowChannelModal={setShowChannelModal}
          setChannelName={setChannelName}
          setError={setError}
          error={error}

        />
      </Modal>
      <SearchingUser
        string={string}
        showUserModal={showUserModal}
        setShowUserModal={setShowUserModal}
        users={users}

      />
      <Loader show={loader} />
    </div>
  )
}
