import firebase from "firebase/app";
import { firebaseKey } from "../../config";

const firebaseConfig = firebaseKey;

export const firebaseapp = firebase.initializeApp(firebaseConfig);
