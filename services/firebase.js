import * as firebase from 'firebase';
import "firebase/app";
import "firebase/analytics";
import "firebase/database";


//insert config from firebase
const config = {
    apiKey: "AIzaSyCOrNfs6z5HeG8Q6ALToTs1bSplV15Jv-0",
    authDomain: "virtualevent-6d1e6.firebaseapp.com",
    databaseURL: "https://virtualevent-6d1e6.firebaseio.com",
    projectId: "virtualevent-6d1e6",
    storageBucket: "virtualevent-6d1e6.appspot.com",
    messagingSenderId: "5490279696",
    appId: "1:5490279696:web:d3d880ee6f55ba43565195",
    measurementId: "G-ZJMEHHHNG7"
};
const Firebase = !firebase.apps.length ? firebase.initializeApp(config) : firebase


export default Firebase;