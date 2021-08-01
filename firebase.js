import firbase from "firebase/app";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBZTgzhxyyVZnzMQ8i8rp0l08IlxXFT3ss",
  authDomain: "chiyeolhan-haru.firebaseapp.com",
  projectId: "chiyeolhan-haru",
  storageBucket: "chiyeolhan-haru.appspot.com",
  messagingSenderId: "661313276388",
  appId: "1:661313276388:web:16836f1faf8f771c895ff1",
  measurementId: "G-L33L84F2ZW",
};

firbase.initializeApp(firebaseConfig);

export const dbService = firbase.firestore();
