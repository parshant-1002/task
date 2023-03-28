import React, { useContext, useEffect, useState } from "react";
import Details from "../../Atoms/Details";
import Add from "../../../assets/add.png";
import More from "../../../assets/more.png";
import bg from "../../../assets/bg.png"
import Messages from "../Messages";
import Input from "../Inputs";
import { ChatContext } from "../../../Context/ChatContext";
import "./styles.css"
import Modal1 from "../../Atoms/Modal";
import { arrayUnion, collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import { db } from "../../../firebase";
import { AuthContext } from "../../../Context/AuthContext";
const Chat = () => {
  const [show, setShow] = useState(false)
  const [userName, setUserName] = useState("")
  const [user, setUser] = useState()
  const [err, setErr] = useState()
  const { data } = useContext(ChatContext);
  const [details, setDetails] = useState(false)
  const [members, setMembers] = useState([])

  const { currentUser } = useContext(AuthContext);
  const combinedId = currentUser.uid + data?.channelName


  useEffect(() => {

    setDetails(false)
  }, [data])


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



  const getDetails = async () => {


    const groupData = await getDoc(doc(db, "userChannels", currentUser.uid))
    const groupId = groupData.data()[data?.channelName]["channelInfo"].groupId

    const res = await getDoc(doc(db, "channels", groupId))
    setMembers(res.data())






  }



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
    <div className="mess">
      {data?.chatId == "null" ?
         <img className="bgImage" src={bg}/>
        
        : <div className="chat">
          <div className="chatInfo">
            {data?.user?.photoURL ? <img className="dp" src={data?.user?.photoURL} alt="" /> : <label>#</label>}
            <label className="userName">    {data?.user?.displayName}</label> <label className="userName">    {data?.channelName}</label>
            <div className="chatIcons">
              {!data?.user?.photoURL ? <img className="img1" src={Add} alt="" onClick={() => {
                setShow(true)
                setDetails(false)
              }} /> : null}

              <img className="img1" src={More} alt="" onClick={() => {
                setDetails(true)
                getDetails()
              }} />
            </div>
          </div>





          <Modal1 show={show} setShow={setShow} title={"Channel"} addUser={addUser}>

            <label>Enter user</label>
            <div>
              <input value={userName} onChange={(e) => {
                setUserName(e.target.value)
              }
              }></input>
              <button onClick={handleSearch}>find</button>
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
          </Modal1>

          {details ? <Details userName={data?.user?.displayName} groupName={data?.channelName} userImage={data?.user?.photoURL} members={members["participants"]} setDetails={setDetails} createdBy={members["createdBy"]?.name} /> : null}
          <Messages />
          <Input />
        </div>}
    </div>
  );

};

export default Chat;
