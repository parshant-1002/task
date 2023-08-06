// libs
import React, { useContext, useEffect, useState } from "react";
import { collection, deleteField, doc, getDoc, getDocs, onSnapshot, query, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase";

// context
import { AuthContext } from "../../../Context/AuthContext";
import { ChatContext } from "../../../Context/ChatContext";

// styles
import "./styles.css"

// consts
import { images } from "../../../Images";
import { COLLECTION_NAME, STRINGS } from "../../../Shared/Constants";

const Chats = ({ showDirectMessage }) => {
  const { currentUser } = useContext(AuthContext);
  const { data, dispatch } = useContext(ChatContext);

  const [chats, setChats] = useState([]);
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(false);
  const [messageList, setMessages] = useState([])
  const [chatId, setChatId] = useState("");
  const [users, setUsers] = useState([])

  const id = data?.groupId || data?.chatId

  // conditions to show data in chat list
  const isShowLastText = (chat) => (chat[1]?.unseen?.unseen > 0 && chat[1]?.lastMessage?.text.trim());
  const isShowLastMedia = (chat, mediaType) => (!chat[1]?.lastMessage?.text && chat[1]?.lastMessage?.[mediaType]);
  const isShowUnseenCount = (chat) => (chat[1]?.unseen?.unseen > 0);
  const isShowSelectedChatIcon = (chat) => (chat[1]?.userInfo?.uid === selected);
 
  // setting my chat list
  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, COLLECTION_NAME?.CHAT_LIST, currentUser?.uid), (doc) => {
        const chatListData = Object.entries(doc.data())?.sort((a, b) => b[1].date - a[1].date);
        setChats(chatListData)
        doc.exists() && setVisible(true)
        showDirectMessage && dispatch({ type: STRINGS.GETUSERS, payload: (Object.values(doc.data())) })
      });
      return () => {
        unsub();
      };
    };
    currentUser?.uid && getChats();
  }, [currentUser?.uid]);

  // to set Message list
  useEffect(() => {
    const unSub = onSnapshot(doc(db, COLLECTION_NAME?.CHAT_DATA, id), (doc) => {
      doc?.exists() && setMessages(doc?.data().messages);
    });
    return () => {
      unSub();
    };
  }, [data?.chatId, data?.groupId]);

  // setting users
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

  }, [])
  
  // to reset count unread
  useEffect(() => {
    chatId && updateStatus()
    if (data?.user?.uid === selected) {
      resetSeenStatus()
    }
  }, [messageList])
  
  // remove direct chat
  const removeUser = async () => {
    setSelected(null)
    await updateDoc(doc(db, COLLECTION_NAME?.CHAT_LIST, currentUser?.uid), {
      [data?.chatId]: deleteField()
    })
  }

  // reseting unseen status
  const resetSeenStatus = async (id) => {
    await updateDoc(doc(db, COLLECTION_NAME?.CHAT_LIST, currentUser?.uid), {
      [chatId + ".unseen"]: {
        unseen: 0
      },
      [chatId + ".lastMessage"]: {
        img: "",
        pdf: "",
        text: ""
      }
    })
  }

  // updating seen unseen status
  const updateStatus = async () => {
    messageList?.map((val, i) => { if (messageList[i].senderId !== currentUser.uid) { messageList[i]["status"] = true } })
    await updateDoc(doc(db, COLLECTION_NAME?.CHAT_DATA, chatId), {
      messages: messageList
    });

  }

  const handleSelect = async (chatId, u) => {
    setChatId(chatId)
    dispatch({ type: STRINGS.CHANGE_USER, payload: u });
    dispatch({ type: STRINGS.GETUSERS, payload: chats?.map(val => val[1]) })
    selected && resetSeenStatus(chatId)
  }

  const handleChatClick = (chat) => {
    handleSelect(chat[0], (users.find(val => (val.uid === chat[1]?.userInfo?.uid))))
    setSelected(chat[1]?.userInfo?.uid)
  }

  return (
    <div>{
      !visible
        ? <label className="warnmessage">Loading ...</label>
        : <div className="chats">
          {chats?.map((chat) => {
            return <div id="chatItem">
              <div
                className="userChat"
                key={chat[0]}
                onClick={() => handleChatClick(chat)}
              >
                {/* profilepic */}

                <img
                  className="profilePic"
                  src={(users.find(val => val.uid === chat[1]?.userInfo?.uid))?.photoURL}
                  alt=""
                />
                <div className="userChatInfo">

                  {/* username */}
                  <span
                    className="info"
                  >
                    {(users.find(val => val.uid === chat[1]?.userInfo?.uid))?.displayName}
                  </span>

                  {/* lastmessage  */}
                  {(isShowLastText(chat)) ?
                    <label
                      className="lastmessage"
                      style={{ color: `gold` }}
                    >
                      {chat[1]?.lastMessage?.text}
                    </label>
                    : null}

                  {/* last media  */}
                  {(isShowLastMedia(chat, "img")) ?
                    <p
                      className="lastmessage"
                    >
                      {chat[1]?.lastMessage?.img}
                    </p>
                    : null}
                  {((isShowLastMedia(chat, "pdf"))) ?
                    <p
                      className="lastmessage"
                    >
                      {chat[1]?.lastMessage?.pdf}
                    </p>
                    : null}
                </div>
                {/* unseen counts  */}
                {(isShowUnseenCount(chat)) ?
                  <div
                    className="unseenCount"
                  >
                    {chat[1]?.unseen?.unseen}
                  </div>
                  : null}
                {/* eye icon for selected  chat */}
                {(isShowSelectedChatIcon(chat)) ?
                  <img
                    className="eyeImg"
                    src={images.eye}
                    alt=""
                  /> : null}
              </div>
              {/* remove user button */}
              {(isShowSelectedChatIcon(chat)) ?
                <div className="clearUser">
                  <img
                    className="clearUserBtn"
                    src={images.deleteBtn}
                    alt=""
                    onClick={() => { removeUser(chat[1]?.userInfo?.uid) }}
                  />
                </div> : null}
            </div>
          })}
        </div>}
    </div>
  );
};

export default Chats;
