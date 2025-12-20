import { Box, Paper, Popper, Typography } from "@mui/material";
import PropTypes from "prop-types";
import { useState, memo, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";

function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = ((hash >> (i * 8))+75 )& 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}


const Plant = memo(function Plant({ plant }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  
  const backgroundColor = useMemo(() => stringToColor(plant.pheno), [plant.pheno]);
  
  const handleClick = useCallback(() => {
    navigate(`/plant/${plant.id}`);
  }, [navigate, plant.id]);
  
  const handleEnter = useCallback((event) => {
    setAnchorEl(event.currentTarget);
    setOpen(true);
  }, []);
  
  const handleLeave = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <Box
      sx={{
        width: "34px",
        height: "34px",
        borderRadius: "4px",
        backgroundColor,
        p: "1px",
        cursor: "pointer",
        border: "1px solid #555",
      }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onClick={handleClick}
    >
      <Typography
        variant="caption"
        gutterBottom
        sx={{ fontSize: "8px",
          fontWeight: "bold",
          color: "black",
        }}
      >
        {plant.pheno}
      </Typography>
      <Popper
        open={open}
        anchorEl={anchorEl}
        onClose={() => {}}
      ><Paper
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
        </Paper>
      </Popper>
    </Box>
  );
});

Plant.displayName = 'Plant';

Plant.propTypes = {
  plant: PropTypes.object.isRequired,
};

export default Plant;
