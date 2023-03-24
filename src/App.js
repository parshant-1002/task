
import Home from "./View/Home";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Register from "./View/Register";
import Login from "./View/Login";
import { useContext } from "react";
import { AuthContext } from "./Context/AuthContext";
import { useSelector } from "react-redux";
function App() {

  const { currentUser } = useContext(AuthContext);
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