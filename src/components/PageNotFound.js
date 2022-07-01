import pageNotFound from "../assets/img/pageNotFound.png";

import { useNavigate } from "react-router-dom";

import { CardMedia, Grid, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";

const PageNotFoundComponent = () => {
  const navigate = useNavigate();
  const [timer, setTimer] = useState(10);
  const ref = useRef(null);

  useEffect(() => {
    ref.current = setInterval(() => setTimer((prev) => prev - 1), 1000);
  }, []);

  useEffect(() => {
    if (timer === 0) {
      clearInterval(ref.current);
      navigate("/");
    }
  }, [timer]);

  return (
    <main>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <CardMedia
            image={pageNotFound}
            component="img"
            height="400px"
            sx={{
              objectFit: "contain",
              objectPosition: "center",
            }}
            alt={"page non trouvée"}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography align="center">Page non trouvée..</Typography>
          <Typography variant="body2" align="center">
            Vous allez être redirigée dans {timer}{" "}
            {timer > 1 ? "secondes" : "seconde"} sur l'accueil..
          </Typography>
        </Grid>
      </Grid>
    </main>
  );
};
export default PageNotFoundComponent;
