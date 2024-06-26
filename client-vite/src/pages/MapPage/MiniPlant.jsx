import { Box, Popper, Typography } from "@mui/material";
import PropTypes from "prop-types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MiniPlant({ plant }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/plant/${plant._id}`);
  };
  const handleEnter = (event) => {
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };

  return (
    <Box
      sx={{
        width: "20px",
        height: "20px",
        border: "1px solid green",
        borderRadius: "2px",
        backgroundColor: "greenyellow",
        p: "0px",
        cursor: "pointer",
      }}
      onMouseEnter={handleEnter}
      onMouseLeave={() => {
        setAnchorEl(null);
        setOpen(false);
      }}
      onClick={handleClick}
    >
      <Typography
        variant="caption"
        gutterBottom
        sx={{ fontSize: "6px",
          fontWeight: "bold",
          color: "black",
        }}
      >
        {plant.pheno}
      </Typography>
      <Popper
        sx={{
          width: "150px",
          height: "150px",
          border: "1px solid green",
          borderRadius: "5px",
          backgroundColor: "#f0f0f0",
          p: "3px",
          boxShadow: 3,
        }}
        open={open}
        anchorEl={anchorEl}
        anc
        onClose={() => {}}
      >
        <Typography variant="caption" gutterBottom display="block" sx={{fontSize:"12px",fontWeight:"bold"}}>
          {plant.strain}
        </Typography>
        <Typography variant="caption" gutterBottom display="block">
          {plant.pheno}
        </Typography>
        <Typography variant="caption" gutterBottom display="block">
          {plant.state}
        </Typography>
        <Typography variant="caption" gutterBottom display="block">
          {plant.potSize || ""}
        </Typography>
      </Popper>
    </Box>
  );
}
MiniPlant.propTypes = {
  onClick: PropTypes.func,
  plant: PropTypes.object,
};
