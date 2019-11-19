const admin = require("firebase-admin");
const serviceAccount = require("/Users/sebhs/Downloads/mycard-93892-firebase-adminsdk-ebhfv-3b909e7499.json"); //comment in for firebase serve

const config = {
  // credential: admin.credential.applicationDefault(), //for firebase deploy
  credential: admin.credential.cert(serviceAccount), //comment in local firebase serve
  apiKey: "AIzaSyBezkELNu-TfdbkE0px0bMDLsMKLZiwNAY",
  authDomain: "mycard-93892.firebaseapp.com",
  databaseURL: "https://mycard-93892.firebaseio.com",
  projectId: "mycard-93892",
  storageBucket: "mycard-93892.appspot.com",
  messagingSenderId: "1062565496260",
  appId: "1:1062565496260:web:0aebd10f0fa015d0"
};
admin.initializeApp(config);

const db = admin.firestore();

module.exports = { admin, db, config };
