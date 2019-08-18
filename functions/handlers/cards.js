const { db, admin, config } = require("../util/admin");
const { convertJSONtoVCard } = require("../util/vcard-converter");
const path = require("path");
const os = require("os");

const uuidv1 = require("uuid/v1");

//public routes

exports.getCardById = (req, res) => {
  return db
    .collection("cards")
    .where("card_id", "==", req.params.card_id)
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(function(doc) {
        if (req.params.format === "json") {
          return res.send(doc.data().body);
        } else if (req.params.format === "vcard") {
          return res.send(doc.data().vCardUrl);
        } else {
          return res.status(400).json({ error: `no such format` });
        }
      });
    })
    .then(() => {
      return res.status(400).json({ error: `ID not found` });
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
  uploadvCard(vCard, newCard.card_id).then(() => {
    newCard.vCardUrl = `https://firebasestorage.googleapis.com/v0/b/${
      config.storageBucket
    }/o/${newCard.card_id}.vcf?alt=media`;
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

      .then(() => {
        return res.json({ card_id: newCard.card_id });
      })
      .catch(err => {
        console.log(err);
        return res.status(500).json({ error: `something went wrong` });
      });
  });
};
//TODO: update vCard
exports.updateCard = (req, res) => {
  if (!req.body.card_id || req.body.card_id.trim() === "") {
    return res.status(400).json({ body: "card_id must not be empty" });
  }
  //req.body.card_id;
  const updatedCard = {
    card_type: req.body.card_type ? req.body.card_type.trim() : "",
    body: req.body.body ? req.body.body : "",
    updated_at: new Date().toISOString()
  };
  if (updatedCard.card_type === "" && updatedCard.body === "") {
    return res.status(400).json({ message: "body empty" });
  }
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
  console.log(filepath);
  vCard.saveToFile(filepath);
  console.log(vCard.getFormattedString());
  console.log("uploading vcard");
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
