const db = require("../dbconnection");
const fs = require("fs");

exports.getAllPosts = async (req, res) => {
  console.log("** start get all posts **");
  try {
    const userId = req.auth.userId;

    const queryFields = [userId];

    const queryTxt =
      "SELECT " +
      "u1.first_name, u1.last_name, u1.image_url as owner_image_url, " +
      "p.id, p.created_at, p.owner_id, p.image_url, p.title, p.description, " +
      "l1.id as like_id, COUNT(DISTINCT c.id) as nb_comments, COUNT(DISTINCT l2.owner_id) as post_likes, COUNT(DISTINCT l3.owner_id) as post_dislikes " +
      "FROM posts as p " +
      "INNER JOIN users as u1 ON p.owner_id = u1.id " +
      "LEFT JOIN likes as l1 ON p.id = l1.post_id AND l1.owner_id = ? " +
      "LEFT JOIN likes as l2 ON p.id = l2.post_id AND l2.id = 1 " +
      "LEFT JOIN likes as l3 ON p.id = l3.post_id AND l3.id = -1 " +
      "LEFT JOIN comments as c ON p.id = c.post_id " +
      "GROUP BY p.id ORDER BY p.created_at DESC;";

    const [rowsPosts] = await db.promise().query(queryTxt, queryFields);

    console.log("** end get all posts without error **");
    return res.status(200).send(rowsPosts);
  } catch (error) {
    console.log("** end get all posts with an error **", error.message);
    return res.status(error.code || 400).send({ message: error.message });
  }
};

exports.createPost = async (req, res) => {
  console.log("** start create post **");
  try {
    const { title, description = "" } = req.body;

    if (
      typeof title === "string" &&
      title.length > 0 &&
      req.file &&
      req.file.filename
    ) {
      const imageUrl = `${req.protocol}://${req.get("host")}/images/${
        req.file.filename
      }`;

      const queryFields = [req.auth.userId, title, description, imageUrl];

      const queryTxt =
        "INSERT INTO posts (owner_id, title, description, image_url) VALUES (?, ?, ?, ?);";

      await db.promise().query(queryTxt, queryFields);

      console.log("** end create post without error **");
      return res.status(200).send({ message: "Votre post a bien été crée." });
    } else {
      throw new Error("Paramètre manquant");
    }
  } catch (error) {
    console.log("** end create post with an error **", error.message);
    return res.status(400).send(error);
  }
};

exports.updatePost = async (req, res) => {
  console.log("** start update post **");
  try {
    const postId = req.params.id;
    const { title, description } = req.body;

    if (typeof title === "string" && title.length > 0 && !isNaN(postId)) {
      const queryPostsFields = [postId];
      const queryPostsTxt = "SELECT * FROM posts WHERE id = ?;";

      const [rowsPosts] = await db
        .promise()
        .query(queryPostsTxt, queryPostsFields);

      const queryUsersFields = [req.auth.userId];
      const queryUsersTxt = "SELECT * FROM users WHERE id = ?;";
      const [rowsUsers] = await db
        .promise()
        .query(queryUsersTxt, queryUsersFields);

      if (
        rowsPosts &&
        rowsUsers &&
        rowsPosts.length > 0 &&
        rowsUsers.length > 0
      ) {
        const user = rowsUsers[0];
        const post = rowsPosts[0];
        let imageUrl = post.image_url;

        if (req.auth.userId !== post.owner_id && !user.is_admin) {
          return res.status(401).send({
            message: "Vous n'êtes pas autorisé à effectuer cette action.",
          });
        }

        if (req.file && req.file.filename) {
          let newImageUrl = `${req.protocol}://${req.get("host")}/images/${
            req.file.filename
          }`;
          if (newImageUrl !== imageUrl) {
            // remove his image url before update image post

            const filename = imageUrl.split("/images/")[1];
            fs.unlinkSync(`images/${filename}`);

            imageUrl = newImageUrl;
          }
        }

        const queryFields = [title, description, imageUrl, postId];

        const queryTxt =
          "UPDATE posts SET title = ?, description = ?, image_url = ? WHERE posts.id = ?;";

        await db.promise().query(queryTxt, queryFields);

        console.log("** end update post without error **");
        return res
          .status(200)
          .send({ message: "Votre post a bien été modifié." });
      }
    } else {
      throw new Error("Paramètre manquant");
    }
  } catch (error) {
    console.log("** end update post with an error **", error.message);
    return res.status(400).send(error);
  }
};

exports.likePost = async (req, res) => {
  console.log("** start update post like **");
  try {
    const postId = req.params.id;

    if (
      !req.body ||
      typeof req.body.like !== "number" ||
      req.body.like < -1 ||
      req.body.like > 1
    ) {
      throw new Error("Paramètre mauvais.");
    }

    const queryLikesFields = [postId, req.auth.userId];
    const queryLikesTxt =
      "SELECT * FROM likes WHERE post_id = ? AND owner_id = ?;";

    const [rowsLikes] = await db
      .promise()
      .query(queryLikesTxt, queryLikesFields);

    if (rowsLikes.length === 0) {
      const queryFields = [req.auth.userId, postId, req.body.like];

      const queryTxt =
        "INSERT INTO likes (owner_id, post_id, id) VALUES (?, ?, ?);";

      await db.promise().query(queryTxt, queryFields);
    } else {
      const like = rowsLikes[0];
      let newLike = req.body.like;

      if (like.id === req.body.like) {
        newLike = 0;
      }

      const queryFields = [newLike, postId, req.auth.userId];

      const queryTxt =
        "UPDATE likes SET id = ? WHERE likes.post_id = ? AND likes.owner_id = ?;";

      await db.promise().query(queryTxt, queryFields);
    }

    console.log("** end update post like without error **");
    return res
      .status(200)
      .send({ message: "Votre action a bien été effectué ." });
  } catch (error) {
    console.log("** end update post like with an error **", error.message);
    return res.status(400).send(error);
  }
};

exports.deletePost = async (req, res) => {
  console.log("** start delete post **");
  try {
    const postId = req.params.id;

    if (postId && req.auth && req.auth.userId) {
      const queryPostsFields = [postId];
      const queryPostsTxt = "SELECT * FROM posts WHERE id = ?;";

      const [rowsPosts] = await db
        .promise()
        .query(queryPostsTxt, queryPostsFields);

      const queryUsersFields = [req.auth.userId];
      const queryUsersTxt = "SELECT * FROM users WHERE id = ?;";
      const [rowsUsers] = await db
        .promise()
        .query(queryUsersTxt, queryUsersFields);

      if (
        rowsPosts &&
        rowsUsers &&
        rowsPosts.length > 0 &&
        rowsUsers.length > 0
      ) {
        const user = rowsUsers[0];
        const post = rowsPosts[0];

        if (req.auth.userId !== post.owner_id && !user.is_admin) {
          return res.status(401).send({
            message: "Vous n'êtes pas autorisé à effectuer cette action.",
          });
        }
        // remove his image url before delete post
        const filename = post.image_url.split("/images/")[1];
        fs.unlinkSync(`images/${filename}`);

        const queryFields = [postId];

        const queryTxt = "DELETE FROM posts WHERE posts.id = ?;";

        await db.promise().query(queryTxt, queryFields);

        console.log("** end delete post without error **");
        return res
          .status(200)
          .send({ message: "Votre post a bien été supprimé." });
      }
    } else {
      throw new Error("Paramètre manquant");
    }
  } catch (error) {
    console.log("** end delete post with an error **", error.message);
    return res.status(400).send(error);
  }
};
