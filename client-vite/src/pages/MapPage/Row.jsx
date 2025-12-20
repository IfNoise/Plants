import { Box, Link, Stack, Typography } from "@mui/material";
import PropTypes from "prop-types";
import { useMemo, memo } from "react";
import Tray from "./Tray";

export const Row = memo(({ index, trays, direction, address, orientation }) => {
  const plants = useMemo(
    () => trays.reduce((sum, tray) => sum + tray.plants.length, 0),
    [trays]
  );
  
  const { building, room } = address;
  const row = index + 1;
  const params = new URLSearchParams({ building, room, row }).toString();
  
  const flexDirection = useMemo(() => {
    if (orientation === "horizontal") {
      return direction === "Down" ? "row" : "row-reverse";
    }
    return direction === "Down" ? "column" : "column-reverse";
  }, [orientation, direction]);
  
  const isHorizontal = orientation === "horizontal";
  const isVertical = orientation === "vertical";
  
  const reversedTrays = useMemo(
    () => direction === "Up" ? [...trays].reverse() : trays,
    [trays, direction]
  );
  
  const Banner = useMemo(
    () => (
      <Box
        sx={{
          borderRadius: "4px",
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
            margin: "1px",
            padding: "1px",
          }}
          variant="caption"
          display={isVertical ? "inline" : "block"}
        >
          {row}
        </Typography>
        <Link
          href={`/plants?${params}`}
          sx={{
            fontSize: "14px",
            fontWeight: "bold",
            color: "black",
          }}
        >
          {plants}
          {"\n"} plants
        </Link>
      </Box>
    ),
    [row, params, plants, isVertical]
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
        width: isHorizontal ? "auto" : "120px",
        height: isHorizontal ? "145px" : "auto",
        alignSelf: "baseline",
      }}
    >
      {direction === "Down" && (
        <>
          {isVertical && Banner}
          <Stack direction={flexDirection} spacing={0.5}>
            {isHorizontal && Banner}
            {trays?.length > 0 &&
              trays.map((tray, idx) => (
                <Tray
                  size={tray.size}
                  key={idx}
                  index={idx}
                  plants={tray.plants}
                  address={{ ...address, row, tray: idx + 1 }}
                  direction={direction}
                  orientation={orientation}
                />
              ))}
          </Stack>
        </>
      )}
      {direction === "Up" && (
        <>
          <Stack direction={flexDirection} spacing={0.5}>
            {reversedTrays?.length > 0 &&
              reversedTrays.map((tray, idx) => (
                <Tray
                  size={tray.size}
                  key={idx}
                  index={idx}
                  plants={tray.plants}
                  address={{ ...address, row }}
                  direction={direction}
                  orientation={orientation}
                />
              ))}
            {isHorizontal && Banner}
          </Stack>
          {isVertical && Banner}
        </>
      )}
    </Box>
  );
});

Row.displayName = 'Row';

Row.propTypes = {
  index: PropTypes.number,
  trays: PropTypes.array,
  direction: PropTypes.string,
  address: PropTypes.object,
  orientation: PropTypes.string,
};
