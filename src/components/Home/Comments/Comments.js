import { useEffect, useState } from "react";

import axios from "axios";

import {
  Grid,
  IconButton,
  List,
  ListItem,
  SwipeableDrawer,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { SendRounded } from "@mui/icons-material";

import CommentItem from "./CommentItem";
import { useTheme } from "@emotion/react";

const useStyles = makeStyles((theme) => ({
  paperDesktop: {
    width: 500,
    backgroundColor: theme.palette.tertiary.main,
    display: "flex",
    flexDirection: "column-reverse",
    overflow: "hidden",
  },
  paperMobile: {
    maxWidth: "100vw",
    backgroundColor: theme.palette.tertiary.main,
    display: "flex",
    flexDirection: "column-reverse",
    minHeight: 300,
    overflow: "hidden",
  },
  container: {
    overflow: "scroll",
    maxHeight: "70vh",
    height: "100%",
  },
  input: {
    "& input": {
      color: "#FFF",
    },
  },
}));

const CommentsComponent = ({
  open,
  handleClose,
  postId,
  userToken,
  refreshData,
}) => {
  const isDesktop = useMediaQuery(useTheme().breakpoints.up("md"));

  const classes = useStyles();
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [forceRefresh, setForceRefresh] = useState(false);

  useEffect(() => {
    const fetchComments = async (id, token) => {
      try {
        const res = await axios.get("http://localhost:3310/comments/" + id, {
          headers: {
            Authorization: "Bearer " + token,
          },
        });
        if (res && res.data && res.data.length > 0) {
          setComments(res.data);
        } else {
          setComments([]);
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (postId && userToken) {
      fetchComments(postId, userToken);
    }
  }, [postId, userToken, forceRefresh]);

  const refreshComments = (refreshComment = false) => {
    refreshComment && setComment("");

    refreshData(); // refresh posts

    setForceRefresh((prev) => !prev); // refresh comments
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:3310/comments/create",
        { text: comment, postId },
        {
          headers: {
            Authorization: "Bearer " + userToken,
          },
        }
      );

      refreshComments(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteComment = async (commentId = null) => {
    try {
      if (typeof commentId !== "number") return;

      await axios.post(
        "http://localhost:3310/comments/" + commentId + "/delete",
        null,
        {
          headers: {
            Authorization: "Bearer " + userToken,
          },
        }
      );

      refreshComments(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SwipeableDrawer
      anchor={isDesktop ? "left" : "bottom"}
      open={open}
      onOpen={() => null}
      onClose={handleClose}
      classes={{
        paper: isDesktop ? classes.paperDesktop : classes.paperMobile,
      }}
    >
      <Grid container spacing={3} sx={{ p: 1 }}>
        <Grid item xs={12}>
          <List className={classes.container}>
            {comments.length === 0 && (
              <ListItem>
                <Typography variant="body2" color="secondary">
                  Il n'y a pas encore de commentaire.
                </Typography>
              </ListItem>
            )}
            {comments.map((elem, index) => (
              <CommentItem
                key={index}
                comment={elem}
                handleDeleteComment={handleDeleteComment}
              />
            ))}
          </List>
        </Grid>
        <Grid item xs={12}>
          <TextField
            className={classes.input}
            color="secondary"
            label="Ajouter un commentaire"
            value={comment || ""}
            variant="standard"
            onChange={(e) => setComment(e.target.value)}
            InputProps={{
              endAdornment: (
                <IconButton
                  disabled={!comment.trim().length}
                  color="secondary"
                  onClick={(e) => handleSubmitComment(e)}
                >
                  <SendRounded />
                </IconButton>
              ),
            }}
            fullWidth
          />
        </Grid>
      </Grid>
    </SwipeableDrawer>
  );
};

export default CommentsComponent;
