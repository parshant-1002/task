import { createContext, useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
   

  useEffect(() => {
    const change = onAuthStateChanged(auth,(user) => {
      
  
      setCurrentUser(user);

    });

    return () => {
      change();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser }}>

      {children}
    </AuthContext.Provider>
  );
};
