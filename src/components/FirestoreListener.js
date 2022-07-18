import { doc, onSnapshot, collection, query, where } from "firebase/firestore";
import { db, auth, onAuthStateChanged } from "./firebaseConfig";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, loginSuccess, logout } from "./store/slices/authSlice";
import store from "./store/store";
import {
  setUserData,
  setGroupChatData,
  setFriendChatData,
} from "./store/slices/userDataSlice";

const FirestoreListener = () => {
  const currentUser = useSelector(selectUser);
  const dispatch = useDispatch();

  // check at page load if a user is authenticated
  useEffect(() => {
    onAuthStateChanged(auth, (userAuth) => {
      if (userAuth) {
        // user is logged in, send the user's details to redux, store the current user in the state
        dispatch(
          loginSuccess({
            email: userAuth.email,
            uid: userAuth.uid,
            displayName: userAuth.displayName,
            photoURL: userAuth.photoURL,
          })
        );
      } else {
        dispatch(logout());
      }
    });
  }, []);

  // listen for database changes on the current user
  useEffect(() => {
    if (currentUser) {
      const unsub = onSnapshot(doc(db, "users", currentUser.uid), (doc) => {
        store.dispatch(setUserData(doc.data()));
      });
      return () => unsub();
    }
  }, [currentUser]);

  // listen for database changes to rooms the user is a member of
  useEffect(() => {
    if (currentUser) {
      const chatRoomsRef = collection(db, "chatRooms");
      const q = query(
        chatRoomsRef,
        where("members", "array-contains", currentUser.uid)
      );
      const unsub = onSnapshot(q, (querySnapshot) => {
        let groupChats = [];
        let friendChats = [];
        querySnapshot.forEach((doc) => {
          const docData = doc.data();
          if (docData.isGroup) groupChats.push(docData);
          else friendChats.push(docData);
        });
        if (groupChats.length > 0) store.dispatch(setGroupChatData(groupChats));
        if (friendChats.length > 0)
          store.dispatch(setFriendChatData(friendChats));
      });
      return () => unsub();
    }
  }, [currentUser]);
};

export default FirestoreListener;
