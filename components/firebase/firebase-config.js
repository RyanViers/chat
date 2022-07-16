// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

//Firebase configuration.
const firebaseConfig = {
  apiKey: 'AIzaSyDgsp_BXaQkLqPYJYGHGLbZ7ffYJuB7WOg',
  authDomain: 'chat-5cf9c.firebaseapp.com',
  projectId: 'chat-5cf9c',
  storageBucket: 'chat-5cf9c.appspot.com',
  messagingSenderId: '876054052067',
  appId: '1:876054052067:web:30e72ec6da1eb913bb19d6',
  measurementId: 'G-PX03KRBSTF',
};

//Initialize the firebase app.
let setApp;
let setAuth;

//Check if the app is already initialized and if not, initialize it.
if (getApps().length === 0) {
  setApp = initializeApp(firebaseConfig);
  setAuth = initializeAuth(setApp, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} else {
  setApp = getApp();
  setAuth = getAuth(setApp);
}

// Initialize Firebase
export const db = getFirestore(setApp);
export const auth = setAuth;
export const storage = getStorage(setApp);

/*const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);*/
