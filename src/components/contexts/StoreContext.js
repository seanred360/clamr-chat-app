import { createContext, useContext, useState, useEffect } from "react";

const StoreContext = createContext();

export const useStoreContext = () => {
  const context = useContext(StoreContext);

  if (context === undefined) {
    throw new Error("useAuthContext was used outside of its Provider");
  }

  return context;
};

const StoreProvider = ({ children, initialData }) => {
  const [currentChannel, setCurrentChannel] = useState("@me");
  const [subChannel, setSubChannel] = useState();

  const value = { currentChannel, setCurrentChannel, subChannel, setSubChannel };

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
};

export default StoreProvider;
