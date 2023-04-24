import React, { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { ChatContext } from '../../Context/ChatContext'
import { validEmail } from "../../Shared/Utilities";
import "./styles.css"
import PasswordView from "../../Components/Atoms/passwordView";
import { LINK, Messages, STRINGS, URL } from "../../Shared/Constants";
import Loader from "../../Components/Atoms/Loader";
const Login = () => {
  const [emailErrMessage, setEmailErrMessage] = useState(false);
  const { dispatch } = useContext(ChatContext);
  const [emailBlankInput, setEmailBlankInput] = useState(false);
  const [passwordBlankInput, setPasswordBlankInput] = useState(false);
  const [passwordErrMessage, setPasswordErrMessage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showVerificationButton, setShowVerificationButton] = useState(false);
  const [err, setErr] = useState("");
  const [loaderShow,setLoaderShow]=useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [passwordView, setPasswordView] = useState("password")
  const navigate = useNavigate();

  const triggerResetPassword = async () => {
    setErr("")
    setLoading(Messages.sendingPasswordResetLink)
    await sendPasswordResetEmail(auth, email);
    setLoading(Messages.sentPasswordResetLink)
  }

  const handleSendVerificationCode = async () => {
    setLoading(Messages.sendingVerification)
  
    const res = await signInWithEmailAndPassword(auth, email, password);
    const actionCodeSettings = {
      url: LINK.REDIRECT_URL_AFTER_VERIFICATION,
      handleCodeInApp: true
    };
    await sendEmailVerification(res.user, actionCodeSettings)
  
    setLoading(Messages.sentVerification)
  }

  const handleSubmit = async (e) => {
 
    setLoading("")
    e.preventDefault();
    const email = e.target[0].value;
    setEmail(email)
    const password = e.target[1].value;
    setPassword(password)
    dispatch({ type: STRINGS.RESET });

    if (email.trim() === "") {
      setEmailBlankInput(true)
    }
    if (password.trim() === "") {
      setPasswordBlankInput(true)
    }
    else {
      if (!validEmail.test(email)) {
        setEmailErrMessage(Messages.notValidMail);
      }
      if (password.trim() === "" || password.length < 6 || !password.split("").some(val => isNaN(val))) {
        setPasswordErrMessage(Messages.notValidPassword);
      }
      else {
        try {
          setLoaderShow(true)
          const res = await signInWithEmailAndPassword(auth, email, password);

          if (!res?.user?.emailVerified) {
            setLoaderShow(false)
            setErr("email not verified")
            setShowVerificationButton(true)
          }
          else {
            localStorage.setItem("Token", (res?._tokenResponse?.idToken))
            setLoaderShow(false)
           window.location.reload()
            navigate("/")
          }
        }
        catch (err) {
          setLoaderShow(false)
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
            <PasswordView setPasswordView={setPasswordView} />
          </div>
          {passwordBlankInput && <label className="registerError">*Password Required</label>}
          {passwordErrMessage && <label className="registerError">{passwordErrMessage}</label>}
          <button className="Signin">Sign in</button>
          {err && <span className="loginError">{err}</span>}
        </form>
        {loading && <label className="registerError">{loading}</label>}
        {showVerificationButton && <button className="Verification" onClick={handleSendVerificationCode} >send Verification again</button>}
        <p className="p">You don't have an account? <Link className="Link" to="/register">Register</Link></p>
        {err === "Firebase: Error (auth/wrong-password)." || err === "Firebase: Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later. (auth/too-many-requests)." ? <button className="resetBtn" type="button" onClick={triggerResetPassword}>Reset password</button> : null}
        {console.log(email, password)}
      </div>

      <Loader show={loaderShow}/>
    </div>
  );
};

export default Login;