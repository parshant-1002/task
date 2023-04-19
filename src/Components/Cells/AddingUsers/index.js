import React, { useContext, useEffect, useRef, useState } from 'react'
import { images } from '../../../Images';
import { arrayUnion, doc, getDoc, serverTimestamp, setDoc, updateDoc, onSnapshot } from '@firebase/firestore'
import { AuthContext } from '../../../Context/AuthContext';
import { db } from '../../../firebase';
import { ChatContext } from '../../../Context/ChatContext';
import Modal from '../../Atoms/Modal';
import "./styles.css"
import { STRINGS } from '../../../Shared/Constants';
export default function SearchingUser({ showUserModal, setShowUserModal, combinedId, users, groupName }) {
    const { currentUser } = useContext(AuthContext);
    const [userName, setUserName] = useState("")
    const [err, setErr] = useState()
    const [userList, setUserList] = useState()
    const [selectedList, setSelectedList] = useState([])
    const { data, dispatch } = useContext(ChatContext);
    const [messages, setMessages] = useState([]);
    const selectedListRef = useRef()

    useEffect(() => {
        const unSub = data?.chatId && onSnapshot(doc(db, "chats", data?.chatId), (doc) => {
            data?.chatId && doc?.exists() && setMessages(doc?.data()?.messages);
        });
        return () => {
            data?.chatId && unSub();
        };
    }, [data?.chatId, data?.groupId]);

    useEffect(() => {
        !userName && setUserList(users)
    }, [userName, users])


    useEffect(() => {
        setSelectedList([])
    }, [])

    useEffect(() => {
        selectedListRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [selectedList]);

    const handleDeleteSelectedUsers = (x) => {
        setSelectedList(selectedList.filter(val => val.uid != x.uid))
        setUserList([...userList, x])
    }

    const handleSelect = (val) => {
        setSelectedList([...selectedList, val])
        const list = userList?.filter(value => {
            return (value.uid !== val.uid)
        })
        setUserList(list)
    }

    const addUsersInChannel = () => {
        selectedList?.map(val => addUsersInChannelOneByOne(val))
    }
    const addUsersInChannelOneByOne = async (user) => {
        await updateDoc(doc(db, "channels", data?.groupId),
            {
                participants: arrayUnion({
                    uid: user.uid,
                    name:user.displayName,
                    email:user.email
                })
            })
        await updateDoc(doc(db, "userChannels", user.uid), {
            [data?.channelNameId + ".channelInfo"]: {
                channelNameId: data?.channelNameId,
                channelName: groupName,
                groupId: combinedId,
                date: serverTimestamp()
            }
            ,
            [data?.channelNameId + ".unseen"]:0
        });
        setUserName("")
        setUserList(userList.filter(val => selectedList.some(value => value.uid !== val.uid)))
        setSelectedList([])
    }

    const handleAdd = () => {
        if (selectedList?.length)
            selectedList?.map(val => handleAdd2(val))
    }
    const handleAdd2 = async (user) => {
        const combinedId = currentUser?.uid > user.uid
            ? currentUser?.uid + user.uid
            : user.uid + currentUser?.uid;
        try {
            const res = await getDoc(doc(db, "chats", combinedId));
            const response = await getDoc(doc(db, "userChats", currentUser?.uid));

            if (!res.exists() || !Object.keys(response?.data()).includes(combinedId)) {
                //create a chat in chats collection
                //create user chats
                (!data.chatId.includes("undefined")) && await updateDoc(doc(db, "userChats", currentUser?.uid), {
                    [combinedId + ".userInfo"]: {
                        uid: user.uid,
                    },
                    [combinedId + ".date"]: serverTimestamp(),
                });

                (!data.chatId.includes("undefined")) && await updateDoc(doc(db, "userChats", user?.uid), {
                    [combinedId + ".userInfo"]: {
                        uid: currentUser?.uid,

                    },
                    [combinedId + ".date"]: serverTimestamp(),
                });
                (!data.chatId.includes("undefined")) && await setDoc(doc(db, "chats", combinedId), { messages: [] });
            }
        } catch (err) { console.log(err, "err<><><><><><>>,") }
        dispatch({ type: STRINGS.MEMBERSADDEDSTATUS, payload: false })
        setUserName("")
        setSelectedList([])
    };

    const handleSearch = () => {
        const list = users?.filter(val => {
            return (val.displayName.toLowerCase().includes(userName.toLowerCase()))
        })
        userName && setUserList(list)
    };

    return (
        <Modal show={showUserModal} setShow={setShowUserModal} title={"users"} handleSelect={handleAdd} setSelectedList={setSelectedList} selectedList={selectedList} addUser={addUsersInChannel} showHead={true} showFoot={true}  >
            {users?.length ?
                <div>
                    <div >
                        <label>Enter user</label>
                        <input value={userName} onChange={(e) => {
                            setUserName(e.target.value)
                            handleSearch()
                        }
                        }></input>
                    </div>
                    {err && <span>User not found!</span>}
                    <h3> Selected User</h3>
                    <div className='usersDisplay'>
                        {selectedList?.length ? selectedList.map(val => {
                            return (
                                <div className="selectedUsers" >
                                    <li ref={selectedListRef} className="SelectedList">
                                        <img className="userImage" src={val.photoURL} alt="" />

                                        <span className="userName">{val.displayName}</span>
                                        <span className="userName">{val.email}</span>
                                        <img className="deleteBtnnn" src={images.deleteIcon} alt="delete" onClick={() => handleDeleteSelectedUsers(val)}></img>
                                    </li>
                                </div>
                            )
                        }) : <h6>No Selected Users!!!</h6>}
                    </div>
                    <h3> Select User</h3>
                    <div className='usersDisplay'>
                        {userList?.length ? userList.map(val => {
                            return (
                                <div className="userData" onClick={() => { handleSelect(val) }}>
                                    <img className="userImage" src={val.photoURL} alt="" />
                                    <div className="userChatInfo">
                                        <span className="userName">{val.displayName}</span>
                                        <span className="userName">{val.email}</span>
                                    </div>
                                </div>
                            )
                        }) : <h6>No Users Left!!!</h6>}
                    </div>
                </div>
                : <h1>No User Left</h1>}
        </Modal>
    )
}
