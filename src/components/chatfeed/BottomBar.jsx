import { useState } from "react";
import { BsPlusCircleFill } from "react-icons/bs";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useAuthContext } from "../AuthContext";

const BottomBar = () => {
  const [input, setInput] = useState("");
  const { user } = useAuthContext();

  const handleSubmit = (e) => {
    //TODO validate user input

    e.preventDefault();
    handleNewDoc(input);
    setInput("");
  };

  const handleNewDoc = async (content) => {
    const { displayName, photoURL } = user;
    const collectionRef = collection(db, "messages");
    // TODO change date to human readable format
    const payload = {
      content,
      displayName,
      photoURL,
      time: new Date().getTime(),
    };
    const docRef = await addDoc(collectionRef, payload);
  };

  return (
    <div className="bottom-bar">
      <PlusIcon />
      <form
        className="w-full flex align-center mr-auto ml-2"
        onSubmit={(e) => handleSubmit(e)}
      >
        <input
          className="bottom-bar-input"
          type="text"
          placeholder="Enter message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button className="bg-green-700 rounded-md p-2 ml-auto" type="submit">
          submit
        </button>
      </form>
    </div>
  );
};

const PlusIcon = () => (
  <BsPlusCircleFill
    size="22"
    className="text-green-500 dark:shadow-lg mx-2 dark:text-primary"
  />
);

export default BottomBar;
