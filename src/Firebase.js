// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

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

const provider = new GoogleAuthProvider();

export const signInWithGoogle = () => {
  return signInWithPopup(auth, provider)
    .then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;
      localStorage.setItem("user", JSON.stringify(user));
      return user;
    })
    .catch((error) => {
      console.error("Sign in error:", error.message);
      throw error;
    });
};

export const signOutWithGoogle = () => {
  localStorage.removeItem("user");
  return auth.signOut();
};
