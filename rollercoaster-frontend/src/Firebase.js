// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  getIdToken,
} from "firebase/auth";
import Cookies from "universal-cookie";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCdoiB_la7Gt9X3eHYlGxOYyq60CS65IDQ",
  authDomain: "rollercoaster-ranking-45bb7.firebaseapp.com",
  projectId: "rollercoaster-ranking-45bb7",
  storageBucket: "rollercoaster-ranking-45bb7.appspot.com",
  messagingSenderId: "916119171190",
  appId: "1:916119171190:web:5dfe7a2f62bfe288046f57",
  measurementId: "G-3DKL6TZ72T",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const analytics = getAnalytics(app);
const cookies = new Cookies();

const provider = new GoogleAuthProvider();

export const signInWithGoogle = () => {
  const auth = getAuth();
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider)
    .then(async (result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const idToken = await getIdToken(auth.currentUser);
      const user = result.user;

      cookies.set("user", user, { path: "/" });
      cookies.set("token", idToken, { path: "/" });
      return user;
    })
    .catch((error) => {
      console.error("Sign in error:", error.message);
      throw error;
    });
};

export const signOutWithGoogle = () => {
  cookies.remove("user", { path: "/" });
  cookies.remove("token", { path: "/" });
  return auth.signOut();
};

export const refreshIdToken = async () => {
  try {
    const user = auth.currentUser;
    if (user) {
      const idToken = await getIdToken(user);
      cookies.set("token", idToken, { path: "/" });
      console.log("ID token refreshed successfully.");
    }
  } catch (error) {
    console.error("Error refreshing ID token:", error);
  }
};
