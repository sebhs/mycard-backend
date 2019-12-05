const { db, admin, config } = require("../util/admin");
const { convertJSONtoVCard } = require("../util/vcard-converter");
const path = require("path");
const os = require("os");

const uuidv1 = require("uuid/v1");

exports.getCardById = (req, res) => {
  db.doc(`cards/${req.params.cardID}`)
    .get()
    .then(doc => {
      if (!doc.exists) {
        return res.status(400).json({ error: `contact not found` });
      }
      const responseContact = {
        contactBody: doc.data().contactBody,
        vCardUrl: doc.data().vCardUrl,
        ownerID: doc.data().ownerID,
        cardID: doc.data().cardID
      };
      return res.send(responseContact);
    })
    .catch(err => {
      console.log(err);
      return res.status(500).json({ error: `something went wrong ${err}` });
    });
};





exports.addCardById = (req, res) => {
  const cardRef = db.doc(`/cards/${req.params.cardID}`);
  const userRef = db.doc(`/users/${req.user.user_id}`);
  cardRef
    .get()
    .then(doc => {
      if (!doc.exists) {
        return res.status(400).json({ error: `contact not found` });
      }
      const contact = {
        contactBody: doc.data().contactBody,
        vCardUrl: doc.data().vCardUrl,
        ownerID: doc.data().ownerID,
        cardID: doc.data().cardID,
        internalContactID:""
      };
      return userRef
      .collection("contacts")
      .doc(req.params.cardID)
      .set(contact); //TODO: is set in this situation fine?
    }).then(() =>{
      return res.json({ msg: "success" });
    })
    .catch(err => {
      console.log(err);
      return res.status(500).json({ error: `something went wrong ${err}` });
    });
};

exports.createOrUpdateCard = (req, res) => {
  console.log(req.body)
  if (
    !req.body.toUpdate ||
    !req.body.contactBody ||
    !req.body.internalContactID
  ) {
    return res.status(400).json({ error: "Invalid request body" });
  }
  const toUpdate = req.body.toUpdate === "true";
  if (toUpdate && !req.body.cardID) {
    return res.status(400).json({ error: "Need cardID to update card" });
  }
  const contactCard = {
    contactBody: req.body.contactBody,
    vCardUrl: "",
    ownerID: req.user.user_id,
    cardID: toUpdate ? req.body.cardID : uuidv1(),
    publicLinkActive: true,
    lastEditAt: new Date().toISOString()
  };

  const cardInfoForOwner = {
    cardID: contactCard.cardID,
    internalContactID: req.body.internalContactID,
    ownerID: req.user.user_id,
    vCardUrl: "",
    lastEditAt: new Date().toISOString()
  };

  const ownerRef = db.doc(`/users/${cardInfoForOwner.ownerID}`);
  const cardsRef = db.doc(`/cards/${contactCard.cardID}`);

  ownerRef
    .collection("cards")
    .doc(cardInfoForOwner.cardID)
    .set(cardInfoForOwner)
    .then(() => {
      console.log(
        `card ${cardInfoForOwner.cardID} was added to ${cardInfoForOwner.ownerID}`
      );
      return ownerRef.update({ currentCard: cardInfoForOwner.cardID });
    })
    .then(() => {
      return cardsRef.set(contactCard);
    })
    .then(() => {
      return res.json({ cardID: contactCard.cardID });
    })
    .catch(err => {
      console.log(err);
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

// uploadvCard = (vCard, cardID) => {
//   const filename = `${cardID}.vcf`;
//   const filepath = path.join(os.tmpdir(), filename);
//   vCard.saveToFile(filepath);
//   return admin
//     .storage()
//     .bucket()
//     .upload(filepath, {
//       resumable: false,
//       metadata: {
//         cacheControl: "no-cache",
//         metadata: {
//           cacheControl: "no-cache",
//           contentType: "text/vcard"
//         }
//       }
//     });
// };

 //let vCard = convertJSONtoVCard(newCard.body);
  // uploadvCard(vCard, newCard.cardID)
  //   .then(() => {
  //     newCard.vCardUrl = `https://firebasestorage.googleapis.com/v0/b/${
  //       config.storageBucket
  //     }/o/${newCard.cardID}.vcf?alt=media`;
  //     return db.doc(`/cards/${newCard.cardID}`).set(newCard);
  //   })

  // db.doc(`/cards/${newCard.cardID}`).set(newCard,{merge: true})
  //     .then(() => {
  //       console.log(
  //         `document ${
  //           newCard.cardID
  //         }} created successfully, now adding to user ${req.user.user_id}...`
  //       );
  //       return db.doc(`users/${req.user.user_id}`).get();
  //     })
  //     .then(doc => {
  //       let cards = doc.data().cards;
  //       cards.push(newCard.cardID);
  //       return db
  //         .doc(`users/${req.user.user_id}`)
  //         .update({ cards: cards, current_card: newCard.cardID });
  //     })
  //     .then(() => {
  //       return res.json({ cardID: newCard.cardID });
  //     })
  //     .catch(err => {
  //       console.log(err);
  //       return res.status(500).json({ error: `something went wrong` });
  //     });
