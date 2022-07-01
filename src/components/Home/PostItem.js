import * as React from "react";

import moment from "moment-timezone";

import imageNotFound from "../../assets/img/images.png";

import {
  Card,
  CardHeader,
  CardMedia,
  CardActions,
  Avatar,
  IconButton,
  Typography,
  Box,
} from "@mui/material";

import {
  Edit,
  ThumbUpAltOutlined,
  ThumbDownAltOutlined,
} from "@mui/icons-material";

const PostItem = ({
  post,
  userId,
  handleOpenPostDialog,
  handleLikePost,
  isAdmin = false,
  handleOpenCommentDrawer,
}) => {
  const {
    created_at,
    title,
    description,
    first_name,
    last_name,
    owner_id,
    image_url,
    owner_image_url,
    like_id,
    post_likes = 0,
    post_dislikes = 0,
    nb_comments = 0,
  } = post;

  const isOwner = userId === owner_id;

  return (
    <Card sx={{ my: 4, maxWidth: 500, width: "100%" }}>
      <CardHeader
        avatar={
          <Avatar src={owner_image_url || ""} aria-label="recipe">
            {first_name.charAt(0)}
          </Avatar>
        }
        action={
          isOwner || isAdmin ? (
            <IconButton
              color="primary"
              onClick={() => handleOpenPostDialog(post.id)}
            >
              <Edit />
            </IconButton>
          ) : null
        }
        title={isOwner ? "Vous" : first_name + " " + last_name}
        subheader={`${title} - ${moment(created_at).format("L")}`}
      />

      {description && (
        <Typography
          sx={{ pl: 3, pb: 1 }}
          variant="body2"
          color="text.secondary"
        >
          {description}
        </Typography>
      )}
      <CardMedia
        component="img"
        height="194"
        sx={{ objectFit: "cover", objectPosition: "center" }}
        image={image_url || imageNotFound}
        alt={description || title}
      />
      <CardActions disableSpacing sx={{ justifyContent: "space-between" }}>
        <Typography
          align="right"
          component="a"
          sx={{ textDecoration: "underline", cursor: "pointer" }}
          onClick={(e) => handleOpenCommentDrawer(e, post.id)}
        >
          Voir les commentaires ({nb_comments})
        </Typography>
        <Box display="flex" alignItems="center">
          {post_dislikes}
          <IconButton
            onClick={() => handleLikePost(-1, post.id)}
            aria-label="dislike post"
            sx={{ color: like_id === -1 ? "red" : "inherit" }}
          >
            <ThumbDownAltOutlined />
          </IconButton>
          {post_likes}
          <IconButton
            onClick={() => handleLikePost(1, post.id)}
            aria-label="like post"
            sx={{ color: like_id === 1 ? "green" : "inherit" }}
          >
            <ThumbUpAltOutlined />
          </IconButton>
        </Box>
      </CardActions>
    </Card>
  );
};
export default PostItem;
