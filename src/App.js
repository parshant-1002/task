
import Home from "./View/Home";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom"
import Register from "./View/Register";
import Login from "./View/Login";

import { auth } from "./firebase";


function App() {
    
  localStorage.setItem("auth",JSON.stringify(auth))

  const token=(localStorage.getItem("Token"))
    const ProtectedRoute = ({ children }) => {
  
    if (!token) {
      return <Navigate to="/login"  />;
    }
    else{
      return children

    }
  
  };
  const AuthRoute = ({ children }) => {
    if (token) {
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
          <Route
           path="*" 
            index
            element={
              <ProtectedRoute>
                <Login />
              </ProtectedRoute>
            }
          />
    
        </Route>
      </Routes>

    </BrowserRouter>

  );
}

export default App;