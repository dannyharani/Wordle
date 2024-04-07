// Import the functions you need from the SDKs you need
import { deleteApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, type Auth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: import.meta.env.VITE_API_KEY,
	authDomain: import.meta.env.VITE_AUTH_DOMAIN,
	projectId: import.meta.env.VITE_PROJECT_ID,
	storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
	messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
	appId: import.meta.env.VITE_APP_ID,
	measurementId: import.meta.env.MEASUREMENT_ID
};

// Initialize Firebase
let firebaseApp: FirebaseApp | undefined;

if (!getApps().length) {
    firebaseApp = initializeApp(firebaseConfig);
} else {
    firebaseApp = getApps()[0];
    deleteApp(firebaseApp);
    firebaseApp = initializeApp(firebaseConfig);
}

const firebaseAuth: Auth = getAuth(firebaseApp);
const firebaseStorage = getStorage(firebaseApp);
const firebaseFirestore = getFirestore(firebaseApp);
const googleAuthProvider = new GoogleAuthProvider();

export { firebaseAuth, firebaseStorage, firebaseFirestore, googleAuthProvider };