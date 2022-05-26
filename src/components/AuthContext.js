import { createContext, useContext, useState, useEffect } from "react";
import { auth } from "./firebaseConfig";
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

const AuthContext = createContext();

export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuthContext was used outside of its Provider");
  }

  return context;
};

const AuthProvider = ({ children, initialData }) => {
  //   const [user, setUser] = useState(auth.currentUser);
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(true);

  function SignInWithGoogle() {
    const provider = new GoogleAuthProvider();

    const login = () => {
      signInWithPopup(auth, provider)
        .then((result) => {
          console.log(result);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    // return <button onClick={login}>sign in</button>;
    return login();
  }

  const logout = () => {
    signOut(auth)
      .then(() => {
        console.log("sign out of google success");
      })
      .catch((error) => {
        console.log("sign out of google failed");
      });
  };

  //   useEffect(() => {
  //     // must set user here or causes hydration error
  //     setUser(auth.currentUser);
  //     setLoading(false);
  //   }, []);

  const value = {
    user,
    SignInWithGoogle,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {/* {!loading && children} */}
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
