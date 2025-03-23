import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB1gTn5cMUTVmZZOtnNKgZLzBVafkkM0ZY",
  authDomain: "vhinternational-359ab.firebaseapp.com",
  projectId: "vhinternational-359ab",
  storageBucket: "vhinternational-359ab.firebasestorage.app",
  messagingSenderId: "495112022347",
  appId: "1:495112022347:web:27f629f2f84ea214a2e0ce"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

export { auth, googleProvider, facebookProvider };