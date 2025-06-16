import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import firebaseConfig from "./firebaseconfig";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getFirestore(app)


export { app, auth, database};
