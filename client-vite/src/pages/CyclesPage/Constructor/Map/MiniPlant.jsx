import { Box, Paper, Popper, Typography } from "@mui/material";
import PropTypes from "prop-types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MiniPlant({ plant }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/plant/${plant.id}`);
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
        backgroundColor: "greenyellow",
        p: "0px",
        cursor: "pointer",
        border: "1px solid #555",
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
        sx={{ fontSize: "6px", fontWeight: "bold", color: "black" }}
      >
        {plant.pheno}
      </Typography>
      <Popper open={open} anchorEl={anchorEl} onClose={() => {}}>
        <Paper
          sx={{
            width: "150px",
            height: "150px",
            border: "1px solid #555",
            p: "15px",
            m: "3px",
          }}
        >
          <Typography
            variant="caption"
            gutterBottom
            display="block"
            sx={{ fontSize: "12px", fontWeight: "bold" }}
          >
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
        </Paper>
      </Popper>
    </Box>
  );
}
MiniPlant.propTypes = {
  onClick: PropTypes.func,
  plant: PropTypes.object,
};
