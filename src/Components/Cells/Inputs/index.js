import React, { useContext, useEffect, useState } from "react";
import { images } from "../../../Images";
import { AuthContext } from "../../../Context/AuthContext";
import { ChatContext } from "../../../Context/ChatContext";
import InputEmoji from 'react-input-emoji'
import { arrayUnion, doc, onSnapshot, serverTimestamp, updateDoc, } from "firebase/firestore";
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
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [fileStatus, setFileStatus] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const [imgUrl, setImgUrl] = useState(false);
  const [fileUrl, setFileUrl] = useState(false);
  const [messageList, setMessages] = useState([])
  const [unseen, setUnseen] = useState();
  const [groupMembers, setGroupMembers] = useState([])

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const date = new Date()
  const time = date.getMinutes() < 10 ? `${date.getHours()}:0${date.getMinutes()}` : `${date.getHours()}:${date.getMinutes()}`
  const id = data?.groupId || data?.chatId

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", id), (doc) => {
      doc?.exists() && setMessages(doc?.data().messages);
    });
    return () => {
      (data?.groupId || data?.chatId) && unSub();
    };
  }, [data?.chatId, data?.groupId,id]);

  useEffect(() => {
    const unSub = data?.groupId && onSnapshot(doc(db, "channels", data?.groupId), (doc) => {
      doc?.exists() && setGroupMembers(doc?.data()["participants"])
    });
    return () => {
      data?.groupId && unSub();
    };
  }, [data]);

  useEffect(() => {
    setText("")
    setImg(null)
  }, [data])

  useEffect(() => {
    setUnseen(messageList?.length ? messageList?.filter(val => val.senderId === currentUser.uid && val.status === false).length : 0)
  }, [messageList,currentUser.uid])

  useEffect(() => {
    updateUnseenStatus(unseen)
  }, [unseen])
  
  const updateUnseenStatus = async (unseenCount) => {
    (!data.chatId.includes("undefined")) && unseenCount && await updateDoc(doc(db, "userChats", data.user.uid), {
      [data.groupId || data?.chatId + ".unseen.unseen"]: unseenCount
    })
  }

  const updateLastTextInGroup = async (ids) => {
    (data.chatId.includes("undefined")) && await updateDoc(doc(db, "userChannels", ids), {
      [data?.channelNameId + ".lastMessage"]: {
        text,
        img: img && imgName,
        file: file && fileName
      },
      [data?.channelNameId + ".date"]: serverTimestamp(),
    });
  }

  const handleSend = async () => {
    setFileStatus(false)
      if (file || img) {
      setLoading(true)
      const storageRef = ref(storage, uuid());
      const uploadTask = uploadBytesResumable(storageRef, file||img);
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
                img: img && downloadURL,
                file: file && downloadURL,
                fileName:( fileName||imgName )&& (imgName|| fileName),
                status: false,
                membersSeenGroupText: []
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
          status: false,
          membersSeenGroupText: []
        }),
      });
    }

    (!data.chatId.includes("undefined")) && await updateDoc(doc(db, "userChats", data.user.uid), {
      [data.groupId || data?.chatId + ".lastMessage"]: {
        text: text,
        img: imgName,
        file: fileName
      },
      [data.groupId || data?.chatId + ".date"]: serverTimestamp(),
    });
    (!data.chatId.includes("undefined")) && await updateDoc(doc(db, "userChats", currentUser?.uid), {
      [data.groupId || data?.chatId + ".date"]: serverTimestamp(),
    });
    groupMembers.map(val => updateLastTextInGroup(val.uid))
    setText("");
    setImg(null);
    setFile(null);
    setFileName("")
    setImgUrl("")
    setFileUrl("")
  };

  return (
    <div className="inputdata">

      <div   className="inputText" >
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
          setFile={setFile}
          setFileName={setFileName}
          text={text}
          imgUrl={imgUrl}
          fileUrl={fileUrl}
          handleSend={handleSend} />
        {text.trim() || imgUrl || fileUrl ? <img src={images?.send} alt="send" className="sendbutton" onClick={handleSend}></img> : null}
      </div>

      <Display show={fileStatus} setShow={setFileStatus} showFoot={true} setImgUrl={setImgUrl} setFileUrl={setFileUrl} handleSend={handleSend}>
        <AttachmentPreview img={img} file={file} imgName={imgName} fileName={fileName} />
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
