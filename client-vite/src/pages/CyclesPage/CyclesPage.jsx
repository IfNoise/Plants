import { Box, Typography } from "@mui/material";
import Map from "./Constructor/Map/Map";
import Pallete from "./Constructor/Pallete/Pallete";
import { stringToColor } from "../../utilites/color";
import { useContext } from "react";
import { MapProvider } from "../../context/MapContext";
import { PalleteContext, PalleteProvider } from "../../context/PalleteContext";

const SelectedGroup = () => {
  const { selectedGroup: group } = useContext(PalleteContext);
  const { pheno, age, counter } = group || {};
  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 2,
          m: 2,
          border: "1px solid #555",
          borderRadius: "4px",
          backgroundColor: stringToColor(pheno || ""),
        }}
      >
        <Typography variant="button" fontSize={"12px"} fontWeight={"bold"}>
          {pheno}
        </Typography>
        <Typography
          variant="caption"
          fontFamily={"monospace"}
          fontWeight={"bold"}
          fontSize={"10px"}
          color={stringToColor(age || "")}
        >
          {age} days old
        </Typography>
        <Typography
          variant="caption"
          fontFamily={"monospace"}
          fontWeight={"bold"}
          fontSize={"10px"}
          color={stringToColor(counter || "")}
        >
          {counter} plants
        </Typography>
      </Box>
    </>
  );
};

export default function CyclesPage() {
  return (
    <>
      <Typography variant="h3">Cycles</Typography>
      <MapProvider>
        <PalleteProvider>
          <Map />
          <SelectedGroup />
          <Pallete />
        </PalleteProvider>
      </MapProvider>
    </>
  );
}
