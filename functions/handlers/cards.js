const {db} =require('../util/admin')
exports.getAllCards =  (req, res) => {
    db.collection("cards")
      .orderBy("created_at", "desc")
      .get()
      .then(data => {
        let cards = [];
        data.forEach(doc => {
          cards.push({
            card_id: doc.id,
            body: doc.data().body,
            userHandle: doc.data().userHandle,
            created_at: doc.data().created_at
          });
        });
        return res.json(cards);
      })
      .catch(err => console.error(err));
  }

  exports.createCard = (req, res) => {
    if (req.body.body.trim() === "") {
      return res.status(400).json({ body: "Body must not be empty" });
    }
    const newCard = {
      body: req.body.body,
      userHandle: req.user.userHandle,
      created_at: new Date().toISOString()
    };
    db.collection("cards")
      .add(newCard)
      .then(doc => {
        res.json({ message: `document ${doc.id} created succesfully` });
      })
      .catch(err => {
        res.status(500).json({ error: `something went wrong` });
        console.log(err);
      });
  }
  