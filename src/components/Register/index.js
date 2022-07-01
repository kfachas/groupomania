import { useEffect, useState } from "react";
import axios from "axios";

import { useNavigate } from "react-router-dom";

import { makeStyles } from "@mui/styles";

import {
  Alert,
  Button,
  Grid,
  TextField,
  Typography,
  Avatar,
  Box,
} from "@mui/material";

const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const regexSpecialChar = /[^A-Za-z0-9_|\s]/g;

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(4),
    height: "100%",
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
  },
  gridContainer: {
    alignItems: "center",
    justifyContent: "center",
    "& > div": {
      textAlign: "center",
    },
  },
  input: {
    "& > label": {
      color: "#FFF",
    },
    "& input": {
      color: "#FFF",
    },
  },
  avatar: {
    marginTop: theme.spacing(2),
    textAlign: "center",
    height: "100%",
    width: "100%",
    "& > img": {
      width: 100,
      height: 100,
      borderRadius: "50%",
      objectFit: "cover",
      objectPosition: "center",
    },
  },
}));

const RegisterComponent = ({ handleSnackBarData }) => {
  const navigate = useNavigate();
  const classes = useStyles();
  const [values, setValues] = useState({
    email: "",
    password: "",
    file: null,
    firstName: "",
    lastName: "",
  });
  const [errors, setErrors] = useState({
    email: false,
    password: false,
    firstName: false,
    lastName: false,
  });

  const [errorMsg, setErrorMsg] = useState(null);

  const handleChange = (type, value) => {
    const obj = { ...values };
    obj[type] = value;
    setValues(obj);
  };

  useEffect(() => {
    if (errors.email && values.email.match(regexEmail)) {
      setErrors((prev) => ({ ...prev, email: false }));
    }
    if (
      errors.password &&
      values.password.match(regexSpecialChar) &&
      values.password.trim().length >= 8
    ) {
      setErrors((prev) => ({ ...prev, password: false }));
    }
    if (errors.firstName && values.firstName.trim().length >= 3) {
      setErrors((prev) => ({ ...prev, firstName: false }));
    }
    if (errors.lastName && values.lastName.trim().length >= 3) {
      setErrors((prev) => ({ ...prev, lastName: false }));
    }
  }, [values]);

  const handleChangeFile = (e) => {
    const target = e.target;
    if (!target || !target.files) return;
    const file = target.files[0];

    const filePreview = URL.createObjectURL(file);

    setValues((prev) => ({ ...prev, file, filePreview }));
  };

  const checkBeforeSubmit = (event) => {
    event.preventDefault();
    try {
      const { email, password, firstName, lastName } = values;
      const newErrors = { ...errors };
      if (!email.match(regexEmail) && !newErrors.email) {
        newErrors.email = true;
      }
      if (
        !newErrors.password &&
        (!password.match(regexSpecialChar) || password.trim().length < 8)
      ) {
        newErrors.password = true;
      }

      if (firstName.trim().length < 3 && !newErrors.firstName) {
        newErrors.firstName = true;
      }
      if (lastName.trim().length < 3 && !newErrors.lastName) {
        newErrors.lastName = true;
      }

      if (Object.values(newErrors).filter(Boolean).length > 0) {
        setErrors(newErrors);
        return;
      } else {
        handleSubmit(email.value, password.value);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (data) => {
    errorMsg && setErrorMsg(null);
    try {
      const formData = new FormData();

      formData.append("file", values.file);
      formData.append("firstName", values.firstName);
      formData.append("lastName", values.lastName);
      formData.append("email", values.email);
      formData.append("password", values.password);

      const res = await axios.post(
        "http://localhost:3310/auth/register",
        formData
      );

      if (res && res.data) {
        navigate("/login");
        handleSnackBarData({
          severity: "success",
          text: "Inscription réussi ! Vous pouvez dès à présent vous connecter 🙂",
        });
      }
    } catch (error) {
      setErrorMsg(error.response.data);
    }
  };

  return (
    <main className={classes.container}>
      <Grid container className={classes.gridContainer} spacing={6}>
        <Grid item xs={12}>
          <label onChange={(e) => handleChangeFile(e)} htmlFor="upload-photo">
            <input
              style={{ display: "none" }}
              id="upload-photo"
              name="upload-photo"
              type="file"
              accept="image/*"
            />
            <Button color="secondary" variant="contained" component="span">
              {values.filePreview
                ? "Changer votre photo"
                : "Télécharger votre photo"}
            </Button>
          </label>
          {values.filePreview && (
            <Box textAlign="center" width="100%">
              <Avatar
                alt="selfie"
                src={values.filePreview}
                className={classes.avatar}
              />
            </Box>
          )}
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Prénom"
            name="firstname"
            color="secondary"
            placeholder="ex: Jean"
            fullWidth
            className={classes.input}
            value={values.firstName}
            InputLabelProps={{ shrink: true }}
            error={errors.firstName}
            helperText={
              errors.firstName
                ? "Veuillez rentrer votre prénom (3 caractères minimum)."
                : ""
            }
            onChange={(e) => handleChange("firstName", e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Nom"
            name="lastname"
            color="secondary"
            placeholder="ex: Dupont"
            fullWidth
            className={classes.input}
            value={values.lastName}
            InputLabelProps={{ shrink: true }}
            error={errors.lastName}
            helperText={
              errors.lastName
                ? "Veuillez rentrer votre nom (3 caractères minimum)."
                : ""
            }
            onChange={(e) => handleChange("lastName", e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Votre email"
            type="email"
            color="secondary"
            placeholder="ex: jeandupont@gmail.com"
            fullWidth
            className={classes.input}
            value={values.email}
            InputLabelProps={{ shrink: true }}
            error={errors.email}
            helperText={
              errors.email ? "Veuillez rentrer un email correct." : ""
            }
            onChange={(e) => handleChange("email", e.target.value)}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            className={classes.input}
            fullWidth
            color="secondary"
            type="password"
            label="Votre mot de passe"
            placeholder="ex: !jeandupont93"
            error={errors.password}
            helperText={
              errors.password
                ? "Votre mot de passe doit contenir un caractère spécial et 8 caractères minimum."
                : ""
            }
            value={values.password}
            InputLabelProps={{ shrink: true }}
            onChange={(e) => handleChange("password", e.target.value)}
          />
        </Grid>
        <Grid
          item
          xs={12}
          md={12}
          sx={{ display: "flex", justifyContent: "center" }}
        >
          <Box maxWidth="500px">
            <Button
              fullWidth
              onClick={(e) => checkBeforeSubmit(e)}
              variant="contained"
              color="secondary"
              type="submit"
            >
              Inscription
            </Button>
            <Typography
              color="#fff"
              variant="body2"
              component="a"
              onClick={() => navigate("/login")}
            >
              Déjà inscrit ? Connectez-vous !
            </Typography>
          </Box>
        </Grid>
        {errorMsg && (
          <Grid item xs={12} md={8}>
            <Alert severity="error" onClose={() => setErrorMsg(null)}>
              {errorMsg}
            </Alert>
          </Grid>
        )}
      </Grid>
    </main>
  );
};

export default RegisterComponent;
