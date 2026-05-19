import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Paste your direct web configuration parameters generated via the Firebase Console here
const firebaseConfig = {
  apiKey: "AIzaSyAiSo4QbPqEOX-bTvbE7BjHtOY78_fTHpY",
  authDomain: "uystudiosprojectdatabase.firebaseapp.com",
  projectId: "uystudiosprojectdatabase",
  storageBucket: "uystudiosprojectdatabase.firebasestorage.app",
  messagingSenderId: "167809203911",
  appId: "1:167809203911:web:694e809a3d6f1015b8c8e2",
  measurementId: "G-VVQRBC27P4"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);