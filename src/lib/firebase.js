import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
   apiKey: "AIzaSyBZDFBB_sGq8OxU-gDv2icHIuQap821i-g",
   authDomain: "calendarapp-e867f.firebaseapp.com",
   databaseURL: "https://calendarapp-e867f-default-rtdb.firebaseio.com",
   projectId: "calendarapp-e867f",
   storageBucket: "calendarapp-e867f.appspot.com",
   messagingSenderId: "49971386473",
   appId: "1:49971386473:web:2d314ff16f5eba9144aaf8"
 };

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);