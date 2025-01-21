import { Stack, Typography, Link, Paper } from "@mui/material";
import PropTypes from "prop-types";
import Plant from "./Plant";
import { useContext, useState } from "react";
import { MapContext } from "../../../../context/MapContext";
import { PalleteContext } from "../../../../context/PalleteContext";

export default function Tray({ size, address, direction, orientation }) {
  const mapContext = useContext(MapContext);
  const { selectedGroup, decrementCounter } = useContext(PalleteContext);
  const { building, room, row, tray } = address;
  console.log("Address:", address);
  const items =
    mapContext.map[building][room]?.rows[row - 1]?.trays[tray - 1]?.plants ||
    [];
  const height =
    orientation === "horizontal" ? 138 : size === "4x4" ? 140 : 287;
  const width =
    orientation === "horizontal" ? (size === "4x4" ? 140 : 300) : 112;
  const plantCount = items.length;
  const params = new URLSearchParams({ building, room, row, tray }).toString();
  const addPlant = () => {
    if (selectedGroup.counter === 0) return;
    mapContext.addplant(
      {
        pheno: selectedGroup.pheno || "unknown",
        group: selectedGroup.group || "unknown",
        startDate: selectedGroup.startDate || "unknown",
      },
      address
    );
    decrementCounter(selectedGroup.group);
  };

  return (
    <Paper
      sx={{
        width,
        height,
        margin: 1,
      }}
      onClick={addPlant}
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
          {tray}
        </Typography>
        {items?.length > 0 && (
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
      {items?.length > 0 && (
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
            items.map((plant, i) => (
              <Plant
                key={i}
                plant={plant}
                address={{ building, room, row, tray }}
              />
            ))}
          {direction === "Up" &&
            items
              .toReversed()
              .map((plant, i) => (
                <Plant
                  key={i}
                  plant={plant}
                  address={{ building, room, row, tray }}
                />
              ))}
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
