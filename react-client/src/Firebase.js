import Firebase from "firebase";
import firebaseConfig from "./config/firebase";

if (!Firebase.apps.length) {
  Firebase.initializeApp(firebaseConfig);
}

export default Firebase;
