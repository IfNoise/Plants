import { Router } from "./routes.jsx";
import { RouterProvider } from "react-router-dom";
import { SnackbarContext } from "./context/SnackbarContext";
import { useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material";
import { PrinterContext } from "./context/PrinterContext.js";

const theme = createTheme(
{
  palette: {
    mode: 'light',
    primary: {
      main: '#9a8ef5',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#d3efdb',
      paper: '#fbfdfd',
    },
    text: {
      primary: 'rgba(80,79,62,0.87)',
    },
  },
  typography: {
    h4: {
      letterSpacing: '0.06em',
    },
    caption: {
      fontSize: '0.6rem',
      lineHeight: 1.76,
      letterSpacing: '0.18em',
    },
  },
})

function App() {
  const [printDialog, setPrintDialog] = useState({
    onChange: () => {},
    open: false,
  });
  const [snack, setSnack] = useState({
    message: '',
    severity: '',
    open: false,
  });
  
  return (
      <SnackbarContext.Provider value={{ snack, setSnack }}>
        <PrinterContext.Provider value={{ printDialog, setPrintDialog }}>
        <ThemeProvider theme={theme}> 
      <RouterProvider router={Router} />
      </ThemeProvider>
      </PrinterContext.Provider>
      </SnackbarContext.Provider>
  );
}

export default App;
