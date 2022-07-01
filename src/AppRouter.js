import { Fragment, useContext, useState } from "react";

import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";

import moment from "moment-timezone";
import jwtDecode from "jwt-decode";
import Cookies from "js-cookie";

import { Alert, Snackbar } from "@mui/material";

import { AppContext } from "./Context";

import AppBarComponent from "./components/AppBar";
import HomeComponent from "./components/Home";
import RegisterComponent from "./components/Register";
import LoginComponent from "./components/Login";
import ProfilComponent from "./components/Profil";
import PageNotFound from "./components/PageNotFound";

const ProtectedRoute = () => {
  const location = useLocation();

  if (!Cookies.get("token")) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  } else if (Cookies.get("token")) {
    return <Outlet />;
  } else return null;
};

const UnprotectedRoute = () => {
  const location = useLocation();

  if (Cookies.get("token")) {
    return <Navigate to="/" replace state={{ from: location }} />;
  } else return <Outlet />;
};

function AppRouter() {
  const { setUserData } = useContext(AppContext);
  const [snackbarData, setSnackbarData] = useState(null);

  const refreshToken = (token) => {
    if (token) {
      const tokenDecoded = jwtDecode(token, {});
      if (moment().unix() <= tokenDecoded.exp) {
        Cookies.set("token", token, {
          expires: moment.unix(tokenDecoded.exp).toDate(),
        });

        setUserData({
          token,
          ...tokenDecoded,
        });
      }
    } else {
      Cookies.get("token") && Cookies.remove("token");
      setUserData(null);
    }
  };

  const handleSnackBarData = ({ severity, text }) => {
    setSnackbarData({ severity, text, open: true });
  };

  return (
    <Fragment>
      <AppBarComponent refreshToken={refreshToken} />
      {snackbarData && snackbarData.open && (
        <Snackbar
          open={snackbarData.open}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          autoHideDuration={6000}
          onClose={() => setSnackbarData(null)}
          message={snackbarData.text}
        >
          <Alert severity={snackbarData.severity}>{snackbarData.text}</Alert>
        </Snackbar>
      )}
      <Routes>
        <Route element={<UnprotectedRoute />}>
          <Route
            path="/register"
            element={
              <RegisterComponent
                refreshToken={refreshToken}
                handleSnackBarData={handleSnackBarData}
              />
            }
          />
          <Route
            path="/login"
            element={<LoginComponent refreshToken={refreshToken} />}
          />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route
            path="/"
            element={<HomeComponent handleSnackBarData={handleSnackBarData} />}
          />
          <Route
            path="/profil"
            element={
              <ProfilComponent handleSnackBarData={handleSnackBarData} />
            }
          />
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Fragment>
  );
}

export default AppRouter;
