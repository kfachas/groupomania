const bcrypt = require("bcrypt");
const db = require("../dbconnection");
const fs = require("fs");

exports.getProfil = async (req, res) => {
  console.log("** start get profil **");
  try {
    const userId = req.params.id;

    const queryFields = [userId];

    const queryTxt = "SELECT * FROM users WHERE users.id = ?";

    const [rowsUsers] = await db.promise().query(queryTxt, queryFields);
    if (rowsUsers && rowsUsers.length > 0) {
      const user = rowsUsers[0];
      if (user.id === req.auth.userId) {
        const dataToSend = {
          firstName: user.first_name,
          lastName: user.last_name,
          filePreview: user.image_url,
          email: user.email,
        };

        console.log("** end get profil without error **");
        return res.status(200).send(dataToSend);
      }
    }
  } catch (error) {
    console.log("** end get profil with an error **", error.message);
    return res.status(400).send(error.message);
  }
};

exports.updateProfil = async (req, res) => {
  console.log("** start update profil **");
  try {
    const userId = req.params.id;

    let { firstName, lastName, confirmPassword } = req.body;

    const queryFields = [userId];

    const queryTxt = "SELECT * FROM users WHERE users.id = ?";

    const [rowsUsers] = await db.promise().query(queryTxt, queryFields);

    if (rowsUsers && rowsUsers.length > 0) {
      const user = rowsUsers[0];
      if (user.id === req.auth.userId) {
        const passwordIsGood = await bcrypt.compare(
          confirmPassword,
          user.password.toString() // buffer to string
        );

        if (!passwordIsGood) {
          return res
            .status(400)
            .send({ message: "Le mot de passe est incorrect." });
        }
        if (!firstName) {
          firstName = user.first_name;
        }
        if (!lastName) {
          lastName = user.last_name;
        }

        let imageUrl = user.image_url;
        if (req.file && req.file.filename) {
          imageUrl = `${req.protocol}://${req.get("host")}/images/${
            req.file.filename
          }`;
          if (user.image_url !== imageUrl) {
            // remove his image url before update image user
            const filename = user.image_url.split("/images/")[1];
            fs.unlinkSync(`images/${filename}`);
          }
        }

        const queryUpdateFields = [firstName, lastName, imageUrl, user.id];

        const queryUpdateTxt =
          "UPDATE users SET first_name = ?, last_name = ?, image_url = ? WHERE users.id = ?;";

        await db.promise().query(queryUpdateTxt, queryUpdateFields);

        console.log("** end update profil without error **");
        return res.status(200).send(true);
      }
    }
    return res.status(400).send(false);
  } catch (error) {
    console.log("** end update profil with an error **", error.message);
    return res.status(400).send(error.message);
  }
};
