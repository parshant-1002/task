import React, { useContext, useEffect, useState } from "react";
import send from "../../../assets/send.png";
import Attach from "../../../assets/attach.png";
import { AuthContext } from "../../../Context/AuthContext";
import { ChatContext } from "../../../Context/ChatContext";
import InputEmoji from 'react-input-emoji'
import {
  arrayUnion,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../../../firebase";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import "./styles.css"
import Modal from "../../Atoms/Modal";

const Input = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const [pdf, setPdf] = useState(null);
  const [pdfName, setPdfName] = useState("");
  const [loading, setLoading] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const date = new Date()
  const time = date.getMinutes() < 10 ? `${date.getHours()}:0${date.getMinutes()}` : `${date.getHours()}:${date.getMinutes()}`
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  useEffect(() => {
    setText("")
    setImg(null)
  }, [data])

  const handleSend = async () => {
    if (img) {
      setLoading(true)
      const storageRef = ref(storage, uuid());

      const uploadTask = uploadBytesResumable(storageRef, img || pdf);

      uploadTask.on(
        (error) => {
          console.log(error, "Error in uploading files")
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            setLoading(false)
            await updateDoc(doc(db, "chats", data.groupId || data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                text,
                senderId: currentUser.uid,
                date: time,
                img: img && downloadURL,

              }),
            });
          });
        }
      );
    }
    else if (pdf) {

      setLoading(true)
      const storageRef = ref(storage, uuid());
      const uploadTask = uploadBytesResumable(storageRef, pdf);
      uploadTask.then(
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {

            setLoading(false)
            await updateDoc(doc(db, "chats", data.groupId || data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                text,
                senderId: currentUser.uid,
                date: time,
                file: pdf && downloadURL,
                fileName: pdfName && pdfName
              }),
            });
          });
        }
      );
    }
    else {
      text.trim() && await updateDoc(doc(db, "chats", data.groupId || data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: time,
        }),
      });
    }

    (!data.chatId.includes("undefined")) && await updateDoc(doc(db, "userChats", currentUser.uid), {
      [data.groupId || data?.chatId + ".lastMessage"]: {
        text,
        img: img && "img",
        pdf: pdf && pdfName
      },
      [data.groupId || data?.chatId + ".date"]: serverTimestamp(),
    });

    (!data.chatId.includes("undefined")) && await updateDoc(doc(db, "userChats", data.user.uid), {
      [data.groupId || data?.chatId + ".lastMessage"]: {
        text,
      },
      [data.groupId || data?.chatId + ".date"]: serverTimestamp(),
    });

    setText("");
    setImg(null);
    setPdf(null);
    setPdfName("")
  };

  return (
    <div className="inputdata">
      <div className="inputText" >
        <InputEmoji
          value={text}
          onChange={setText}
          cleanOnEnter
          onEnter={() => { handleSend() }}
          placeholder="Type a message"
          borderColor="white"

        />
      </div>
      <div className="send">
        <input
          type="file"
          style={{ display: "contents" }}
          id="pdf"
          onChange={(e) => {

            if (e.target.value != "") {
              if (e.target.files[0]?.size > 10000000) {
                setInvalid(true)
              }
              else {

                if (e.target.files[0].type == "image/png" || e.target.files[0].type == "image/jpeg") {
                  setImg(e.target.files[0])
                }
                else {
                  setPdf(e.target.files[0])
                  setPdfName(e.target.files[0].name)
                }
              }

            }
          }}
        />
        <label htmlFor="pdf">
          <img className="messimage" src={Attach} alt="" />
        </label>
        {text.trim() || img || pdf ? <img src={send} alt="send" className="sendbutton" onClick={handleSend}></img> : null}
      </div>
      <Modal show={loading}>
        <label>loading</label>
      </Modal>
      <Modal show={invalid} setShow={setInvalid} showFoot={true}>

        <label>Choosen Data Is Not Supported</label>
      </Modal>
    </div>
  );
};

export default Input;
