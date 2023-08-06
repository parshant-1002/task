// libs
import React, { useContext, useState } from "react";
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from "firebase/auth";
import { auth, db, storage } from "../../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { Link } from "react-router-dom";

// icons
import { images } from "../../Images";
import "./styles.css"

// utils
import { validPassword, errMessages, validEmail } from "../../Shared/Utilities";
import { ChatContext } from "../../Context/ChatContext";

// components
import PasswordView from "../../Components/Atoms/passwordView";

// consts
import { BUTTON_TEXT, COLLECTION_NAME, LINK, Messages, STRINGS, TEXT } from "../../Shared/Constants";

const Register = () => {
  // hooks
  const { dispatch } = useContext(ChatContext);

  // states
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
  const [displayName, setDisplayName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [file, setFile] = useState("")
  const [passwordView, setPasswordView] = useState(TEXT.PASSWORD_VIEW_TYPE.PASSWORD)

  const setDefault = () => {
    setNameBlankInput(false)
    setNameErrMessage(false)
    setErr("")
    setLoading("")
  }
  // validating inputs
  const validateInputs = () => {
    const displayNameTrimmed = displayName.trim();
    const emailTrimmed = email.trim();
    const passwordTrimmed = password.trim();

    if (displayNameTrimmed === "") {
      setNameBlankInput(true);
      return false;
    }

    if (emailTrimmed === "") {
      setEmailBlankInput(true);
      return false;
    }

    if (passwordTrimmed === "") {
      setPasswordBlankInput(true);
      return false;
    }

    setNameBlankInput(false);
    setEmailBlankInput(false);
    setPasswordBlankInput(false);

    if (!isNaN(displayNameTrimmed)) {
      setNameErrMessage(Messages.notValidUser);
      return false;
    }

    if (!validEmail.test(emailTrimmed)) {
      setEmailErrMessage(Messages.notValidMail);
      return false;
    }

    if (!validPassword.test(passwordTrimmed)) {
      setPasswordErrMessage(Messages.notValidPassword);
      return false;
    }

    return true;
  };

  // form submission
  const handleFormSubmission = async () => {
    try {
      setErr("");
      dispatch({ type: STRINGS.RESET });

      if (!validateInputs()) {
        return;
      }

      if (!file) {
        setFileBlankInput(true);
        setFileErrMessage(Messages.chooseAvatar);
        return;
      }

      setLoading(Messages.sendingVerification);
      // registering user
      const res = await createUserWithEmailAndPassword(auth, email, password);

      const actionCodeSettings = {
        url: LINK.REDIRECT_URL_AFTER_VERIFICATION,
        handleCodeInApp: true,
      };
      // sending email verification
      await sendEmailVerification(res?.user, actionCodeSettings);
      setLoading(Messages.sentVerification);

      const date = new Date().getTime();
      const storageRef = ref(storage, `${displayName + date}`);
      // uploading profile picture
      if (file) {
        const uploadTaskSnapshot = await uploadBytesResumable(storageRef, file);
        const downloadURL = await getDownloadURL(uploadTaskSnapshot.ref);

        await updateProfile(res.user, {
          displayName,
          photoURL: downloadURL,
        });

        const userData = {
          uid: res.user.uid,
          displayName,
          email,
          photoURL: downloadURL,
        };
        await setDoc(doc(db, COLLECTION_NAME.USERS, res.user.uid), userData);
        await setDoc(doc(db, COLLECTION_NAME.CHANNEL_LIST, res.user.uid), {});
        await setDoc(doc(db, COLLECTION_NAME.CHAT_LIST, res.user.uid), {});
      }
    } catch (err) {
      setErr(err.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleFormSubmission();
  };


  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">{TEXT.SLACK}</span>
        <span className="title">{TEXT.REGISTER}</span>
        {/* input for username */}
        <input
          className="inputRegister"
          type="text"
          placeholder={TEXT.USERNAME}
          value={displayName}
          onChange={(e) => {
            setDisplayName(e.target.value.trim())
            setDefault()
          }} />

        {nameBlankInput && <label className="registerError">{TEXT.USERNAME_REQUIRED}</label>}
        {!nameBlankInput && nameErrMessage && <label className="registerError">{nameErrMessage}</label>}

        {/* input for email */}

        <input
          className="inputRegister"
          type={TEXT.EMAIL}
          placeholder={TEXT.EMAIL}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            setDefault()
          }} />

        {emailBlankInput && <label className="registerError">{Messages.emailRequired}</label>}
        {!emailBlankInput && emailErrMessage && <label className="registerError">{emailErrMessage}</label>}

        {/* input for password */}
        <div className="passwordInput">
          <input
            className="passwordInputRegister"
            type={passwordView}
            placeholder={TEXT.PASSWORD}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setDefault()
            }} />
          <PasswordView
            setPasswordView={setPasswordView}
            passwordView={passwordView}
          />

        </div>
        {passwordBlankInput && <label className="registerError">{Messages.passwordRequired}</label>}
        {!passwordBlankInput && passwordErrMessage && <label className="registerError">{passwordErrMessage}</label>}

        {/* input for image */}

        <input
          className="inputRegister"
          accept="image/*"
          style={{ display: "none" }}
          type="file"
          id="file"
          onChange={(e) => {
            setFile(e.target.files[0])
            setDefault()
          }} />

        <label className="label" htmlFor="file">
          {file ?
            <img className="img" src={URL.createObjectURL(file)} alt="" />
            : <img className="img" src={images.addAvatar} alt="" />}
          <span>{TEXT.ADD_AVATAR}</span>
        </label>

        {fileBlankInput && <label className="registerError">{Messages.avatarRequired}</label>}
        {!fileBlankInput && fileErrMessage && <label className="registerError">{fileErrMessage}</label>}

        {/* Sign Up Button */}

        <button
          className="Signup"
          onClick={handleSubmit}>
          {BUTTON_TEXT.SIGN_UP}
        </button>
        {(!err && loading) && <label className="registerError">{loading}</label>}
        {err && <label className="registerError">{errMessages(err)}</label>}
        <p className="p">
          {TEXT.DO_YOU_HAVE_ACCOUNT}
          <Link className="Link" to="/login">{TEXT.LOGIN}</Link>

        </p>
      </div>
    </div>
  );
};

export default Register;
