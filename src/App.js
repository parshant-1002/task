
import Home from "./View/Home";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Register from "./View/Register";
import Login from "./View/Login";
import { useContext, useEffect } from "react";
import { AuthContext } from "./Context/AuthContext";
import { auth } from "./firebase";


function App() {
  const { currentUser } = useContext(AuthContext);


  const ProtectedRoute = ({ children }) => {
    if (!auth?.currentUser?.emailVerified) {
      return <Navigate to="/login" />;
    }
  

    return children
  
  };
  const AuthRoute = ({ children }) => {
    if (currentUser) {
      return <Navigate to="/" />;
    }

    return children
  };
  return (
    <BrowserRouter>
      <Routes>
        <Route>
          <Route
          reload="true"
            index
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
           <Route
           path="login" 
            index
            element={
              <AuthRoute>
                <Login />

              </AuthRoute>
            }
          />
           <Route
           path="register" 
            index
            element={
              <AuthRoute>
                <Register />
                
              </AuthRoute>
            }
          />
    
   
        </Route>
      </Routes>

    </BrowserRouter>

  );
}

export default App;