const functions = require("firebase-functions");


const express = require("express");
const app = express();
const auth = require("./util/auth")
const {signup,login,exchangeContacts,uploadImage,addUserDetails, getAuthUser} = require('./handlers/users')
const {updateCard,createCard,getCards,getCardById} = require('./handlers/cards');

//user routes
//public
app.post("/signup",signup);
app.post("/login", login);
//protected
app.post("/exchange",auth,exchangeContacts);



//cards routes
//public
app.get("/card/:card_id/:format",getCardById)
//protected
app.post("/createCard", auth, createCard);
app.post("/updateCard", auth, updateCard);
app.get("/cards", auth, getCards);





//app.post("/uploadImage", auth, uploadImage);
//app.post("/user",auth,addUserDetails);
//app.get("/user",auth,getAuthUser)


//1:47

//exports.api = functions.region('europe-west1').https.onRequest(app);
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

