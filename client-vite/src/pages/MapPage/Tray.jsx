import { Stack, Typography, Link, Paper } from "@mui/material";
import PropTypes from "prop-types";
import Plant from "./Plant";
export default function Tray({ size, plants }) {
  const height = size === "4x4" ? 140 : 282;
  const width = 111;
  const plantCount = plants.length;
  const params = new URLSearchParams({...plants[0]?.currentAddress});
  return (
    <Paper
      sx={{
        width,
        height,
        margin: 1,
      }}
    >
      <Paper
        sx={{
          //border: "1px solid green",
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
      </Paper>
      <Stack
        direction="row"
        useFlexGap
        flexWrap="wrap"
        spacing={"1"}
        margin="1px"
        sx={{
          display: "flex",
          justifyContent: "space-around",
          height: "calc(100% - 25px)",
        }}
      >
        {plants?.map((plant, i) => (
          <Plant key={i} plant={plant} />
        ))}
      </Stack>
    </Paper>
  );
}
Tray.propTypes = {
  size: PropTypes.string,
  plants: PropTypes.array,
};
