// firebase-config.js
// Tu configuración de Firebase 
const firebaseConfig = {
    apiKey: "AIzaSyB3JFhrBA8NhUKa0cwchGQeusjMn9ZelwM",
    authDomain: "juanantonioelanalistaconia.firebaseapp.com",
    databaseURL: "https://juanantonioelanalistaconia-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "juanantonioelanalistaconia",
    storageBucket: "juanantonioelanalistaconia.firebasestorage.app",
    messagingSenderId: "1027750229416",
    appId: "1:1027750229416:web:6091bf003b55527552d99d",
    measurementId: "G-665N3XYC4Z"
};

// Inicializa Firebase
firebase.initializeApp(firebaseConfig);

// Obtén referencias a los servicios que usarás
const auth = firebase.auth();
const database = firebase.database();
