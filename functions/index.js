const functions = require("firebase-functions");


const express = require("express");
const app = express();
const auth = require("./util/auth")
const {signup,login,exchangeContacts,sendContactTo} = require('./handlers/users')
const {createOrUpdateCard,getCardById,addCardById} = require('./handlers/cards');

//user routes
//public
app.post("/signup",signup);
app.post("/login", login);

//protected
app.post("/exchange",auth,exchangeContacts);
app.get("/sendContact/:receiverID/",auth, sendContactTo);


//cards routes
//public

//protected
app.get("/card/:cardID/",auth,getCardById)
app.get("/addCard/:cardID/",auth,addCardById)
app.post("/createCard", auth, createOrUpdateCard);
app.post("/updateCard", auth, createOrUpdateCard);







exports.api = functions.https.onRequest(app);

//for reference, default storage settings
// rules_version = '2';
// service firebase.storage {
//   match /b/{bucket}/o {
//     match /{allPaths=**} {
//       allow read, write: if request.auth != null;
//     }
//   }
// }

