import { createContext, useContext } from "react";
import { auth } from "../firebaseConfig";
import {
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  GithubAuthProvider,
  // TwitterAuthProvider,
  // OAuthProvider,
  // signInAnonymously,
  // getAuth,
  signOut,
  // updateProfile,
} from "firebase/auth";
// import { useAuthState } from "react-firebase-hooks/auth";
// import { v4 as uuidv4 } from "uuid";

const AuthContext = createContext();

export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuthContext was used outside of its Provider");
  }

  return context;
};

const AuthProvider = ({ children, initialData }) => {
  // const [user] = useAuthState(auth);
  // const [loading, setLoading] = useState(true);

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

    return login();
  }

  function SignInWithFacebook() {
    const provider = new FacebookAuthProvider();

    const login = () => {
      signInWithPopup(auth, provider)
        .then((result) => {
          console.log(result);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    return login();
  }

  function SignInWithGithub() {
    const provider = new GithubAuthProvider();

    const login = () => {
      signInWithPopup(auth, provider)
        .then((result) => {
          console.log(result);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    return login();
  }

  // function SignInWithGuest() {
  //   const auth = getAuth();

  //   const login = () => {
  //     signInAnonymously(auth)
  //       .then((result) => {
  //         updateProfile(auth.currentUser, {
  //           displayName: `Guest#${uuidv4()}`,
  //           photoURL: `https://avatars.dicebear.com/api/avataaars/${Date.now()}.svg`,
  //         }).then(() => {
  //           document.location.reload(true);
  //         });
  //         console.log("guest profile created" + result);
  //       })
  //       .catch((error) => {
  //         // const errorCode = error.code;
  //         // const errorMessage = error.message;
  //         console.log("Guest login failed!" + error);
  //       });

  //     signInAnonymously(auth)
  //       .then((result) => {
  //         updateProfile(auth.currentUser, {
  //           displayName: "Guest",
  //           photoURL: `https://avatars.dicebear.com/api/avataaars/${Date.now()}.svg`,
  //         }).then(() => {
  //           document.location.reload(true);
  //         });
  //         console.log("guest profile created" + result);
  //       })
  //       .catch((error) => {
  //         // const errorCode = error.code;
  //         // const errorMessage = error.message;
  //         console.log("Guest login failed!" + error);
  //       });
  //   };

  //   return login();
  // }

  const logout = () => {
    signOut(auth)
      .then(() => {
        console.log("sign out success");
      })
      .catch((error) => {
        console.log("sign out failed");
      });
  };

  const value = {
    SignInWithGoogle,
    SignInWithFacebook,
    SignInWithGithub,
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
