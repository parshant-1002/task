import React, { useContext, useEffect, useRef, useState } from 'react'
import deleteTcon from "../../../assets/delete.png"
import { arrayUnion, collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from '@firebase/firestore'
import { AuthContext } from '../../../Context/AuthContext';
import { db } from '../../../firebase';
import { ChatContext } from '../../../Context/ChatContext';
import Modal from '../../Atoms/Modal';
import "./styles.css"
export default function SearchingUser({ showUserModal, setShowUserModal, combinedId, users }) {
    const { currentUser } = useContext(AuthContext);
    const [userName, setUserName] = useState("")
    // const [user, setUser] = useState()
    const [err, setErr] = useState()
    const [userList, setUserList] = useState()
    const [selectedList, setSelectedList] = useState([])
    const { data, dispatch } = useContext(ChatContext);
    const selectedListRef = useRef()
console.log(users,"users")
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
        console.log(x)
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

        await updateDoc(doc(db, "channels", combinedId),
            {
                participants: arrayUnion({
                    name: user.displayName,
                    uid: user.uid,
                    email:user.email
                })
            })
        await updateDoc(doc(db, "userChannels", user.uid), {
            [data?.channelName + ".channelInfo"]: {
                channelNameId:data?.channelNameId,
                channelName: data?.channelName,
                groupId: combinedId,
                date: serverTimestamp()
            }
        });

        setUserName("")
        setUserList(userList.filter(val => selectedList.some(value => value.uid != val.uid)))

        setSelectedList([])
    }

    const handleAdd = () => {
        selectedList?.map(val => handleAdd2(val))
    }
    const handleAdd2 = async (user) => {
        //check whether the group(chats in firestore) exists, if not create
        const combinedId =
            currentUser.uid > user.uid
                ? currentUser.uid + user.uid
                : user.uid + currentUser.uid;
        try {
            const res = await getDoc(doc(db, "chats", combinedId));

            if (!res.exists()) {
                //create a chat in chats collection
                await setDoc(doc(db, "chats", combinedId), { messages: [] });

                //create user chats
                (!data.chatId.includes("undefined")) && await updateDoc(doc(db, "userChats", currentUser.uid), {
                    [combinedId + ".userInfo"]: {
                        uid: user.uid,
                        displayName: user.displayName,
                        photoURL: user.photoURL,
                        email: user.email
                    },
                    [combinedId + ".date"]: serverTimestamp(),
                });

                (!data.chatId.includes("undefined")) && await updateDoc(doc(db, "userChats", user.uid), {
                    [combinedId + ".userInfo"]: {
                        uid: currentUser.uid,
                        displayName: currentUser.displayName,
                        photoURL: currentUser.photoURL,
                        email: currentUser.email
                    },
                    [combinedId + ".date"]: serverTimestamp(),
                });
            }
        } catch (err) { }

        dispatch({ type: "MEMBERSADDEDSTATUS", payload: false })
        setUserName("")
        setSelectedList([])
    };

    const handleSearch = () => {
        const list = users?.filter(val => {
            return (
                val.displayName.toLowerCase().includes(userName.toLowerCase())

            )
        })
        userName && setUserList(list)

    };

    return (
        //
        <Modal show={showUserModal} setShow={setShowUserModal} title={"Channel"} handleSelect={handleAdd} setSelectedList={setSelectedList} selectedList={selectedList} addUser={addUsersInChannel} showHead={true} showFoot={true} >
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

                        {selectedList?.length && selectedList.map(val => {
                            return (

                                <div className="selectedUsers" >
                                    <li ref={selectedListRef} className="SelectedList">
                                        <div className="userChatInfo">
                                            <img className="userImage" src={val.photoURL} alt="" />
                                            <span className="userName">{val.displayName}</span>
                                        </div>
                                        <img className="deleteBtnnn" src={deleteTcon} alt="delete" onClick={() => handleDeleteSelectedUsers(val)}></img>
                                    </li>
                                </div>
                            )
                        })}
                    </div>
                    <h3> Select User</h3>
                    <div className='usersDisplay'>
                        {
                            userList?.length && userList.map(val => {
                                return (

                                    <div className="userData" onClick={() => { handleSelect(val) }}>
                                        <img className="userImage" src={val.photoURL} alt="" />
                                        <div className="userChatInfo">
                                            <span className="userName">{val.displayName}</span>
                                        </div>
                                    </div>
                                )
                            })}
                    </div>
                </div>
                : <h1>No User Left</h1>}
        </Modal>
    )
}
