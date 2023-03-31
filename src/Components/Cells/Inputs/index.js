import React, { useContext, useEffect, useState } from "react";
import  send from "../../../assets/send.png";
import Attach from "../../../assets/attach.png";
import { AuthContext } from "../../../Context/AuthContext";
import { ChatContext } from "../../../Context/ChatContext";
import InputEmoji from 'react-input-emoji'
import {
  arrayUnion,
  doc,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../../../firebase";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import "./styles.css"

const Input = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const [pdf, setPdf] = useState(null);
  const [pdfName, setPdfName] = useState("");

  
  const date =new Date()
  const time=`${date.getHours()}:${date.getMinutes()}`
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);



  useEffect(() => {
   setText("")
   setImg(null)
  }, [data])

  const handleSend = async () => {
    
    if (img) {
      const storageRef = ref(storage, uuid());
  
      const uploadTask = uploadBytesResumable(storageRef, img||pdf);

      uploadTask.on(
        (error) => {
          //TODO:Handle Error
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {

            await updateDoc(doc(db, "chats", data.groupId|| data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                text,
                senderId: currentUser.uid,
                date: time,
                img: img&&downloadURL,
              
              }),
            });
          });
        }
      );


    }
    else if (pdf) {
      const storageRef = ref(storage, uuid());
  
      const uploadTask =  uploadBytesResumable(storageRef, pdf);


      uploadTask.then(
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateDoc(doc(db, "chats", data.groupId||data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                text,
                senderId: currentUser.uid,
                date: time,
                file:pdf&&downloadURL,
                fileName:pdfName&&pdfName
              }),
            });
          });
        }
      );
    }

    
    
    else {
      text&&await updateDoc(doc(db, "chats", data.groupId||data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text, 
          senderId: currentUser.uid,
          date: time,
        }),
      });
    }

    (!data.chatId.includes("undefined"))&&   await updateDoc(doc(db, "userChats", currentUser.uid), {
      [data.groupId||data?.chatId + ".lastMessage"]: {
        text,
      },
      [data.groupId||data?.chatId + ".date"]: serverTimestamp(),
    });

    (!data.chatId.includes("undefined"))&&  await updateDoc(doc(db, "userChats", data.user.uid),{
      [data.groupId||data?.chatId + ".lastMessage"]: {
        text,
      },
      [data.groupId||data?.chatId + ".date"]: serverTimestamp(),
    });

    setText("");
    setImg(null);
    setPdf(null);
    setPdfName("")
  };

const   handleOnEnter=()=>{
  handleSend()
}




  return (
    <div className="inputdata">
       <div className="inputText" >

       <InputEmoji
        value={text}
        onChange={setText}
        cleanOnEnter
        onEnter={handleOnEnter}
        placeholder="Type a message"
        borderColor="white"
        
        />
        </div>
      <div className="send">
      <input
          type="file"
          style={{ display: "none" }}
          id="pdf"
          onChange={(e) => {
          
           
            if(e.target.value!=""){

              e.target.files[0].type=="image/png"||e.target.files[0].type=="image/jpeg"&&setImg(e.target.files[0])
            setPdf(e.target.files[0])
          setPdfName(e.target.files[0].name)
            }
          }}

        />
      <label htmlFor="pdf">
      <img  className="messimage" src={Attach} alt="" />
        </label>
      
      
 
       {text.trim()||img||pdf?<img src={send} alt="send" className="sendbutton" onClick={handleSend}></img>:null}
      </div>
    </div>
  );
};

export default Input;
