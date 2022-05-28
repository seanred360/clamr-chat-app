import SideBar from "./components/SideBar";
import ChannelBar from "./components/ChannelBar";
import ChatFeed from "./components/chatfeed/ChatFeed";
import { useAuthContext } from "./components/AuthContext";
import { FcGoogle } from "react-icons/fc";
import { GrFacebook, GrGithub } from "react-icons/gr";

function App() {
  const { user } = useAuthContext();

  return (
    <main className="flex items-center justify-center bg-gray-500 p-6 md:p-0">
      {user ? <ChatRoom /> : <SignInPage />}
    </main>
  );
}

function ChatRoom() {
  return (
    <div className="flex w-full h-screen">
      <SideBar />
      <ChannelBar />
      <ChatFeed />
    </div>
  );
}

const SignInPage = () => {
  const {
    SignInWithGoogle,
    SignInWithFacebook,
    SignInWithGithub,
    SignInWithTwitter,
    SignInWithMicrosoft,
    SignInWithGuest,
  } = useAuthContext();

  return (
    <div className="w-screen h-screen flex align-center justify-center">
      <div className="w-96 h-96 mx-auto my-auto p-6 bg-gray-400 rounded-lg drop-shadow-lg">
        <h1 className="mb-6 text-center text-2xl font-bold">
          Welcome to Clamr
        </h1>
        <ul className="flex items-center justify-center flex-col">
          <li className="mb-3 w-full">
            <button
              className="w-full flex items-center justify-start p-4 bg-white rounded-sm drop-shadow-md hover:opacity-50 ease-out duration-300"
              onClick={SignInWithGoogle}
            >
              <FcGoogle className="mr-6 text-2xl" />
              <span className="font-bold text-gray-500">
                Sign in with Google
              </span>
            </button>
          </li>
          <li className="mb-3 w-full">
            <button
              className="w-full flex items-center justify-start p-4 bg-blue-800 rounded-sm drop-shadow-md hover:opacity-50 ease-out duration-300"
              onClick={SignInWithFacebook}
            >
              <GrFacebook className="mr-6 text-2xl text-white" />
              <span className="font-bold text-white">
                Sign in with Facebook
              </span>
            </button>
          </li>
          <li className="mb-3 w-full">
            <button
              className="w-full flex items-center justify-start p-4 bg-gray-800 rounded-sm drop-shadow-md hover:opacity-50 ease-out duration-300"
              onClick={SignInWithGithub}
            >
              <GrGithub className="mr-6 text-2xl text-white" />
              <span className="font-bold text-white">Sign in with Github</span>
            </button>
          </li>
          <li className="mb-3 w-full">
            <button
              className="w-full flex items-center justify-start p-4 bg-sky-500 rounded-sm drop-shadow-md hover:opacity-50 ease-out duration-300"
              onClick={SignInWithGuest}
            >
              <GrGithub className="mr-6 text-2xl text-white" />
              <span className="font-bold text-white">Sign in as a guest</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default App;
