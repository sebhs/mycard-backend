const { db } = require("../util/admin");
const uuidv1 = require("uuid/v1");

//public routes

exports.getCardById = (req, res) => {
  return db
    .collection("cards")
    .where("card_id", "==", req.params.card_id)
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(function(doc) {
        return res.json(doc.data().body);
      });
      return res.json({});
    })
    .catch(err => {
      console.log(err);
      return res.status(500).json({ error: `something went wrong` });
    });
};

//protected routes
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
    updated_at: "",
    card_id: uuidv1(),
    subscribers: [],
    public: true
  };
  db.collection("cards")
    .add(newCard)
    .then(doc => {
      console.log(
        `document ${doc.id} created successfully, now adding to user ${
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
        cards.push(newCard.card_id);
        return db
          .collection("users")
          .doc(doc.id)
          .update({ cards: cards });
      });
    })
    .then(data => {
      return res.json({ message: `Card created successfully` });
    })
    .catch(err => {
      console.log(err);
      return res.status(500).json({ error: `something went wrong` });
    });
};

exports.updateCard = (req, res) => {
  if (!req.body.card_id || req.body.card_id.trim() === "") {
    return res.status(400).json({ body: "card_id must not be empty" });
  }
  req.body.card_id;
  const updatedCard = {
    card_type: req.body.card_type ? req.body.card_type.trim() : "",
    body: req.body.body ? req.body.body : "",
    updated_at: new Date().toISOString()
  };
  return db
    .collection("cards")
    .where("card_id", "==", req.body.card_id)
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(function(doc) {
        if (doc.data().owner !== req.user.user_id) {
          return res
            .status(400)
            .json({ body: "unauthorized to update this card" });
        }
        const newCardType =
          updatedCard.card_type === ""
            ? doc.data().card_type
            : updatedCard.card_type;
        const newBody =
          updatedCard.body === "" ? doc.data().body : updatedCard.body;
        return db
          .collection("cards")
          .doc(doc.id)
          .update({
            body: newBody,
            card_type: newCardType,
            updated_at: updatedCard.updated_at
          });
      });
    })
    .then(data => {
      return res.json({ message: `Card updated successfully` });
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: `something went wrong` });
    });
};

exports.getCards = (req, res) => {
  let userCards = [];
  return db
    .collection("cards")
    .where("owner", "==", req.user.user_id)
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(function(doc) {
        userCards.push(doc.data());
      });
    })
    .then(data => {
      return res.json(userCards);
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: `something went wrong` });
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
//   }ƒ
// })
// .then((data) => {
//   userId = data.user.uid;
//   return data.user.getIdToken();
// })
