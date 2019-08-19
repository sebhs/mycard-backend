const { admin, db, config } = require("../util/admin");
const firebase = require("firebase");
const uuidv1 = require("uuid/v1");

firebase.initializeApp(config);

const {
  validateSignUpData,
  validateLoginData,
  reduceUserDetails
} = require("../util/validators");

exports.signup = (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword
  };

  const { valid, errors } = validateSignUpData(newUser);
  if (!valid) return res.status(400).json(errors);
  let token, user_id;
  firebase
    .auth()
    .createUserWithEmailAndPassword(newUser.email, newUser.password)
    .then(data => {
      user_id = data.user.uid;
      return data.user.getIdToken();
    })
    .then(idToken => {
      token = idToken;
      const userCredentials = {
        email: newUser.email,
        created_at: new Date().toISOString(),
        user_id,
        current_card: "",
        cards: [],
        subs: []
      };
      return db.doc(`/users/${userCredentials.user_id}`).set(userCredentials);
    })
    .then(() => {
      return res.status(201).json({ token });
    })
    .catch(err => {
      console.error(err);
      if (err.code == "auth/email-already-in-user") {
        return res.status(400).json({ email: "email is already in use" });
      } else {
        return res.status(500).json({ error: err.code });
      }
    });
};

//TODO: Change login with SMS instead of email password
exports.login = (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password
  };
  const { valid, errors } = validateLoginData(user);

  if (!valid) return res.status(400).json(errors);

  firebase
    .auth()
    .signInWithEmailAndPassword(user.email, user.password)
    .then(data => {
      return data.user.getIdToken();
    })
    .then(token => {
      return res.json({ token });
    })
    .catch(err => {
      console.log(err);
      if (
        err.code === "auth/wrong-password" ||
        err.code === "auth/user-not-found"
      ) {
        return res.status(403).json({
          general: "Email and password did not match. Please try again."
        });
      }
      return res.status(500).json({ error: err.code });
    });
};

exports.exchangeContacts = (req, res) => {
  //POST {card_id, location}
  const scanner_user_id = req.user.user_id;
  const receiver_card_id = req.body.card_id;
  const location = req.body.location;
  let receiver_user_id;
  let scanner_curr_card_id;
  let scanner_subs;
  let receiver_subs;
  let exchange_id = uuidv1();
  let scannerRef = db.doc(`/users/${scanner_user_id}`);

  db.doc(`/cards/${receiver_card_id}`)
    .get()
    .then(doc => {
      if (!doc.exists) {
        console.log(`receiver_card_id ${receiver_card_id} not found`);
        return res
          .status(400)
          .json({ message: `receiver_card_id ${receiver_card_id} not found` });
      }
      receiver_user_id = doc.data().owner;
      if (receiver_user_id === scanner_user_id) {
        const errMsg = `scanner and receiver cannot be the same`;
        console.log(errMsg);
        return res.status(400).json({ message: errMsg });
      }
    })
    .then(() => {
      return scannerRef.get();
    })
    .then(doc => {
      if (!doc.exists) {
        console.log(`scanner_user_id ${scanner_user_id} not found`);
        return res
          .status(400)
          .json({ message: `scanner_user_id ${scanner_user_id} not found` });
      }
      scanner_subs = doc.data().subs;
      scanner_curr_card_id = doc.data().current_card;

      scanner_subs.indexOf(receiver_card_id) === -1
        ? scanner_subs.push(receiver_card_id)
        : console.log(
            `scanner: ${scanner_user_id} already subscribed to receiver card: ${receiver_card_id}`
          );
      return scanner_subs;
    })
    .then(scanner_subs => {
      return scannerRef.update({ subs: scanner_subs });
    })
    .then(() => {
      return db.doc(`/users/${receiver_user_id}`).get()
    })
    .then(doc => {
      if (!doc.exists) {
        const errMsg = `receiver_user_id ${receiver_user_id} not found`
        console.log(errMsg);
        return res
          .status(400)
          .json({ message: errMsg });
      }
      receiver_subs = doc.data().subs;
      receiver_subs.indexOf(scanner_curr_card_id) === -1
        ? receiver_subs.push(scanner_curr_card_id)
        : console.log(
            `scanner: ${receiver_user_id} already subscribed to receiver card: ${scanner_curr_card_id}`
          );
      return receiver_subs;
    }).then(receiver_subs => {
      if(scanner_curr_card_id !== "") {
        return db.doc(`/users/${receiver_user_id}`).update({subs:receiver_subs})
      }  
    }).then(() => {
      let exchange = {
        created_at: new Date().toISOString(),
        exchange_id,
        receiver_user_id,
        scanner_card_id :scanner_curr_card_id,
        scanner_user_id,
        receiver_card_id,
        location  
      }
      return db.doc(`/exchanges/${exchange.exchange_id}`).set(exchange);
    })
    .then(() => {
      return res.json({ exchange_id: exchange_id });
    })
    .catch(err => {
      console.log(err);
      return res.status(500).json({ error: `something went wrong` });
    });
};

exports.addUserDetails = (req, res) => {
  let userDetails = reduceUserDetails(req.body);
  db.doc(`/users/${req.user.user_id}`)
    .update(userDetails)
    .then(() => {
      return res.json({ message: "Details added successfully" });
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

exports.getAuthUser = (req, res) => {
  let userData = {};
  db.doc(`users/${req.user.user_id}`)
    .get()
    .then(doc => {
      if (doc.exists) {
        return res.json(doc.data());
      }
    })
    .then(data => {
      userData.likes = [];
      data.forEach(doc => {
        userData.likes.push(doc.data());
      });
      return res.json(userData);
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

exports.uploadImage = (req, res) => {
  const BusBoy = require("busboy");
  const path = require("path");
  const os = require("os");
  const fs = require("fs");

  const busboy = new BusBoy({ headers: req.headers });

  let imageToBeUploaded = {};
  let imageFileName;

  busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
    console.log(fieldname, file, filename, encoding, mimetype);
    if (mimetype !== "image/jpeg" && mimetype !== "image/png") {
      return res.status(400).json({ error: "Wrong file type submitted" });
    }
    // my.image.png => ['my', 'image', 'png']
    const imageExtension = filename.split(".")[filename.split(".").length - 1];
    // 32756238461724837.png
    imageFileName = `${Math.round(
      Math.random() * 1000000000000
    ).toString()}.${imageExtension}`;
    const filepath = path.join(os.tmpdir(), imageFileName);
    imageToBeUploaded = { filepath, mimetype };
    file.pipe(fs.createWriteStream(filepath));
  });
  busboy.on("finish", () => {
    admin
      .storage()
      .bucket()
      .upload(imageToBeUploaded.filepath, {
        resumable: false,
        metadata: {
          metadata: {
            contentType: imageToBeUploaded.mimetype
          }
        }
      })
      .then(() => {
        const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${
          config.storageBucket
        }/o/${imageFileName}?alt=media`;
        return db.doc(`/users/${req.user.user_id}`).update({ imageUrl });
      })
      .then(() => {
        return res.json({ message: "image uploaded successfully" });
      })
      .catch(err => {
        console.error(err);
        return res.status(500).json({ error: "something went wrong" });
      });
  });
  busboy.end(req.rawBody);
};
