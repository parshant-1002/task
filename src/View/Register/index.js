import React, { useContext, useEffect, useState } from "react";
import { images } from "../../Images";
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification, sendPasswordResetEmail } from "firebase/auth";
import { auth, db, storage } from "../../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { Link } from "react-router-dom";
import "./styles.css"
import { validEmail } from "../../Shared/Utilities";
import { ChatContext } from "../../Context/ChatContext";
import PasswordView from "../../Components/Atoms/passwordView";
const Register = () => {
  const [err, setErr] = useState("");
  const [nameErrMessage, setNameErrMessage] = useState(false);
  const [emailErrMessage, setEmailErrMessage] = useState(false);
  const [passwordErrMessage, setPasswordErrMessage] = useState(false);
  const [fileErrMessage, setFileErrMessage] = useState(false);
  const [nameBlankInput, setNameBlankInput] = useState(false);
  const [emailBlankInput, setEmailBlankInput] = useState(false);
  const [passwordBlankInput, setPasswordBlankInput] = useState(false);
  const [fileBlankInput, setFileBlankInput] = useState(false);
  const [loading, setLoading] = useState("");
  const { dispatch } = useContext(ChatContext);
  const [displayName, setDisplayName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [file, setFile] = useState("")
  const [passwordView, setPasswordView] = useState("password")


  const handleSubmit = async () => {
    dispatch({ type: "RESET" });
    if (displayName.trim() === "") {
      setNameBlankInput(true)
    }
    if (email.trim() === "") {
      setEmailBlankInput(true)
    }
    if (password.trim() === "") {
      setPasswordBlankInput(true)
    }
    if (!file) {
      setFileBlankInput(true)
    }
    else {
      if (!isNaN(displayName)) {
        setNameErrMessage("Enter valid UserName")
      }
      else if (!validEmail.test(email)) {
        setEmailErrMessage("email is invalid");
      }
      else if (password.length < 6 || !password.split("").some(val => isNaN(val))) {
        setPasswordErrMessage("password is invalid (Enter more than 6 characters and include both number and character)");
      }
      else if (!file) {
        setFileErrMessage("Choose Avatar");
      }
      else {
        setNameBlankInput(false)
        setEmailBlankInput(false)
        setPasswordBlankInput(false)
        setFileBlankInput(false)
        try {
          setLoading("Sending Verification Link")
          const res = await createUserWithEmailAndPassword(auth, email, password);
          // https://slackapp-chicmic.netlify.app/login
          const actionCodeSettings = {
            url: 'https://slackapp-chicmic.netlify.app/login',
            handleCodeInApp: true
          };
          await sendEmailVerification(res.user, actionCodeSettings)
          setLoading("Verification Link Sent")

          const date = new Date().getTime();
          const storageRef = ref(storage, `${displayName + date}`);
          file && await uploadBytesResumable(storageRef, file).then(() => {
            getDownloadURL(storageRef).then(async (downloadURL) => {
              try {
                //Update profile
                await updateProfile(res.user, {
                  displayName,
                  photoURL: downloadURL,
                });
                //create user on firestore
                await setDoc(doc(db, "users", res.user.uid), {
                  uid: res.user.uid,
                  displayName,
                  email,
                  photoURL: downloadURL,
                });
                await setDoc(doc(db, "userChannels", res.user.uid), {});
                await setDoc(doc(db, "userChats", res.user.uid), {});
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
    <div className="formContainer">
      <div className="formWrapper">

        <span className="logo">Slack</span>
        <span className="title">Register</span>
        <input className="inputRegister" type="text" placeholder="UserName" value={displayName} onChange={(e) => {
          setDisplayName(e.target.value.trim())
          setNameBlankInput(false)
          setNameErrMessage(false)
        }} />
        {nameBlankInput && <label className="registerError">*UserName Required</label>}
        {!nameBlankInput && nameErrMessage && <label className="registerError">{nameErrMessage}</label>}
        <input className="inputRegister" type="email" placeholder="email" value={email} onChange={(e) => {
          setEmail(e.target.value)
          setEmailBlankInput(false)
          setEmailErrMessage(false)
        }} />
        {emailBlankInput && <label className="registerError">*Email Required</label>}
        {!emailBlankInput && emailErrMessage && <label className="registerError">{emailErrMessage}</label>}
        <div className="passwordInput">

          <input className="passwordInputRegister" type={passwordView} placeholder="password" value={password} onChange={(e) => {
            setPassword(e.target.value)
            setPasswordBlankInput(false)
            setPasswordErrMessage(false)
          }} />
          <PasswordView setPasswordView={setPasswordView} />

        </div>
        {passwordBlankInput && <label className="registerError">*Password Required</label>}
        {!passwordBlankInput && passwordErrMessage && <label className="registerError">{passwordErrMessage}</label>}
        <input className="inputRegister" accept="image/*" style={{ display: "none" }} type="file" id="file" onChange={(e) => {
          setFile(e.target.files[0])
          setFileBlankInput(false)
          setFileErrMessage(false)
        }} />
        <label className="label" htmlFor="file">
          {file ? <img className="img" src={URL.createObjectURL(file)} alt="" /> : <img className="img" src={images.addAvatar} alt="" />}
          <span>Add an avatar</span>
        </label>
        {fileBlankInput && <label className="registerError">*Avatar Required</label>}
        {!fileBlankInput && fileErrMessage && <label className="registerError">{fileErrMessage}</label>}
        <button className="Signup" onClick={() => { handleSubmit() }}>Sign up</button>
        {!err && loading && <label className="registerError">{loading}</label>}
        {err && !loading && <label className="registerError">{err}</label>}
        <p className="p">
          You do have an account? <Link className="Link" to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
