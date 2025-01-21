import { Box, Popper, Typography } from "@mui/material";
import PropTypes from "prop-types";
import { useContext, useState } from "react";
import { stringToColor } from "../../../../utilites/color";
import { MapContext } from "../../../../context/MapContext";
import { PalleteContext } from "../../../../context/PalleteContext";

export default function Plant({ plant, address }) {
  const { removePlant } = useContext(MapContext);
  const { incrementCounter } = useContext(PalleteContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    console.log("Plant clicked:", plant);
    removePlant(plant, address);
    incrementCounter(plant.group);
  };
  // const handleEnter = (event) => {
  //   setAnchorEl(event.currentTarget);
  //   setOpen(true);
  // };

  return (
    <Box
      sx={{
        width: "34px",
        height: "34px",
        borderRadius: "4px",
        backgroundColor: stringToColor(plant?.pheno || ""),
        p: "1px",
        cursor: "pointer",
        border: "1px solid #555",
        userSelect: "none",
      }}
      // onMouseEnter={handleEnter}
      // onMouseLeave={() => {
      //   setAnchorEl(null);
      //   setOpen(false);
      // }}
      onClick={(event) => {
        event.stopPropagation();
        handleClick();
      }}
    >
      <Typography
        variant="caption"
        gutterBottom
        sx={{ fontSize: "8px", fontWeight: "bold", color: "black" }}
      >
        {plant.pheno}
      </Typography>
      <Popper open={open} anchorEl={anchorEl} onClose={() => {}}>
        {/* <Paper
      sx={{
        width: "150px",
        height: "150px",
        border: "1px solid #555",
        p: "15px",
        m: "3px",
      }}
      >
        <Typography  gutterBottom display="block" sx={{fontSize:"16px",fontWeight:"bold"}}>
          {plant.strain}
        </Typography>
        <Typography sx={{fontSize:"10px",fontWeight:"bold"}} gutterBottom display="block">
          {plant.pheno}
        </Typography>
        <Typography sx={{fontSize:"10px",fontWeight:"bold"}} gutterBottom display="block">
          {plant.state}
        </Typography>
        <Typography sx={{fontSize:"10px",fontWeight:"bold"}} gutterBottom display="block">
          {plant.potSize || ""}
        </Typography>
        </Paper> */}
      </Popper>
    </Box>
  );
}
Plant.propTypes = {
  onClick: PropTypes.func,
  plant: PropTypes.object,
  address: PropTypes.object,
};
