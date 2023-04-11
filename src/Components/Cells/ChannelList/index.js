import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../Context/AuthContext";
import { ChatContext } from "../../../Context/ChatContext";
import { db } from "../../../firebase";
import { images } from "../../../Images";
import "./styles.css"
const Channels = () => {
  const [channels, setChannels] = useState([]);
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(false);
  const [messages, setMessages] = useState([])
  const [channelName, setChannelName] = useState([])
  const { currentUser } = useContext(AuthContext);
  const { dispatch, data } = useContext(ChatContext);

  useEffect(() => {
    const getChannels = () => {
      const unsub = onSnapshot(doc(db, "userChannels", currentUser?.uid), (doc) => {
        setChannels(doc.data())
        doc.exists() && setVisible(true)
      });
      return () => {
        unsub();
      };
    };

    currentUser?.uid && getChannels();
  }, [currentUser?.uid]);

  useEffect(() => {
 
    const unSub = onSnapshot(doc(db, "chats", data?.groupId || data?.chatId), (doc) => {
      console.log("🚀 ~ file: index.js:34 ~ unSub ~ data:", data)
      doc?.exists() && setMessages(doc?.data().messages);
    });

    return () => {
      unSub();
    };
  }, [data?.chatId, data?.groupId]);




  useEffect(() => {
    data?.groupId && updateSeenStatusOfMember()
  }, [messages])

  const updateSeenStatusOfMember = async () => {
    const seenData = JSON.parse(JSON.stringify(messages))
    messages?.length && seenData?.map(val =>
      {

        if(val.senderId != currentUser?.uid&&!val.membersSeenGroupText.includes(currentUser?.uid)){
          
          val.membersSeenGroupText.push(currentUser?.uid)
        } 
      })
        
      
    seenData?.length && await updateDoc(doc(db, "chats", data?.groupId), {
      messages: seenData
    })
  }



  useEffect(() => {

    getGroupMemberDetails(channelName)
  }, [channelName, data?.membersAddedStatus])

  const handleSelect = (u) => {
    dispatch({ type: "CHANGE_USER", payload: u });


  };

  const getGroupMemberDetails = async (x) => {
    const groupData = await getDoc(doc(db, "userChannels", currentUser?.uid))
    const groupId = groupData?.data()?.[x]?.["channelInfo"]?.groupId
    const res = groupId && await getDoc(doc(db, "channels", groupId))
    dispatch({ type: "GETGROUPMEMBERS", payload: res?.data()?.["participants"] })

  }


  return (
    <div>{
      !visible
        ? <label className="warnmessage">Loading ...</label>
        : <div className="channels">
          {Object.entries(channels)?.sort((a, b) => b[1].channelInfo.date - a[1].channelInfo.date).map((channels) => (
            <div
              className="userChat"
              key={channels[0]}
              onClick={() => {
                setSelected(channels[1].channelInfo.channelNameId)
                handleSelect(channels[1].channelInfo);
                setChannelName(channels[1].channelInfo.channelName)

              }} >

              <ol className="userChannalInfo">
                <span className="channelInfo"># {channels[1].channelInfo.channelName}</span>
              </ol>
              {channels[1].channelInfo.channelNameId == selected && <img className="eyeImg" src={images.eye} alt=""></img>}
            </div>
          ))}
        </div>}
    </div>
  );
};

export default Channels;
