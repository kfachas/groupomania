import "./index.css";

import React, { StrictMode } from "react";
import ReactDOM from "react-dom";

import moment from "moment-timezone";

import App from "./App";

import "moment/locale/fr";

const locale = "fr-FR"; // force FR for now
moment.locale(locale);
moment.tz.setDefault("Europe/Paris");

const rootElement = document.getElementById("root");
ReactDOM.render(
  <StrictMode>
    <App />
  </StrictMode>,
  rootElement
);
