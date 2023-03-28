import React, { useContext, useEffect, useState } from "react";
import Img from "../../../assets/img.png";
import Attach from "../../../assets/attach.png";
import { AuthContext } from "../../../Context/AuthContext";
import { ChatContext } from "../../../Context/ChatContext";
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
  console.log(uuid(),"hi")
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
      [data?.chatId + ".lastMessage"]: {
        text,
      },
      [data.groupId&&data?.chatId + ".date"]: serverTimestamp(),
    });

    setText("");
    setImg(null);
    setPdf(null);
    setPdfName("")
  };
  return (
    <div className="inputdata">
      <input className="messageinput"
        type="text"
        placeholder="Type something..."
        onChange={(e) => setText(e.target.value)}
        value={text}
      />
      <div className="send">
      <input
          type="file"
          style={{ display: "none" }}
          id="pdf"
          onChange={(e) => {
            console.log(e.target.value,"r")
            // console.log(e.target.files[0].type,"image/png")
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
      
        {/* <input
          type="file"
          style={{ display: "none" }}
          id="img"
          onChange={(e) => setImg(e.target.files[0])}

        />
        <label htmlFor="img">
          <img src={Img} alt="" />
        </label> */}
       {text.trim()||img||pdf?<button className="sendbutton" onClick={handleSend}>Send</button>:null}
      </div>
    </div>
  );
};

export default Input;
