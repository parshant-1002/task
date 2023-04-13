import React, { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, updateCurrentUser } from "firebase/auth";
import { auth } from "../../firebase";
import { ChatContext } from '../../Context/ChatContext'
import { validEmail } from "../../Shared/Utilities";
import "./styles.css"
import { AuthContext } from "../../Context/AuthContext";
import PasswordView from "../../Components/Atoms/passwordView";
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
  const [passwordView,setPasswordView]=useState("password")
  const [tokenStatus,setTokanStatus]=useState()
  const [Status,setStatus]=useState(false)
  const navigate = useNavigate();
  

 

  useEffect(() => {
    setTokanStatus(JSON.parse(localStorage.getItem("auth")))
 
  }, [])
  const triggerResetEmail = async () => {
    setErr("")
    setLoading("Sending Password Reset Link ")
    await sendPasswordResetEmail(auth, email);
    setLoading(" Password Reset Sent")

  }
  const handleSendVerificationCode = async () => {
    setLoading("Sending Verification Link")
    const res = await signInWithEmailAndPassword(auth, email, password);

    const actionCodeSettings = {
      url: 'https://slackapp-chicmic.netlify.app/login',
      handleCodeInApp: true
    };
    await sendEmailVerification(res.user, actionCodeSettings)
    setLoading("Verification Link Sent")
  }
  const handleSubmit = async (e) => {
    setLoading("")
    e.preventDefault();
    const email = e.target[0].value;
    setEmail(email)
    const password = e.target[1].value;
    setPassword(password)
    dispatch({ type: "RESET" });
    email&&password?setStatus(true):setStatus(false)
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
        setPasswordErrMessage("password is invalid (Enter more than 6 characters and include both number and character)");
      }
      else {
        try {
          const res = await signInWithEmailAndPassword(auth, email, password);
       console.log(res?.user?.emailVerified,"res")
         localStorage.setItem("Token",(res?._tokenResponse?.idToken))
          if (!res?.user?.emailVerified) {
            setErr("email not verified")
            setShowVerificationButton(true)
          } 
          else{

            window.location.reload()
            navigate("/")
            if(auth){
            }
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
          <div className="passwordInput">
          <input className="passwordInputLogin" type={passwordView} placeholder="password" onChange={() => {
            setPasswordBlankInput(false)
            setPasswordErrMessage(false)
          }} />
              <PasswordView setPasswordView={setPasswordView}/>
          </div>
          {passwordBlankInput && <label className="registerError">*Password Required</label>}
          {passwordErrMessage && <label className="registerError">{passwordErrMessage}</label>}
          <button className="Signin">Sign in</button>
          {err && <span className="loginError">{err}</span>}
        </form>

        {loading && <label className="registerError">{loading}</label>}
        {showVerificationButton && <button className="Verification" onClick={handleSendVerificationCode} >send Verification again</button>}
        <p className="p">You don't have an account? <Link className="Link" to="/register">Register</Link></p>
       {err==="Firebase: Error (auth/wrong-password)."||err==="Firebase: Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later. (auth/too-many-requests)."? <button className="resetBtn" type="button" onClick={triggerResetEmail}>Reset password</button>:null}
       {console.log(email,password)}
      </div>
    </div>
  );
};

export default Login;