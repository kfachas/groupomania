import { useEffect, useState } from "react";

import axios from "axios";

import {
  Button,
  CardMedia,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Box,
} from "@mui/material";

import useIsMounted from "../../customHooks/useIsMounted";

const AddNewPostDialog = ({
  open,
  handleClose,
  handleSnackbarData,
  token,
  refreshData,
  selectedPost,
}) => {
  const isMounted = useIsMounted();
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({
    file: null,
    filePreview: null,
    title: "",
    description: "",
  });

  useEffect(() => {
    if (selectedPost) {
      setValues({
        title: selectedPost.title,
        description: selectedPost.description,
        file: null,
        filePreview: selectedPost.image_url,
      });
    }
  }, [selectedPost]);

  const handleChangeFile = (e) => {
    const target = e.target;
    if (!target || !target.files) return;
    const file = target.files[0];

    const filePreview = URL.createObjectURL(file);

    setValues((prev) => ({ ...prev, file, filePreview }));
  };

  const handleChange = (type, value) => {
    const obj = { ...values };
    obj[type] = value;
    setValues(obj);
  };

  const handleSubmit = async (action = "null") => {
    setLoading(true);
    try {
      const formData = new FormData();

      formData.append("file", values.file);
      formData.append("title", values.title);
      formData.append("description", values.description);
      let urlPost = "http://localhost:3310/posts/create";
      if (selectedPost && action) {
        urlPost = `http://localhost:3310/posts/${selectedPost.id}/${action}`;
      }

      const res = await axios.post(urlPost, formData, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      if (res && res.data && isMounted()) {
        refreshData();
        handleClose();
      }
    } catch (error) {
      handleSnackbarData({
        severity: "error",
        text: selectedPost
          ? "Une erreur est survenu lors de la modification de votre post. Veuillez réessayer svp 😥"
          : "Une erreur est survenu lors de la création de votre post. Veuillez réessayer svp 😥",
      });
    }
    if (isMounted()) setLoading(false);
  };

  const handleCloseDialog = () => {
    if (loading) return;
    else handleClose();
  };
  return (
    <Dialog open={open} onClose={handleCloseDialog}>
      <DialogTitle>Ajout d'un post</DialogTitle>
      <DialogContent>
        <DialogContentText variant="body2">
          Veuillez remplir tout les champs nécessaires
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          label="Titre *"
          value={values.title}
          onChange={(e) => handleChange("title", e.target.value)}
          fullWidth
          variant="outlined"
        />
        <TextField
          variant="outlined"
          margin="dense"
          value={values.description}
          onChange={(e) => handleChange("description", e.target.value)}
          label="Description"
          multiline
          rows={3}
          fullWidth
        />
        <Box my={2}>
          <label onChange={(e) => handleChangeFile(e)} htmlFor="upload-photo">
            <input
              style={{ display: "none" }}
              id="upload-photo"
              name="upload-photo"
              type="file"
              accept="image/*"
            />
            <Button
              sx={{ mb: 4, color: "#FFF" }}
              color="tertiary"
              variant="contained"
              component="span"
            >
              {values.filePreview
                ? "Changer l'image"
                : "Télécharger une image *"}
            </Button>
          </label>
          {values.filePreview && (
            <Box textAlign="center" width="100%">
              <CardMedia
                component="img"
                height="250"
                image={values.filePreview}
                alt={values.title}
              />
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button disabled={loading} onClick={handleClose}>
          Annuler
        </Button>
        {selectedPost && (
          <Button
            variant="outlined"
            disabled={loading}
            onClick={() => handleSubmit("delete")}
          >
            Supprimer le post
          </Button>
        )}
        <Button
          variant="contained"
          disabled={loading}
          onClick={() => !loading && handleSubmit("update")}
        >
          {!loading && (selectedPost ? "Modifier le post" : "Créer le post")}
          {loading && <CircularProgress size={22} />}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddNewPostDialog;
