// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDgsp_BXaQkLqPYJYGHGLbZ7ffYJuB7WOg',
  authDomain: 'chat-5cf9c.firebaseapp.com',
  projectId: 'chat-5cf9c',
  storageBucket: 'chat-5cf9c.appspot.com',
  messagingSenderId: '876054052067',
  appId: '1:876054052067:web:30e72ec6da1eb913bb19d6',
  measurementId: 'G-PX03KRBSTF',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
