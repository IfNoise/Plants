import { useState } from "react";

import { Button } from "@mui/material";

export const ClonersPage = () => {

  const [clonesList, setClonesList] = useState([]);

  return (
    <div>
      <h1>Cloners Page</h1>
      <Button variant="outlined">
        Create
      </Button>
    </div>
  );
};