import { Stack, Typography, Link, Paper } from "@mui/material";
import PropTypes from "prop-types";
import Plant from "./Plant";

export default function Tray({ size, plants }) {
  const height = size === "4x4" ? 140 : 282;
  const width = 111;
  const plantCount = plants.length;
  if(plantCount===0) return null;
  const { building, room, row, tray } = plants[0].currentAddress;
  const params = new URLSearchParams({ building, room, row, tray }).toString();
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
        fontSize: "14px",
        fontWeight: "bold",
        borderRadius:"5px",
        ml: "5px",
        padding: "1px",
      }}
      variant="caption"
    >
      {tray}
    </Typography>
        <Link
          href={`/plants?${params}`}
          sx={{
            ml: "5px",
            fontSize: "12px",
            fontWeight: "bold",
            color: "black",
          }}
        >
          {plantCount}plants
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
