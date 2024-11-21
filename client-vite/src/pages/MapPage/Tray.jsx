import { Stack, Typography, Link, Paper } from "@mui/material";
import PropTypes from "prop-types";
import Plant from "./Plant";

export default function Tray({
  index,
  size,
  plants,
  address,
  direction,
  orientation,
}) {
  const height =
    orientation === "horizontal" ? 138 : size === "4x4" ? 140 : 287;
  const width =
    orientation === "horizontal" ? (size === "4x4" ? 140 : 300) : 112;
  const tray = index + 1;
  const plantCount = plants.length;
  const { building, room, row } = address;
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
          p: "2px",
          m: 0,
          height: "25px",
          justifyContent: "flex-start",
        }}
      >
        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: "bold",
            borderRadius: "3px",
            border: "1px solid #444",
            ml: "5px",
            padding: "1px",
          }}
          variant="caption"
        >
          {index + 1}
        </Typography>
        {plants?.length > 0 && (
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
        )}
      </Paper>
      {plants?.length > 0 && (
        <Stack
          direction={orientation === "horizontal" ? "column" : "row"}
          useFlexGap
          flexWrap="wrap"
          spacing={0.1}
          sx={{
            p: "3px",
            display: "flex",
            justifyContent: "space-around",
            height: "calc(100% - 25px)",
          }}
        >
          {direction === "Down" &&
            plants.map((plant, i) => <Plant key={i} plant={plant} />)}
          {direction === "Up" &&
            plants
              .toReversed()
              .map((plant, i) => <Plant key={i} plant={plant} />)}
        </Stack>
      )}
    </Paper>
  );
}
Tray.propTypes = {
  index: PropTypes.number,
  size: PropTypes.string,
  plants: PropTypes.array,
  address: PropTypes.object,
  direction: PropTypes.string,
  orientation: PropTypes.string,
};
