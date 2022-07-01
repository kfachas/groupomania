import { createTheme, ThemeProvider } from "@mui/material";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./AppRouter";
import ContextComponent from "./Context";

const theme = createTheme({
  palette: {
    primary: {
      main: "#FD2D01",
    },
    secondary: {
      main: "#FFD7D7",
    },
    tertiary: {
      main: "#4E5166",
    },
  },
});

const App = () => {
  return (
    <ContextComponent>
      <ThemeProvider theme={theme}>
        <BrowserRouter basename={window.location.search}>
          <AppRouter />
        </BrowserRouter>
      </ThemeProvider>
    </ContextComponent>
  );
};

export default App;
