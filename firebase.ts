import firebase from "firebase";

// ojo,que voy a usar el proyecto de disney+
const firebaseConfig = {
  apiKey: "AIzaSyAkKgipf7eYOI4X8CZHefCjbPuY2BVlX1E",
  authDomain: "disneyplus-clone-76429.firebaseapp.com",
  projectId: "disneyplus-clone-76429",
  storageBucket: "disneyplus-clone-76429.appspot.com",
  messagingSenderId: "546445721988",
  appId: "1:546445721988:web:3ad8109b705d42da8c9dd1"
};

// Recuerda que en Next no puedo usar initializeApp() simplemente
const app = !firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app();

const db = app.firestore();

export { db };