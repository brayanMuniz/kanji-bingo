// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBCr7gJ5FsrNcgiievdA4XqRsmcA6l_QU4",
  authDomain: "kanji-bingo.firebaseapp.com",
  projectId: "kanji-bingo",
  storageBucket: "kanji-bingo.appspot.com",
  messagingSenderId: "796953041153",
  appId: "1:796953041153:web:ca3d2e927092daf1d66300",
  measurementId: "G-8G0MM2Z3Z0",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore();
