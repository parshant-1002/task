
import Home from "./View/Home";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Register from "./View/Register";
import Login from "./View/Login";
import { useContext, useEffect } from "react";
import { AuthContext } from "./Context/AuthContext";
// import { collection, getDocs } from "firebase/firestore";
// import { db } from "./firebase";
// import { ChatContext } from "./Context/ChatContext";

function App() {
  const { currentUser } = useContext(AuthContext);
  // const {dispatch}=useContext(ChatContext)
  // useEffect(() => {
  //   const getUsers=async()=>{

  //     const querySnapshot = await getDocs(collection(db, "users"))
  //     const r = []
  //     querySnapshot.forEach((doc) => {
        
  //       currentUser&& r.push(doc.data())
  //     });
  //    dispatch({type:"GETALLUSERSLIST" ,payload:r}) 
  //   }
  //   getUsers()
  // }, [])
  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/login" />;
    }

    return children
  };
  return (
    <BrowserRouter>
      <Routes>
        <Route>
          <Route
            index
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route path="register" element={<Register />}></Route>
          <Route path="login" element={<Login />}></Route>
   
        </Route>
      </Routes>

    </BrowserRouter>

  );
}

export default App;