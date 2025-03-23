// frontend/src/firebase.ts
import { initializeApp } from "firebase/app";
import { getDatabase, onValue, ref, off } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCXatrcxZJHk-gQWV5ti4pPR2IVq9ofNdw",
  authDomain: "visitcounter-47efc.firebaseapp.com",
  projectId: "visitcounter-47efc",
  storageBucket: "visitcounter-47efc.firebasestorage.app",
  messagingSenderId: "557050438611",
  appId: "1:557050438611:web:211718f245e6122bc2c526",
  measurementId: "G-J15CCGF4C4",
  databaseURL:
    "https://visitcounter-47efc-default-rtdb.asia-southeast1.firebasedatabase.app/", // Thêm databaseURL
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export { ref, onValue, off };
