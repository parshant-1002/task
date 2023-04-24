import React, { useContext, useEffect, useState } from "react";
import { images } from "../../../Images";
import { updateProfile } from "firebase/auth";
import { db, storage } from "../../../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";
import "./styles.css"
import { ChatContext } from "../../../Context/ChatContext";
import { AuthContext } from "../../../Context/AuthContext";
import { COLLECTION_NAME, STRINGS } from "../../../Shared/Constants";
import Loader from "../../Atoms/Loader";
const EditUserProfile = ({ setShow }) => {
    const [err, setErr] = useState("");
    const [nameErrMessage, setNameErrMessage] = useState(false);
    const [fileErrMessage, setFileErrMessage] = useState(false);
    const [nameBlankInput, setNameBlankInput] = useState(false);
    const [fileBlankInput, setFileBlankInput] = useState(false);
    const [loader, setLoader] = useState("")
    const { dispatch } = useContext(ChatContext);
    const [displayName, setDisplayName] = useState("")
    const [file, setFile] = useState("")
    const { currentUser } = useContext(AuthContext)

    useEffect(() => {
        setDisplayName(currentUser?.displayName)
    }, [])

    const handleSubmit = async () => {
        dispatch({ type: STRINGS.RESET });
        if (displayName.trim() === "") {
            setNameBlankInput(true)
        }
        else {
            if (!isNaN(displayName)) {
                setNameErrMessage("Enter valid UserName")
            }
            else {
                setNameBlankInput(false)
                try {
                    setLoader(true)
                    const date = new Date().getTime();
                    const storageRef = ref(storage, `${displayName + date}`);
                    await uploadBytesResumable(storageRef, file).then(() => {
                        getDownloadURL(storageRef).then(async (downloadURL) => {
                            try {
                                //Update profile
                                await updateProfile(currentUser, {
                                    displayName,
                                    photoURL: file ? downloadURL : currentUser?.photoURL,
                                });
                                //create user on firestore
                                await updateDoc(doc(db, COLLECTION_NAME?.USERS, currentUser.uid), {
                                    uid: currentUser.uid,
                                    displayName,
                                    photoURL: file ? downloadURL : currentUser?.photoURL,
                                });
                                setLoader(false)
                                setShow(false)
                            } catch (err) {
                                console.log(err);
                                setErr(true);
                            }
                        });
                    });
                } catch (err) {
                    setErr(err.message);
                }
            }
        }
    };

    return (

        <div className="editFormContainer">
            <div className="nameInput">
                <label className="inputMessages">Update Name</label>
                <input className="inputEdit" type="text" placeholder="UserName" value={displayName} onChange={(e) => {
                    setDisplayName(e.target.value.trim())
                    setNameBlankInput(false)
                    setNameErrMessage(false)
                }} />
                {nameBlankInput && <label className="editProfileError">*UserName Required</label>}
                {!nameBlankInput && nameErrMessage && <label className="editProfileError">{nameErrMessage}</label>}
            </div>
            <div className="fileInput">
                <input accept="image/*" style={{ display: "none" }} type="file" id="file" onChange={(e) => {
                    setFile(e.target.files[0])
                    setFileBlankInput(false)
                    setFileErrMessage(false)
                }} />
                <label className="fileLabel" htmlFor="file">
                    <label className="inputMessages">Update Avatar</label>
                    {file ? <img className="img" src={URL.createObjectURL(file)} alt="" /> : <img className="img" src={images.addAvatar} alt="" />}
                    <span>Change avatar</span>
                </label>
                {fileBlankInput && <label className="editProfileError">*Avatar Required</label>}
                {!fileBlankInput && fileErrMessage && <label className="editProfileError">{fileErrMessage}</label>}
            </div>
            <button className="Update" onClick={() => { handleSubmit() }}>Update</button>
            <button className="closeProfile" onClick={() => { setShow(false) }}>Cancle</button>
            {!err && loader && <Loader show={loader}/>}
            {err && <label className="editProfileError">{err}</label>}
            
        </div>
    );
};

export default EditUserProfile;
