import { Router } from "./routes.jsx";
import { RouterProvider } from "react-router-dom";
import { SnackbarContext } from "./context/SnackbarContext";
import { useState } from "react";
function App() {

  const [snack, setSnack] = useState({
    message: '',
    severity: '',
    open: false,
  });
  return (
      <SnackbarContext.Provider value={{ snack, setSnack }}>
      <RouterProvider router={Router} />
      </SnackbarContext.Provider>
  );
}

export default App;
