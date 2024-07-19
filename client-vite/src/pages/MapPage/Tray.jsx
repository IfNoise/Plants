import { Box, Stack, Typography, Link } from "@mui/material";
import PropTypes from "prop-types";
import Plant from "./Plant";
export default function Tray({ size, plants }) {
  const height = size === "4x4" ? 140 : 282;
  const width = 111;
  const plantCount = plants.length;
  const params = new URLSearchParams({...plants[0]?.currentAddress});
  return (
    <Box
      sx={{
        width,
        height,
        borderColor: "green",
        borderRadius: 1,
        backgroundColor: "greenyellow",
        border: "1px solid green",

        margin: 1,
      }}
    >
      <Box
        sx={{
          borderColor: "green",
          borderRadius: "5px",
          //border: "1px solid green",
          backgroundColor: "#f0f0f0",
          p: "1px",
          m: "3px",
          height: "25px",
          justifyContent: "flex-start",
        }}
      >
        <Typography
          sx={{
            fontSize: "9px",
            fontWeight: "bold",
            color: "black",
          }}
          variant="caption"
        >
          {plantCount}plants
        </Typography>
        <Link
          href={`/plants?${params}`}
          sx={{
            fontSize: "9px",
            fontWeight: "bold",
            color: "black",
          }}
        >
          {" "}
          All
        </Link>
      </Box>
      <Stack
        direction="row"
        useFlexGap
        flexWrap="wrap"
        spacing={"5"}
        margin="1px"
        sx={{
          display: "flex",
          justifyContent: "space-around",
          height: "100%",
        }}
      >
        {plants?.map((plant, i) => (
          <Plant key={i} plant={plant} />
        ))}
      </Stack>
    </Box>
  );
}
Tray.propTypes = {
  size: PropTypes.string,
  plants: PropTypes.array,
};
