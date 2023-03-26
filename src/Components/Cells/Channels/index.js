import { doc, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../Context/AuthContext";
import { ChatContext } from "../../../Context/ChatContext";
import { db } from "../../../firebase";
import "./styles.css"
const Channels = () => {
  const [channels, setChannels] = useState([]);
  const [visible, setVisible] = useState(false);

  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  useEffect(() => {
  
    const getChannels = () => {
      const unsub = onSnapshot(doc(db, "userChannels", currentUser.uid), (doc) => {
        setChannels(doc.data())
        doc.exists()&&setVisible(true)
      });

      return () => {
        unsub();
      };
    };

    currentUser.uid && getChannels();
  }, [currentUser.uid]);

  const handleSelect = (u) => {
    dispatch({ type: "CHANGE_USER", payload: u });
  };

  return (
   
   <div>{
     !visible
   ? <label className="warnmessage">Loading ...</label>
   :<div className="chats">
      {Object.entries(channels)?.sort((a,b)=>b[1].date - a[1].date).map((channels) => (
         
          <div
          className="userChat"
          key={channels[0]}
          onClick={() => handleSelect(channels[1].channelInfo)}
          >
        { console.log(channels)}

           
          {/* <img src={chat[1].userInfo.photoURL} alt="" /> */}
          <div className="userChatInfo">

            <span className="info">{channels[1].channelInfo.channelName}</span>
            {/* <p className="lastmessage">{chat[1].lastMessage?.text}</p> */}
          </div>
        </div>
      ))}
    </div>}
      </div>
  );
};

export default Channels;
