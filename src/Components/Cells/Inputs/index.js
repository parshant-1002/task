import React, { useContext, useEffect, useState } from "react";
import { images } from "../../../Images";
import { AuthContext } from "../../../Context/AuthContext";
import { ChatContext } from "../../../Context/ChatContext";
import InputEmoji from 'react-input-emoji'
import { arrayUnion, doc, serverTimestamp, updateDoc, } from "firebase/firestore";
import { db, storage } from "../../../firebase";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import "./styles.css"
import Modal from "../../Atoms/Modal";
import Display from "../../Atoms/Display";
import InputFile from "../../Atoms/InputFile";
import AttachmentPreview from "../../Atoms/AttachmentPreview";

const Input = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const [imgName, setImgName] = useState("");
  const [pdf, setPdf] = useState(null);
  const [pdfName, setPdfName] = useState("");
  const [loading, setLoading] = useState(false);
  const [fileStatus, setFileStatus] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const [imgUrl, setImgUrl] = useState(false);
  const [fileUrl, setFileUrl] = useState(false);
  const date = new Date()
  const time = date.getMinutes() < 10 ? `${date.getHours()}:0${date.getMinutes()}` : `${date.getHours()}:${date.getMinutes()}`
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  useEffect(() => {
    setText("")
    setImg(null)
  }, [data])






  const handleSend = async () => {
    setFileStatus(false)
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
            setImgUrl(downloadURL)
            await updateDoc(doc(db, "chats", data.groupId || data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                text,
                senderId: currentUser?.uid,
                date: time,
                img: img && downloadURL,
                fileName: imgName && imgName

              }),
            })
          });
        });
    }
    else if (pdf || fileUrl) {

      setLoading(true)
      const storageRef = ref(storage, uuid());
      const uploadTask = uploadBytesResumable(storageRef, pdf);
      uploadTask.then(
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {

            setLoading(false)
            setFileUrl(downloadURL)
            await updateDoc(doc(db, "chats", data.groupId || data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                text,
                senderId: currentUser?.uid,
                date: time,
                file: pdf && downloadURL,
                fileName: pdfName && pdfName
              }),
            });
          });
        });
    }

    else {
      text.trim() && await updateDoc(doc(db, "chats", data.groupId || data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser?.uid,
          date: time,
        }),
      });
    }

    (!data.chatId.includes("undefined")) && await updateDoc(doc(db, "userChats", currentUser?.uid), {
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
    setImgUrl("")
    setFileUrl("")
  };

  return (
    <div className="inputdata">
      <div id="Hello"
        className="inputText" >
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
        <InputFile
          setInvalid={setInvalid}
          setImg={setImg}
          setImgName={setImgName}
          setFileStatus={setFileStatus}
          setPdf={setPdf}
          setPdfName={setPdfName}
          text={text}
          imgUrl={imgUrl}
          fileUrl={fileUrl}
          handleSend={handleSend} />
        {text.trim() || imgUrl || fileUrl ? <img src={images?.send} alt="send" className="sendbutton" onClick={handleSend}></img> : null}
      </div>
      <Display show={fileStatus} setShow={setFileStatus} showFoot={true} setImgUrl={setImgUrl} setFileUrl={setFileUrl} handleSend={handleSend}>
        <AttachmentPreview img={img} file={pdf} imgName={imgName} fileName={pdfName} />
      </Display>
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
