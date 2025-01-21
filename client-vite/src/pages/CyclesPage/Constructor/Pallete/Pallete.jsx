import { useContext, useState } from "react";
import { Box, Stack, Typography } from "@mui/material";
import PalleteItem from "./PalleteItem";
import { PalleteContext } from "../../../../context/PalleteContext";

export default function Pallete() {
  const { setSelectedGroup, items, isLoading, isError, error } =
    useContext(PalleteContext);
  const [selection, setSelection] = useState([]);

  const handleSelect = (i) => {
    setSelection((prev) => {
      const newSelection = Array(items.length).fill(false);
      newSelection[i] = !prev[i];
      return newSelection;
    });
    setSelectedGroup(items[i]);
  };

  return (
    <>
      <Box
        sx={{
          p: 2,
          m: 2,
          width: "100%",
          border: "1px solid #555",
          borderRadius: "4px",
        }}
      >
        {isError && (
          <Typography variant="h6">Error: {error.message}</Typography>
        )}
        {isLoading && <Typography variant="h6">Loading...</Typography>}
        <Stack direction="row" useFlexGap flexWrap="wrap">
          {items?.length > 0 &&
            items.map((item, i) => (
              <PalleteItem
                key={i}
                {...item}
                selected={selection[i]}
                onClick={() => handleSelect(i)}
              />
            ))}
        </Stack>
      </Box>
    </>
  );
}
