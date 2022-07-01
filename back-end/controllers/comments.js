const db = require("../dbconnection");

exports.getAllComments = async (req, res) => {
  try {
    const postId = req.params && req.params.postId;
    if (isNaN(postId)) {
      throw new Error("Une erreur est survenu veuillez réessayer.");
    }
    console.log(`** start get all comments for one post **`);

    const queryFields = [postId];

    const queryTxt =
      "SELECT " +
      "c.text, c.owner_id, c.created_at, u.first_name, u.last_name, u.image_url, c.id " +
      "FROM comments AS c " +
      `INNER JOIN users AS u ON c.owner_id = u.id WHERE post_id = ? ` +
      "ORDER BY c.created_at ASC;";

    const [rowsComments] = await db.promise().query(queryTxt, queryFields);

    console.log(`** end get all comments for one post without error **`);
    return res.status(200).send(rowsComments);
  } catch (error) {
    console.log(
      `** end get all comments for one post with an error **`,
      error.message
    );
    return res.status(400).send(error);
  }
};

exports.createComment = async (req, res) => {
  try {
    const { text, postId } = req && req.body;
    console.log(`** start create comment for one post **`);
    if (typeof text === "string" && typeof postId === "number") {
      const queryFields = [postId, req.auth.userId, text];

      const queryTxt =
        "INSERT INTO comments (post_id, owner_id, text) Values (?, ?, ?);";

      await db.promise().query(queryTxt, queryFields);

      console.log(`** end create comment for one post without error **`);
      return res.status(200).send(true);
    } else {
      throw new Error("Paramètres manquant.");
    }
  } catch (error) {
    console.log(
      `** end create comment for one post with an error ** ${error.message}`
    );
    return res.status(400).send(error);
  }
};

exports.deleteComment = async (req, res) => {
  console.log("** start delete comment **");
  try {
    const commentId = req.params.id;

    if (!isNaN(commentId)) {
      const queryCommentsFields = [commentId];
      const queryCommentsTxt = "SELECT * FROM comments WHERE id = ?";

      const [rowsComments] = await db
        .promise()
        .query(queryCommentsTxt, queryCommentsFields);

      const queryUsersFields = [req.auth.userId];

      const queryUsersTxt = "SELECT * FROM users WHERE id = ?;";

      const [rowsUsers] = await db
        .promise()
        .query(queryUsersTxt, queryUsersFields);

      if (
        rowsComments &&
        rowsUsers &&
        rowsComments.length > 0 &&
        rowsUsers.length > 0
      ) {
        const user = rowsUsers[0];
        const comment = rowsComments[0];

        if (
          !comment ||
          !user ||
          (req.auth.userId !== comment.owner_id && !user.is_admin)
        ) {
          return res.status(401).send({
            message: "Vous n'êtes pas autorisé à effectuer cette action.",
          });
        }

        const queryFields = [commentId];

        const queryTxt = "DELETE FROM comments WHERE id = ?;";

        await db.promise().query(queryTxt, queryFields);

        console.log("** end delete comment without error **");
        return res
          .status(200)
          .send({ message: "Votre commentaire a bien été supprimé." });
      }
    } else {
      throw new Error("Paramètre manquant");
    }
  } catch (error) {
    console.log("** end delete comment with an error **", error.message);
    return res.status(400).send(error);
  }
};
