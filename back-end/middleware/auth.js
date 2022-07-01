const jwt = require("jsonwebtoken");

const isAuthenticated = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN);

    const userId = decodedToken.id;

    req.auth = { userId };
    if ((req.body.userId && req.body.userId !== userId) || !userId) {
      throw new Error("Une erreur est survenue. Veuillez réessayer.");
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    res.status(401).json({
      error: error.message,
    });
  }
};
module.exports = isAuthenticated;
