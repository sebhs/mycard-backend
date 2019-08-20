const { db, admin, config } = require("../util/admin");
const { convertJSONtoVCard } = require("../util/vcard-converter");
const path = require("path");
const os = require("os");

const uuidv1 = require("uuid/v1");

//public routes

exports.getCardById = (req, res) => {
  db.doc(`cards/${req.params.card_id}`)
    .get()
    .then(doc => {
      if (!doc.exists) {
        return res.status(400).json({ error: `card id not found` });
      }
      if (req.params.format !== "json" && req.params.format !== "vcard") {
        return res.status(400).json({ error: `no such format` });
      }
      if (req.params.format === "json") {
        return res.send(doc.data().body);
      }
      if (req.params.format === "vcard") {
        return res.send(doc.data().vCardUrl);
      }
    })
    .catch(err => {
      console.log(err);
      return res.status(500).json({ error: `something went wrong ${err}` });
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

  let vCard = convertJSONtoVCard(newCard.body);

  uploadvCard(vCard, newCard.card_id)
    .then(() => {
      newCard.vCardUrl = `https://firebasestorage.googleapis.com/v0/b/${
        config.storageBucket
      }/o/${newCard.card_id}.vcf?alt=media`;
      return db.doc(`/cards/${newCard.card_id}`).set(newCard);
    })
    .then(() => {
      console.log(
        `document ${
          newCard.card_id
        }} created successfully, now adding to user ${req.user.user_id}...`
      );
      return db.doc(`users/${req.user.user_id}`).get();
    })
    .then(doc => {
      let cards = doc.data().cards;
      cards.push(newCard.card_id);
      return db
        .doc(`users/${req.user.user_id}`)
        .update({ cards: cards, current_card: newCard.card_id });
    })
    .then(() => {
      return res.json({ card_id: newCard.card_id });
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
  const updatedCard = {
    card_type: req.body.card_type ? req.body.card_type.trim() : "",
    body: req.body.body ? req.body.body : "",
    updated_at: new Date().toISOString()
  };
  if (updatedCard.card_type === "" && updatedCard.body === "") {
    return res.status(400).json({ message: "body empty" });
  }
  db.doc(`cards/${req.body.card_id}`)
    .get()
    .then(doc => {
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
      return db.doc(`cards/${req.body.card_id}`).update({
        body: newBody,
        card_type: newCardType,
        updated_at: updatedCard.updated_at
      });
    })
    .then(() => {
      if (updatedCard.body !== "") {
        let vCard = convertJSONtoVCard(updatedCard.body);
        return uploadvCard(vCard, req.body.card_id);
      }
    })
    .then(() => {
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
    .then(() => {
      return res.json(userCards);
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: `something went wrong` });
    });
};

uploadvCard = (vCard, card_id) => {
  const filename = `${card_id}.vcf`;
  const filepath = path.join(os.tmpdir(), filename);
  vCard.saveToFile(filepath);
  return admin
    .storage()
    .bucket()
    .upload(filepath, {
      resumable: false,
      metadata: {
        cacheControl: "no-cache",
        metadata: {
          cacheControl: "no-cache",
          contentType: "text/vcard"
        }
      }
    });
};
