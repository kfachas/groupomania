import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";

import { makeStyles } from "@mui/styles";
import {
  Alert,
  Button,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

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
  inputTets: {
    WebkitBoxShadow: "inherit",
  },
}));

const LoginComponent = ({ refreshToken }) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: false,
    password: false,
  });
  const [showPassword, setShowPassword] = useState(false);
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
  }, [values]);

  const checkBeforeSubmit = (event) => {
    event.preventDefault();
    try {
      const { email, password } = values;
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

      if (Object.values(newErrors).filter(Boolean).length > 0) {
        setErrors(newErrors);
        return;
      } else {
        handleSubmit(email, password);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (email, password) => {
    errorMsg && setErrorMsg(null);
    try {
      const res = await axios.post("http://localhost:3310/auth/login", {
        email,
        password,
      });

      if (res && res.data && res.data.token) {
        refreshToken(res.data.token);
      }
    } catch (error) {
      setErrorMsg(error.response.data);
    }
  };

  return (
    <main className={classes.container}>
      <Grid container className={classes.gridContainer} spacing={6}>
        <Grid item xs={12} md={7}>
          <TextField
            label="Votre email"
            type="email"
            color="secondary"
            fullWidth
            className={classes.input}
            value={values.email}
            placeholder="ex: jeandupont@gmail.com"
            InputLabelProps={{ shrink: true }}
            InputProps={{ classes: { input: classes.inputTets } }}
            error={errors.email}
            helperText={
              errors.email ? "Veuillez rentrer un email correct." : ""
            }
            onChange={(e) => handleChange("email", e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={7}>
          <TextField
            className={classes.input}
            fullWidth
            color="secondary"
            type={showPassword ? "text" : "password"}
            label="Votre mot de passe"
            placeholder="Entrez votre mot de passe ici"
            error={errors.password}
            helperText={
              errors.password
                ? "Votre mot de passe doit contenir un caractère spécial et 8 caractères minimum."
                : ""
            }
            InputLabelProps={{ shrink: true }}
            InputProps={{
              endAdornment: (
                <IconButton
                  onClick={() => setShowPassword((prev) => !prev)}
                  color="secondary"
                >
                  {!showPassword && <Visibility />}
                  {showPassword && <VisibilityOff />}
                </IconButton>
              ),
            }}
            value={values.password}
            onChange={(e) => handleChange("password", e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Button
            fullWidth
            onClick={(e) => checkBeforeSubmit(e)}
            variant="contained"
            color="secondary"
            type="submit"
          >
            Connexion
          </Button>
          <Typography
            color="#fff"
            variant="body2"
            component="a"
            onClick={() => navigate("/register")}
          >
            Pas encore inscrit ? Cliquez-ici !
          </Typography>
        </Grid>
        {errorMsg && (
          <Grid item xs={12}>
            <Alert severity="error" onClose={() => setErrorMsg(null)}>
              {errorMsg}
            </Alert>
          </Grid>
        )}
      </Grid>
    </main>
  );
};

export default LoginComponent;
