import React, { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { ChatContext } from '../../Context/ChatContext'
import { validEmail } from "../../Shared/Utilities";
import "./styles.css"
const Login = () => {
  const [emailErrMessage, setEmailErrMessage] = useState(false);
  const { dispatch } = useContext(ChatContext);
  const [emailBlankInput, setEmailBlankInput] = useState(false);
  const [passwordBlankInput, setPasswordBlankInput] = useState(false);
  const [passwordErrMessage, setPasswordErrMessage] = useState(false);
  const [err, setErr] = useState("");
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {

 if(auth?.currentUser){
  if(!auth?.currentUser?.emailVerified){
    setErr("email not verified")
  }
 }
 else{

 
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;
    dispatch({ type: "RESET" });
    if (email.trim() == "") {

      setEmailBlankInput(true)
    }
    if (password.trim() == "") {

      setPasswordBlankInput(true)
    }
    else{

      if (!validEmail.test(email)) {
        setEmailErrMessage("email is invalid");
      }
      if (password.trim() == "" || password.length < 4 || !password.split("").some(val => isNaN(val))) {
        setPasswordErrMessage("password is invalid (Enter more than 4 characters and include both number and character)");
      }
      else{
      
        try {
          const res= await signInWithEmailAndPassword(auth, email, password);
          console.log(auth,"llllll")
        navigate("/")
        
        } catch (err) {
          setErr(err.message);
        }
      }
    }}
  };
  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">Slack</span>
        <span className="title">Login</span>
        <form className="form" onSubmit={handleSubmit}>
          <input className="input" type="email" placeholder="email" onChange={()=>{ 
             setEmailBlankInput(false)
          setEmailErrMessage(false)}}/>
          {emailBlankInput && <label className="loginError">*Email Required</label>}
        {emailErrMessage && <label className="loginError">{emailErrMessage}</label>}
          <input className="input"  type="password" placeholder="password" onChange={()=>{ 
             setPasswordBlankInput(false)
          setPasswordErrMessage(false)}} />
          {passwordBlankInput && <label className="registerError">*Password Required</label>}
        {passwordErrMessage && <label className="registerError">{passwordErrMessage}</label>}
          <button className="Signin">Sign in</button>
          {err && <span className="loginError">{err}</span>}
        </form>
        <p className="p">You don't have an account? <Link to="/register">Register</Link></p>
      </div>
    </div>
  );
};

export default Login;