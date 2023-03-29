import React, { useState } from "react";
import Add from "../../assets/download.png";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db, storage } from "../../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import "./styles.css"
const Register = () => {
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = e.target[3].files[0];

    try {

      const res = await createUserWithEmailAndPassword(auth, email, password);
      const date = new Date().getTime();
      const storageRef = ref(storage, `${displayName + date}`);

      await uploadBytesResumable(storageRef, file).then(() => {
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
            // await setDoc(doc(db, "channels", res.user.uid))
            await setDoc(doc(db, "userChats", res.user.uid), {});
            navigate("/");
          } catch (err) {
            console.log(err);
            setErr(true);
            setLoading(false);
          }
        });
      });
    } catch (err) {
      setErr(true);
      setLoading(false);
    }
  };

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">Slack</span>
        <span className="title">Register</span>
        <form className="form" onSubmit={handleSubmit}>
          <input className="input" required type="text" placeholder="display name" />
          <input className="input" required type="email" placeholder="email" />
          <input className="input" required type="password" placeholder="password" />
          <input className="input" required style={{ display: "none" }} type="file" id="file" />
          <label className="label" htmlFor="file">
            <img className="img" src={Add} alt="" />
            <span>Add an avatar</span>
          </label>
          <button className="Signup" disabled={loading}>Sign up</button>
          {loading && "Uploading and compressing the image please wait..."}
          {err && <span>Something went wrong</span>}
        </form>
        <p className="p">
          You do have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
