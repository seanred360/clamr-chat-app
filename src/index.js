import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import AuthProvider from "./components/contexts/AuthContext";
import { Provider } from "react-redux";
import store from "./components/store/store";
import FirestoreListener from "./components/FirestoreListener";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <Provider store={store}>
        <FirestoreListener />
        <App />
      </Provider>
    </AuthProvider>
  </React.StrictMode>
);
