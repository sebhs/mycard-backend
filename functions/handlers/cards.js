const { db } = require("../util/admin");
const uuidv1 = require("uuid/v1");
// exports.getAllCards =  (req, res) => {
//     db.collection("cards")
//       .orderBy("created_at", "desc")
//       .get()
//       .then(data => {
//         let cards = [];
//         data.forEach(doc => {
//           cards.push({
//             card_id: doc.id,
//             body: doc.data().body,
//             userHandle: doc.data().userHandle,
//             created_at: doc.data().created_at
//           });
//         });
//         return res.json(cards);
//       })
//       .catch(err => console.error(err));
//   }

exports.createCard = (req, res) => {
  if (req.body.card_type.trim() === "") {
    return res.status(400).json({ body: "Card type must not be empty" });
  }
  if (!req.body.body) {
    return res.status(400).json({ body: "Must have a body" });
  }
  const newCard = {
    card_type: req.body.card_type,
    body: req.body.body,
    owner: req.user.user_id,
    created_at: new Date().toISOString(),
    card_id: uuidv1(),
    subscribers: [],
    public: true
  };
  db.collection("cards")
    .add(newCard)
    .then(doc => {
      console.log(
        `document ${doc.id} created succesfully, now adding to user ${
          req.user.user_id
        }...`
      );
      return db
        .collection("users")
        .where("user_id", "==", req.user.user_id)
        .get();
    })
    .then(querySnapshot => {
      querySnapshot.forEach(function(doc) {
        let cards = doc.data().cards;
        console.log(doc.data())
        cards.push(newCard.card_id);
        return db.collection("users").doc(doc.id).update({cards:cards});
      });
    })
    .then(data => {
      return res.json({ message: `Card created succesfully` });
    })
    .catch(err => {
      res.status(500).json({ error: `something went wrong` });
      console.log(err);
    });
};

// db.doc(`/users/${newUser.handle}`)
// .get()
// .then((doc) => {
//   if (doc.exists) {
//     return res.status(400).json({ handle: 'this handle is already taken' });
//   } else {
//     return firebase
//       .auth()
//       .createUserWithEmailAndPassword(newUser.email, newUser.password);
//   }
// })
// .then((data) => {
//   userId = data.user.uid;
//   return data.user.getIdToken();
// })
