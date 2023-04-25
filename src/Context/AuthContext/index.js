import { createContext, useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";

export const AuthContext = createContext();
export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const change = onAuthStateChanged(auth, async(user) => {
     user!=null&& await localStorage.setItem("user",JSON.stringify(user))
     const currentUserData=await JSON.parse(localStorage.getItem("user"))
     setCurrentUser(currentUserData);
    });
    
    change();

   
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};
