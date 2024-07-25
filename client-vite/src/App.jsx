import { Router } from "./routes.jsx";
import { RouterProvider } from "react-router-dom";
import { SnackbarContext } from "./context/SnackbarContext";
import { useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material";
import { PrinterContext } from "./context/PrinterContext.js";

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      paper: 'rgba(104,104,125,0.9)',
      default: 'rgba(31,39,45,0.86)',
    },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
          border: 0,
          borderRadius: 10,
          color: 'white',
          height: 38,
          padding: '0 20px',
        },
      },
    },
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
  },
  props: {
    MuiAppBar: {
      color: 'transparent',
    },
  },
  spacing: 8,
  typography: {
    caption: {
      fontSize: '0.6rem',
      fontWeight: 100,
      letterSpacing: '0.19em',
      lineHeight: 1.03,
    },
    button: {
      fontSize: '0.8rem',
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
