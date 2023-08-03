// libs
import React, { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword
} from "firebase/auth";
import { auth } from "../../firebase";

// context
import { ChatContext } from '../../Context/ChatContext'

// utils
import { validPassword, errMessages, validEmail } from "../../Shared/Utilities";
import "./styles.css"

// components
import Loader from "../../Components/Atoms/Loader";
import PasswordView from "../../Components/Atoms/passwordView";

// consts
import {
  BUTTON_TEXT,
  LINK,
  LOCALSTORAGE_KEY_NAME,
  Messages,
  STRINGS,
  TEXT
} from "../../Shared/Constants";

const defaultErrMessageStatus = {
  email: "",
  password: "",
}
const defaultBlankInputStatus = {
  email: "",
  password: "",
}

const defaultMessages = {
  loading: "",
  errorText: "",
}

const Login = () => {
  // hooks
  const navigate = useNavigate();
  const { dispatch } = useContext(ChatContext);

  // states
  const [isShowErrMessage, setIsShowErrMessage] = useState(defaultErrMessageStatus);
  const [blankInputStatus, setBlankInputStatus] = useState(defaultBlankInputStatus);
  const [message, setMessage] = useState(defaultMessages);

  const [showVerificationButton, setShowVerificationButton] = useState(false);
  const [loaderShow, setLoaderShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordView, setPasswordView] = useState("password");
  const isShowPasswordResetButton = (
    message.errorText === TEXT.WRONG_PASSWORD_ERR_MSG.FIRST ||
    message.errorText === TEXT.WRONG_PASSWORD_ERR_MSG.SECOND
  );
  const triggerResetPassword = async () => {
    setMessage({
      loading: Messages.sendingPasswordResetLink,
      errorText: ""
    });
    await sendPasswordResetEmail(auth, email);
    setMessage(((prevState) => (
      {
        ...prevState,
        loading: Messages.sentPasswordResetLink
      }
    )));
  }

  const handleSendVerificationCode = async () => {
    setMessage(((prevState) => (
      {
        ...prevState,
        loading: Messages.sendingVerification
      }
    )));
    const res = await signInWithEmailAndPassword(auth, email, password);
    const actionCodeSettings = {
      url: LINK.REDIRECT_URL_AFTER_VERIFICATION,
      handleCodeInApp: true
    };
    await sendEmailVerification(res.user, actionCodeSettings);
    setMessage(((prevState) => (
      {
        ...prevState,
        loading: Messages.sentVerification
      }
    )));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const email = e.target[0].value.trim();
    const password = e.target[1].value.trim();
  
    // Input validation
    if (!email) {
      setBlankInputStatus((prevState) => ({ ...prevState, email: true }));
      return;
    }
  
    if (!password) {
      setBlankInputStatus((prevState) => ({ ...prevState, password: true }));
      return;
    }
  
    if (!validEmail.test(email)) {
      setIsShowErrMessage((prevErrState) => ({ ...prevErrState, email: Messages.notValidMail }));
      return;
    }
  
    if (!validPassword.test(password)) {
      setIsShowErrMessage((prevErrState) => ({ ...prevErrState, password: Messages.notValidPassword }));
      return;
    }
  
    // All inputs are valid
    try {
      setMessage((prevState) => ({ ...prevState, loading: "" }));
      setEmail(email);
      setPassword(password);
      setLoaderShow(true);
      dispatch({ type: STRINGS.RESET });
  
      const res = await signInWithEmailAndPassword(auth, email, password);
  
      if (!res?.user?.emailVerified) {
        message.errorText(Messages.emailNotVerified);
        setShowVerificationButton(true);
      } else {
        localStorage.setItem(LOCALSTORAGE_KEY_NAME.TOKEN, res?._tokenResponse?.idToken);
        window.location.reload();
        navigate("/");
      }
    } catch (err) {
      message.errorText(err.message);
    } finally {
      setLoaderShow(false);
    }
  };
  

  const handleResetErrors = {
    email: () => {
      setBlankInputStatus(((prevState) => (
        { ...prevState, email: false }
      )));
      setIsShowErrMessage(((prevErrState) => (
        { ...prevErrState, email: "" }
      )));
    },
    password: () => {
      setBlankInputStatus(((prevState) => (
        { ...prevState, password: false }
      )));
      setIsShowErrMessage(((prevErrState) => (
        { ...prevErrState, password: "" }
      )));
    }
  };

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">Slack</span>
        <span className="title">Login</span>
        <form className="form" onSubmit={handleSubmit}>
          <input
            className="input"
            type={TEXT.EMAIL}
            placeholder={TEXT.EMAIL}
            onChange={handleResetErrors.email}
          />
          {blankInputStatus.email && <label className="loginError">{Messages.emailRequired}</label>}
          {isShowErrMessage.email && <label className="loginError">{isShowErrMessage.email}</label>}

          <div className="passwordInput">
            <input
              className="passwordInputLogin"
              type={passwordView}
              placeholder={TEXT.PASSWORD}
              onChange={handleResetErrors.password}
            />
            <PasswordView setPasswordView={setPasswordView} />
          </div>

          {
            blankInputStatus.password &&
            <label className="registerError">
              {Messages.passwordRequired}
            </label>
          }
          {
            isShowErrMessage.password &&
            <label className="registerError">
              {isShowErrMessage.password}
            </label>
          }

          <button className="Signin">{BUTTON_TEXT.SIGN_IN}</button>
          {
            message.errorText &&
            <span className="loginError">
              {errMessages(message.errorText)}
            </span>
          }
        </form>
        {
          message.loading &&
          <label className="registerError">
            {message.loading}
          </label>
        }
        {
          showVerificationButton &&
          <button
            className="Verification"
            onClick={handleSendVerificationCode}
          >
            {BUTTON_TEXT.SEND_VERIFICATION_AGAIN}
          </button>
        }
        <p className="p">
          {TEXT.DONT_HAVE_ACCOUNT}
          <Link className="Link" to="/register">
            {TEXT.REGISTER}
          </Link>
        </p>
        {isShowPasswordResetButton
          ?
          <button
            className="resetBtn"
            type="button"
            onClick={triggerResetPassword}
          >
            {BUTTON_TEXT.RESET_PASSWORD}
          </button>
          : null}
      </div>

      <Loader show={loaderShow} />
    </div>
  );
};

export default Login;