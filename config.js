import firebase from 'firebase';
require('@firebase/firestore');
var firebaseConfig = {
    apiKey: "AIzaSyACLQ2yHn001FW-1_p4_ojBaAQ5AiF2PDY",
    authDomain: "book-santa-ac964.firebaseapp.com",
    databaseURL: "https://book-santa-ac964.firebaseio.com",
    projectId: "book-santa-ac964",
    storageBucket: "book-santa-ac964.appspot.com",
    messagingSenderId: "542733065977",
    appId: "1:542733065977:web:774695dacbbfaf2430cc28"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
export default firebase.firestore();