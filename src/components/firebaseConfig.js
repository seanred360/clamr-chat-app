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
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

export const auth = getAuth(firebaseApp);
export { firebaseApp, db, onAuthStateChanged };
