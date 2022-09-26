import { useState, useEffect } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

const EditMessage = ({ chatRoomUid, messageUid, content, onHide }) => {
  const [input, setInput] = useState("");

  useEffect(() => {
    const handleCancel = (e) => {
      if (e.isComposing || e.keyCode === 27) {
        onHide();
      }
    };

    window.addEventListener("keydown", handleCancel, false);
    return () => window.removeEventListener("keydown", handleCancel, false);
  }, [onHide]);

  const handleSetDoc = async (e) => {
    e.preventDefault();
    const docRef = doc(db, `chats/${chatRoomUid}/messages/${messageUid}`);
    const payload = { content: input };
    await setDoc(docRef, payload, { merge: true });
    onHide();
  };

  return (
    <form onSubmit={(e) => handleSetDoc(e)}>
      <input
        className="w-full h-10 p-6 rounded-lg bg-gray-400 dark:bg-gray-600 text-white outline-0"
        defaultValue={content}
        onChange={(e) => setInput(e.target.value)}
      />
      <span className="text-xs text-white">
        esc to{" "}
        <button
          className="text-sky-500 hover:underline"
          onClick={onHide}
          type="button"
        >
          cancel
        </button>{" "}
        • enter to{" "}
        <button className="text-sky-500 hover:underline" type="submit">
          save
        </button>
      </span>
    </form>
  );
};

export default EditMessage;
