import { useContext, useEffect, useState } from "react";

import { Button, Grid, SwipeableDrawer } from "@mui/material";

import AddNewPostDialog from "./AddNewPost";
import axios from "axios";
import { AppContext } from "../../Context";
import PostItem from "./PostItem";
import CommentsComponent from "./Comments/Comments";

const HomeComponent = ({ handleSnackBarData }) => {
  const { userData } = useContext(AppContext);

  const [openPostDialog, setOpenPostDialog] = useState(false);
  const [openCommentDialog, setOpenCommentDialog] = useState(null);
  const [anchorElComment, setAnchorElComment] = useState(null);

  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [forceRefresh, setForceRefresh] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const config = {
          headers: {
            Authorization: "Bearer " + userData.token,
          },
        };

        const res = await axios.get("http://localhost:3310/posts", config);

        if (res && res.data && res.data.length > 0) {
          setPosts(res.data);
        }
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchPosts();
  }, [forceRefresh]);

  const handleCloseDialog = () => {
    setOpenPostDialog(false);
    setSelectedPost(null);
  };

  const handleOpenPostDialog = (postId) => {
    const findPost = posts.find(({ id }) => id === postId);
    if (!findPost) return;
    setSelectedPost(findPost);
    setOpenPostDialog(true);
  };

  const refreshData = () => setForceRefresh((prev) => !prev);

  const handleLikePost = async (like, postId) => {
    try {
      await axios.post(
        `http://localhost:3310/posts/${postId}/like`,
        { like },
        {
          headers: {
            Authorization: "Bearer " + userData.token,
          },
        }
      );
      refreshData();
    } catch (error) {
      handleSnackBarData({
        severity: "error",
        text: "Une erreur est survenu. Veuillez réessayer svp 😥",
      });
    }
  };

  const handleOpenCommentDrawer = (e, commentId) => {
    setAnchorElComment(e.currentTarget);
    setOpenCommentDialog(commentId);
  };

  return (
    <main>
      {openPostDialog && (
        <AddNewPostDialog
          selectedPost={selectedPost}
          refreshData={refreshData}
          handleSnackbarData={handleSnackBarData}
          open={openPostDialog}
          handleClose={handleCloseDialog}
          token={userData.token}
        />
      )}
      {openCommentDialog && (
        <CommentsComponent
          postId={openCommentDialog}
          userToken={userData.token}
          refreshData={refreshData}
          open={!!openCommentDialog}
          handleClose={() => setOpenCommentDialog(null)}
        />
      )}
      <Grid container justifyContent={"center"} spacing={3} sx={{ padding: 4 }}>
        <Grid item xs={12} md={8} sx={{ textAlign: "center" }}>
          <Button variant="contained" onClick={() => setOpenPostDialog(true)}>
            Ajouter un post
          </Button>
        </Grid>
        <Grid
          item
          xs={12}
          md={8}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          {posts.map((post) => {
            return (
              <PostItem
                key={post.id}
                post={post}
                userId={userData.id}
                isAdmin={userData.isAdmin}
                handleOpenCommentDrawer={handleOpenCommentDrawer}
                handleLikePost={handleLikePost}
                handleOpenPostDialog={handleOpenPostDialog}
              />
            );
          })}
        </Grid>
      </Grid>
    </main>
  );
};

export default HomeComponent;
