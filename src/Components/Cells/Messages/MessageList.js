/* eslint-disable jsx-a11y/alt-text */
// libs
import React, { useContext, useEffect, useRef, useState } from "react";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase";

// context
import { AuthContext } from "../../../Context/AuthContext";
import { ChatContext } from "../../../Context/ChatContext";

// styles
import "./styles.css";

// components
import { images } from "../../../Images";
import { COLLECTION_NAME } from "../../../Shared/Constants";

// components
import Modal from "../../Atoms/Modal";

const Message = ({ message }) => {
  const { data } = useContext(ChatContext);
  const { currentUser } = useContext(AuthContext);
  const lastMessageLocation = useRef();

  const [gotdataOfUser, setGotDataOfUser] = useState();
  const [groupMembers, setGroupMembers] = useState([]);
  const [show, setShow] = useState(false);

  useEffect(() => {
    resetLatestAndUnreadCount()
  }, [message]);

  const resetLatestAndUnreadCount = async () => {
    try {
      if (data?.channelNameId) {
        updateDoc(doc(db, COLLECTION_NAME?.CHANNEL_LIST, currentUser?.uid), {
          [data?.channelNameId + ".unseen"]: 0,
          [data?.channelNameId + ".lastMessage"]: {
            img: "",
            pdf: "",
            text: ""
          }
        })
      }
    } catch (err) {
      alert(err)
    }
  };

  useEffect(() => {
    gettingUserDetail();
  }, []);

  const gettingUserDetail = async () => {
    const res = await getDoc(doc(db, COLLECTION_NAME?.USERS, message.senderId));
    setGotDataOfUser(res.data());
  }
  // setting group members data
  useEffect(() => {
    const unSub = data?.groupId && onSnapshot(doc(db, COLLECTION_NAME?.CHANNELS_DATA, data?.groupId), (doc) => {
      doc?.exists() && setGroupMembers(doc?.data()["participants"])
    });
    return () => {
      data?.groupId && unSub();
    };
  }, [data]);

  // for applying scroll on view in messages  
  useEffect(() => {
    lastMessageLocation.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);


  return (
    <div
      ref={lastMessageLocation}
      className={`message${message.senderId === currentUser?.uid && "owner"}`} >
      <div className="messageInfo">
        <div>
          {/* checking is group and is message is sended by me to open member list who seen text */}
          {data?.groupId && (message.senderId === currentUser.uid) &&
            <img
              className="messageSeenDetails"
              src={images.messageSeenDetails}
              alt=""
              onClick={() => { setShow(true) }}
            />}
            
          {/* sender pic  */}
          {gotdataOfUser && <img
            className="senderimg"
            src={gotdataOfUser?.photoURL}
            alt=""
          />}
        </div>
        <div className="messageContent">
          <div className="userDetails">
            {/* sender name  */}
            {gotdataOfUser &&
              <label
                className="senderName"
              >
                {gotdataOfUser.displayName}
              </label>}
            {/* message sent time  */}
            <span className="atTime">{message.date}</span>
            {/* message status seen/unseen  */}
            {message.senderId === currentUser.uid && (
              <img
                className="seenStatus"
                src={data?.groupId
                  ? message.membersSeenGroupText?.length !== groupMembers?.length - 1
                    ? images.singleTick
                    : images.doubleTick
                  : !message?.status
                    ? images.singleTick
                    : images.doubleTick}
              />
            )}

          </div>
          {/* message text  */}
          {message?.text &&
            <p className={`messgtext${message.senderId === currentUser?.uid && "owner"}`}>
              {message.text}
            </p>}
          {/* message img  */}
          {message?.img &&
            <a
              href={message.img}
              target="_blank"
              download rel="noreferrer"
            >
              <img className="chatimg" src={message.img} alt="" />
            </a>}
          {/* message file  */}
          {message?.file &&
            <a
              href={message.file}
              target="_blank"
              download rel="noreferrer"
            >
              <img className="pdf" src={images?.file} alt="" />
            </a>}
          {message?.fileName && <label className="fileName">{message.fileName}</label>}

          {/* popup to display seen member list  */}
          <Modal show={show} setShow={setShow} showHead={"true"} title={"Seen By"}>
            <div className="closeSeenDetailsButton">
              <img
                className="crossBlack"
                src={images.crossBlack}
                alt=""
                onClick={() => { setShow(false) }} />
            </div>
            <div className="seenByMembers">
              {message?.membersSeenGroupText?.length
                ? message?.membersSeenGroupText?.map((val) => {
                  return (groupMembers?.map(value =>
                  (value.uid === val &&
                    <h7 >
                      <div>
                        {value?.name}
                      </div>
                      <div className="seenByMembersDetails">
                        {value?.email}
                      </div>
                    </h7>)))
                }) : <h1>no user</h1>}
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default Message;
