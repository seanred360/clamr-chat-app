import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

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
export { firebaseApp, db };

// export const auth = getAuth(app);
// export const auth = app.auth();
// export default app;
