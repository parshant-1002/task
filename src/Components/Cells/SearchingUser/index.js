import React, { useContext, useEffect, useState } from 'react'
import Modal1 from '../../Atoms/Modal';
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
    const [selectedList,setSelectedList]=useState([])

    const { data } = useContext(ChatContext);

   

  useEffect(() => {

   !userName&&setUserList(users)
  }, [users,userName])
  
   
  useEffect(() => {
   setSelectedList([])


   }, [])



  const handleSelect=(val)=>{
    setSelectedList([...selectedList,val]) 
    const list=userList?.filter(value=>{
        console.log(value.email,val.email)
        return(value.email!==val.email)
    })
    setUserList(list)
 
}







const addUser=()=>{
    selectedList?.map(val=>addUser1 (val))
   }




    const addUser1 = async (user) => {
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
       

        setUserName("")
        setSelectedList([])
    }

    const handleAdd=()=>{
     selectedList?.map(val=>handleAdd2(val))
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
                    },
                    [combinedId + ".date"]: serverTimestamp(),
                });

                (!data.chatId.includes("undefined")) && await updateDoc(doc(db, "userChats", user.uid), {
                    [combinedId + ".userInfo"]: {
                        uid: currentUser.uid,
                        displayName: currentUser.displayName,
                        photoURL: currentUser.photoURL,
                    },
                    [combinedId + ".date"]: serverTimestamp(),
                });
            }
        } catch (err) { }

      

        setUserName("")
        setSelectedList([])
    };

    const handleSearch = () => {
       const list =  users?.filter(val => {
            return (
                val.displayName.toLowerCase().includes(userName.toLowerCase())

            )
        })
        userName && setUserList(list)







    };
    console.log(userList, "fff")
    return (
        //

        <Modal show={showUserModal} setShow={setShowUserModal} title={"Channel"} handleSelect={handleAdd}  addUser={addUser} showHead={true} showFoot={true} >
            <div >
                <label>Enter user</label>
                <input value={userName} onChange={(e) => {
                    setUserName(e.target.value)
                    handleSearch()
                }
                }></input>
                <button className='findButton' onClick={handleSearch}>find</button>
            </div>
            {err && <span>User not found!</span>}
            <h3> Selected User</h3>
            <div className='usersDisplay'>

            {selectedList?.length && selectedList.map(val => {
                return (

                    <div className="userData" >
                        <img className="userImage" src={val.photoURL} alt="" />
                        <div className="userChatInfo">
                            <span className="userName">{val.displayName}</span>
                        </div>
                    </div>
                )
            })}
            </div>
             <h3> Select User</h3>
            <div className='usersDisplay'>
            {
            userList?.length && userList.map(val => {
                return (
                    
                    <div className="userData" onClick={() => {handleSelect(val) }}>
                        <img className="userImage" src={val.photoURL} alt="" />
                        <div className="userChatInfo">
                            <span className="userName">{val.displayName}</span>
                        </div>
                    </div>
                )
            })}
            </div>
        </Modal>
    )
}
