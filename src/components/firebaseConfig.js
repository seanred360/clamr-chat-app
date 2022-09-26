import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  GithubAuthProvider,
  // TwitterAuthProvider,
  // OAuthProvider,
  // signInAnonymously,
  getAuth,
  signOut,
  // updateProfile,
  onAuthStateChanged,
} from "firebase/auth";

export const SignInWithGoogle = () => {
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
};

export const SignInWithFacebook = () => {
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
};

export const SignInWithGithub = () => {
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
};

export const Logout = () => {
  signOut(auth)
    .then(() => {
      console.log("sign out success");
    })
    .catch((error) => {
      console.log("sign out failed");
    });
};

const firebaseConfig = {
  apiKey: "AIzaSyD_1QrTMmDxVFONadfSmDk4GQx42NCFr_o",
  authDomain: "clamr-44a14.firebaseapp.com",
  projectId: "clamr-44a14",
  storageBucket: "clamr-44a14.appspot.com",
  messagingSenderId: "859289877214",
  appId: "1:859289877214:web:7854c05e9480b48a9aa04f",
  measurementId: "G-LYGEHL5PYP",
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

export const auth = getAuth(firebaseApp);
export { firebaseApp, db, onAuthStateChanged };
