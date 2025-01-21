import { Box, Link, Stack, Typography } from "@mui/material";
import PropTypes from "prop-types";
import Tray from "./Tray";
import { MapContext } from "../../../../context/MapContext";
import { useContext } from "react";
export const Row = ({ direction, address, orientation }) => {
  const { map } = useContext(MapContext);
  const { building, room, row } = address;
  const plants = map[building][room].rows[row - 1].trays
    .map((tray) => tray.plants)
    .flat().length;
  const trays = map[building][room].rows[row - 1].trays;
  const params = new URLSearchParams({ building, room, row }).toString();
  const direct = () => {
    if (orientation === "horizontal") {
      return direction === "Down" ? "row" : "row-reverse";
    }
    if (orientation === "vertical") {
      return direction === "Down" ? "column" : "column-reverse";
    }
  };
  const isHorizontal = orientation === "horizontal";
  const isVertical = orientation === "vertical";
  const Banner = (orientation) => (
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
          {isVertical && <Banner orientation={orientation} />}
          <Stack direction={direct()} spacing={0.5}>
            {isHorizontal && <Banner orientation={orientation} />}
            {trays?.length > 0 &&
              trays?.map((tray, index) => (
                <Tray
                  size={tray.size}
                  key={index}
                  index={index}
                  plants={tray.plants}
                  address={{ ...address, tray: index + 1 }}
                  direction={direction}
                  orientation={orientation}
                />
              ))}
          </Stack>{" "}
        </>
      )}
      {direction === "Up" && (
        <>
          <Stack direction={direct()} spacing={0.5}>
            {trays?.length > 0 &&
              trays
                .toReversed()
                .map((tray, index) => (
                  <Tray
                    size={tray.size}
                    key={index}
                    index={index}
                    plants={tray.plants}
                    address={{ ...address, tray: index + 1 }}
                    direction={direction}
                    orientation={orientation}
                  />
                ))}
            {isHorizontal && <Banner orientation={orientation} />}
          </Stack>
          {isVertical && <Banner orientation={orientation} />}{" "}
        </>
      )}
    </Box>
  );
};
Row.propTypes = {
  index: PropTypes.number,
  trays: PropTypes.array,
  direction: PropTypes.string,
  address: PropTypes.object,
  orientation: PropTypes.string,
};
