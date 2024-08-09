import { Router } from "./routes.jsx";
import { RouterProvider } from "react-router-dom";
import { SnackbarContext } from "./context/SnackbarContext";
import { useState } from "react";
import { ThemeProvider} from "@mui/material";
import { PrinterContext } from "./context/PrinterContext.js";
import { theme } from "./styles/mainTheme.js";


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
