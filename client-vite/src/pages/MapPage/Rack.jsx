import { Box, Stack, Typography } from "@mui/material";
import PropTypes from "prop-types";
import Shelf from "./Shelf";
export const Rack = ({ index, shelfs }) => {
  const plants = shelfs.map((tray) => tray.plants).flat().length;

  const Banner = () => (
    <Box
      sx={{
        p: "2px",
        m: "2px",
      }}
    >
      <Typography
        sx={{
          fontSize: "14px",
          fontWeight: "bold",
          color: "red",
          borderRadius: "5px",
          border: "1px solid green",
          margin: "1px",
          padding: "1px",
        }}
        variant="caption"
      >
        {index + 1}
      </Typography>
      <Typography
        sx={{
          fontSize: "10px",
          fontWeight: "bold",
          color: "black",
        }}
        variant="caption"
      >
        {plants}plants
      </Typography>
    </Box>
  );
  return (
    <Box
      sx={{
        display: "flow",
        borderColor: "green",
        borderRadius: 1,
        border: "1px solid green",
        backgroundColor: "#f8ffff",
        m: "2px",
        p: "2px",
        width: "auto",
        height: "auto",
        alignSelf: "flex-end",
      }}
    >
      <Banner />

      <Stack direction="column" spacing={0.5}>
        {shelfs?.map((shelf, index) => (
          <Shelf key={index} plants={shelf.plants ?? []} />
        ))}
      </Stack>
    </Box>
  );
};
Rack.propTypes = {
  index: PropTypes.number,
  shelfs: PropTypes.array,
};
