import React, { useContext, useState } from 'react'
import Modal1 from '../../Atoms/Modal';
import {  arrayUnion, collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc,  updateDoc, where } from '@firebase/firestore'
import { AuthContext } from '../../../Context/AuthContext';
import { db } from '../../../firebase';
import { ChatContext } from '../../../Context/ChatContext';
import Modal from '../../Atoms/Modal';
import "./styles.css"
export default function SearchingUser({showUserModal,setShowUserModal,combinedId}) {

 const { currentUser } = useContext(AuthContext);
    const [userName, setUserName] = useState("")
    const [user, setUser] = useState()
    const [err, setErr] = useState()

    const { data } = useContext(ChatContext);
    const addUser = async () => {
        try {
          const res = await getDoc(doc(db, "channels", combinedId))
        } catch {
          console.log("not admin")
        }
        await updateDoc(doc(db, "channels", combinedId),
          {
            participants: arrayUnion({
              name: user.displayName,
              uid: user.uid
            })
          })
        await updateDoc(doc(db, "userChannels", user.uid),
          {
            [data?.channelName]: {
              channelInfo: {
                channelName: data?.channelName,
                date: serverTimestamp(),
                groupId: combinedId
              }
            }
    
          })
    
        setUser(null)
        setUserName("")
      }
    const handleSelect = async () => {
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
                await updateDoc(doc(db, "userChats", currentUser.uid), {
                    [combinedId + ".userInfo"]: {
                        uid: user.uid,
                        displayName: user.displayName,
                        photoURL: user.photoURL,
                    },
                    [combinedId + ".date"]: serverTimestamp(),
                });

                await updateDoc(doc(db, "userChats", user.uid), {
                    [combinedId + ".userInfo"]: {
                        uid: currentUser.uid,
                        displayName: currentUser.displayName,
                        photoURL: currentUser.photoURL,
                    },
                    [combinedId + ".date"]: serverTimestamp(),
                });
            }
        } catch (err) { }

        setUser(null);

        setUserName("")
    };

    const handleSearch = async () => {
        const q = query(
            collection(db, "users"),
            where("displayName", "==", userName)
        );
        try {
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                setUser(doc.data());
            });
        } catch (err) {
            setErr(true);
        }
    };

    return (


        <Modal show={showUserModal} setShow={setShowUserModal} title={"Channel"} handleSelect={handleSelect} addUser={addUser}>
            <div>
                <label>Enter user</label>
                <input value={userName} onChange={(e) => {
                    setUserName(e.target.value)
                }
                }></input>
                <button className='findButton' onClick={handleSearch}>find</button>
            </div>
            {err && <span>User not found!</span>}
            {user && (
                <div className="userData" onClick={() => { }}>
                    <img className="img" src={user.photoURL} alt="" />
                    <div className="userChatInfo">
                        <span className="name">{user.displayName}</span>
                    </div>
                </div>
            )}


        </Modal>
    )
}
