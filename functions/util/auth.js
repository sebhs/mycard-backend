const {admin,db} = require("./admin")

module.exports = (req, res, next) => {
    let idToken;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      idToken = req.headers.authorization.split("Bearer ")[1];
    } else {
      console.error("No token found");
      return res.status(403).json({ error: "Unauthorized" });
    }
    admin
      .auth()
      .verifyIdToken(idToken)
      .then(decodeToken => {
        req.user = decodeToken;
        return db
          .collection("users")
          .where("user_id", "==", req.user.uid)
          .limit(1)
          .get();
      })
      .then(data => {
        req.user.user_id = req.user.uid;
        return next();
      })
      .catch(err => {
        console.error("Error while verifying token ", err);
        return res.status(403).json(err);
      });
  };