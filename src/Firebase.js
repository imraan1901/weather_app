import firebase from 'firebase/app';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: `${process.env.REACT_APP_FIREBASE_KEY}`,
    authDomain: "weather-app-278002.firebaseapp.com",
    databaseURL: "https://weather-app-278002.firebaseio.com",
    projectId: "weather-app-278002",
    storageBucket: "weather-app-278002.appspot.com",
    messagingSenderId: "888415332413",
    appId: "1:888415332413:web:558909c7a94c2937ad6254",
    measurementId: "G-6KQYEL607K"
};

firebase.initializeApp(firebaseConfig);

export default firebase;
