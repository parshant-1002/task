import React, { useContext, useEffect, useState } from "react";
import { images } from "../../../Images";
import { AuthContext } from "../../../Context/AuthContext";
import { ChatContext } from "../../../Context/ChatContext";
import InputEmoji from 'react-input-emoji'
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../../../firebase";
import { v4 as uuid } from "uuid";
import {
  getDownloadURL,
  ref,
  uploadBytesResumable
} from "firebase/storage";
import "./styles.css"
import Modal from "../../Atoms/Modal";
import Display from "../../Atoms/Display";
import InputFile from "./fileInput";
import AttachmentPreview from "../../Atoms/AttachmentPreview";
import { COLLECTION_NAME } from "../../../Shared/Constants";
import Loader from "../../Atoms/Loader";

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

  const date = new Date();
  const time = date.getMinutes() < 10 ?
    `${date.getHours()}:0${date.getMinutes()}`
    : `${date.getHours()}:${date.getMinutes()}`
  const id = (data?.groupId || data?.chatId);

  useEffect(() => {
    const unSub = onSnapshot(doc(db, COLLECTION_NAME?.CHAT_DATA, id), (doc) => {
      doc?.exists() && setMessages(doc?.data().messages);
    });
    return () => {
      (data?.groupId || data?.chatId) && unSub();
    };
  }, [data?.chatId, data?.groupId, id]);

  useEffect(() => {
    const unSub = data?.groupId &&
      onSnapshot(doc(db, COLLECTION_NAME?.CHANNELS_DATA, data?.groupId), (doc) => {
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
    setUnseen(messageList?.length ? messageList
      ?.filter(val => (val.senderId === currentUser.uid) && (val.status === false)).length : 0)
  }, [messageList, currentUser.uid])

  useEffect(() => {
    updateUnseenStatus(unseen)
  }, [unseen])

  const updateUnseenStatus = async (unseenCount) => {
    ((!data.chatId.includes("undefined")) && unseenCount) &&
      await updateDoc(doc(db, COLLECTION_NAME?.CHAT_LIST, data.user.uid), {
        [data.groupId || data?.chatId + ".unseen.unseen"]: unseenCount
      })
  }

  const updateGroupUnseenStatus = async (uid) => {
    const res = await getDoc(doc(db, COLLECTION_NAME?.CHANNEL_LIST, uid))
    if (uid !== currentUser?.uid) {
      data?.groupId && await updateDoc(doc(db, COLLECTION_NAME?.CHANNEL_LIST, uid), {
        [data.channelNameId + ".unseen"]: res?.data()?.[data?.channelNameId]?.unseen + 1
      })
    }
  }

  const updateLastTextInGroup = async (ids) => {
    ((data.chatId.includes("undefined")) &&
      ids !== currentUser?.uid) && await updateDoc(doc(db, COLLECTION_NAME?.CHANNEL_LIST, ids), {
        [data?.channelNameId + ".lastMessage"]: {
          text,
          img: img && imgName,
          file: file && fileName
        },
        [data?.channelNameId + ".date"]: serverTimestamp(),
      });
  }
  const handleAddUser = async () => {
    (!data.chatId.includes("undefined")) &&
      await updateDoc(doc(db, COLLECTION_NAME?.CHAT_LIST, data?.user?.uid), {
        [data?.chatId + ".userInfo"]: {
          uid: currentUser?.uid,
        },
        [data?.chatId + ".date"]: serverTimestamp(),
      });
  };

  const handleSend = async (e) => {
    setFileStatus(false)
    try {

      if (file || img) {
        setLoading(true)
        const storageRef = ref(storage, uuid());
        const uploadTask = uploadBytesResumable(storageRef, file || img);
        uploadTask.then(
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
              setLoading(false)
              setFileUrl(downloadURL)
              await updateDoc(doc(db, COLLECTION_NAME?.CHAT_DATA, data?.groupId || data?.chatId), {
                messages: arrayUnion({
                  id: uuid(),
                  text,
                  senderId: currentUser?.uid,
                  date: time,
                  img: img && downloadURL,
                  file: file && downloadURL,
                  fileName: (fileName || imgName) && (imgName || fileName),
                  status: false,
                  membersSeenGroupText: []
                }),
              });
            });
            handleAddUser()
            groupMembers.map(val => updateLastTextInGroup(val?.uid))
            groupMembers.map(val => updateGroupUnseenStatus(val?.uid))
          });
      }

      else {
        text.trim() && await updateDoc(doc(db, COLLECTION_NAME?.CHAT_DATA, data.groupId || data.chatId), {
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

      const response = await getDoc(doc(db, COLLECTION_NAME?.CHAT_LIST, currentUser?.uid));

      if (Object.keys(response?.data()).includes(data?.chatId)) {
        (!data.chatId.includes("undefined")) &&
          await updateDoc(doc(db, COLLECTION_NAME?.CHAT_LIST, data.user.uid), {
            [data.groupId || data?.chatId + ".lastMessage"]: {
              text: text,
              img: imgName,
              file: fileName
            },
            [data.groupId || data?.chatId + ".date"]: serverTimestamp(),
          });
        (!data.chatId.includes("undefined")) &&
          await updateDoc(doc(db, COLLECTION_NAME?.CHAT_LIST, currentUser?.uid), {
            [data.groupId || data?.chatId + ".date"]: serverTimestamp(),
          });
      }
      text.trim() && groupMembers.map(val => updateGroupUnseenStatus(val?.uid))
      text.trim() && handleAddUser()
      text.trim() && groupMembers.map(val => updateLastTextInGroup(val?.uid))
      setText("");
      setImg(null);
      setFile(null);
      setFileName("")
      setImgUrl("")
      setFileUrl("")
    } catch (err) {
      alert(err)
    }
  };

  return (
    <div className="inputdata">
      <div className="inputText" >
        <InputEmoji
          value={text}
          onChange={setText}
          onEnter={handleSend}
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
          handleSend={handleSend}
        />
        {(text.trim() || imgUrl || fileUrl) ?
          <img
            src={images?.send}
            alt="send"
            className="sendbutton"
            onClick={handleSend}
          /> : null}
      </div>

      <Display
        show={fileStatus}
        setShow={setFileStatus}
        showFoot={true}
        setImgUrl={setImgUrl}
        setFileUrl={setFileUrl}
        handleSend={handleSend}>
        <AttachmentPreview
          img={img}
          file={file}
          imgName={imgName}
          fileName={fileName}

        />
      </Display>
      <Loader show={loading} />
      <Modal show={invalid} setShow={setInvalid} showFoot={true}>
        <label>Choosen Data Is Not Supported</label>
      </Modal>
    </div>
  );
};

export default Input;
