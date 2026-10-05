// Firebase core
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-analytics.js";

// Firebase Authentication
import {
    getAuth
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

// Firestore
import {
    getFirestore
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";


// Your Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyDCeuu0Bluu4b4QYGSfBCOmHkwSBqyUSSA",
    authDomain: "aquatutor.firebaseapp.com",
    projectId: "aquatutor",
    storageBucket: "aquatutor.firebasestorage.app",
    messagingSenderId: "880103900310",
    appId: "1:880103900310:web:a6e82d4c520190bf5aeeb7",
    measurementId: "G-09M86HM2BD"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);


// Export Firebase services
export {
    app,
    auth,
    db
};