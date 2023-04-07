import React, { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { sendEmailVerification, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { ChatContext } from '../../Context/ChatContext'
import { validEmail } from "../../Shared/Utilities";
import "./styles.css"
import { AuthContext } from "../../Context/AuthContext";
const Login = () => {
  const [emailErrMessage, setEmailErrMessage] = useState(false);
  const { dispatch } = useContext(ChatContext);
  const [emailBlankInput, setEmailBlankInput] = useState(false);
  const [passwordBlankInput, setPasswordBlankInput] = useState(false);
  const [passwordErrMessage, setPasswordErrMessage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showVerificationButton, setShowVerificationButton] = useState(false);
  const [err, setErr] = useState("");
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const handleSendVerificationCode = async () => {
    setLoading(true)
    const res = await signInWithEmailAndPassword(auth, email, password);

    const actionCodeSettings = {
      url: 'https://slackapp-chicmic.netlify.app/login',

      handleCodeInApp: true
    };
    await sendEmailVerification(res.user, actionCodeSettings)
    setLoading(false)
  }
  const handleSubmit = async (e) => {

    e.preventDefault();



    const email = e.target[0].value;
    setEmail(email)
    const password = e.target[1].value;
    setPassword(password)
    dispatch({ type: "RESET" });
    if (email.trim() == "") {

      setEmailBlankInput(true)
    }
    if (password.trim() == "") {

      setPasswordBlankInput(true)
    }
    else {

      if (!validEmail.test(email)) {
        setEmailErrMessage("email is invalid");
      }
      if (password.trim() == "" || password.length < 6 || !password.split("").some(val => isNaN(val))) {
        setPasswordErrMessage("password is invalishowVerificationButtond (Enter more than 4 characters and include both number and character)");
      }
      else {

        try {
          const res = await signInWithEmailAndPassword(auth, email, password);
          if (!res.user.emailVerified) {
            setErr("email not verified")
            setShowVerificationButton(true)
          } else {
            navigate("/")
          }
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
        <span className="title">Login</span>
        <form className="form" onSubmit={handleSubmit}>
          <input className="input" type="email" placeholder="email" onChange={() => {
            setEmailBlankInput(false)
            setEmailErrMessage(false)
          }} />
          {emailBlankInput && <label className="loginError">*Email Required</label>}
          {emailErrMessage && <label className="loginError">{emailErrMessage}</label>}
          <input className="input" type="password" placeholder="password" onChange={() => {
            setPasswordBlankInput(false)
            setPasswordErrMessage(false)
          }} />
          {passwordBlankInput && <label className="registerError">*Password Required</label>}
          {passwordErrMessage && <label className="registerError">{passwordErrMessage}</label>}
          <button className="Signin">Sign in</button>
          {err && <span className="loginError">{err}</span>}
        </form>
        {loading && <label className="registerError">Sending verification Link</label>}
        {showVerificationButton && <button className="Verification" onClick={handleSendVerificationCode} >send Verification again</button>}
        <p className="p">You don't have an account? <Link to="/register">Register</Link></p>
      </div>
    </div>
  );
};

export default Login;