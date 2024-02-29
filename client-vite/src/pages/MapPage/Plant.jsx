import { Box, Typography } from "@mui/material";
import PropTypes from "prop-types"; 
export  default function Plant(props){
  const {plant} = props;

  return (
    <Box sx={{width:"15px",height:"15px",borderColor:"green",borderRadius:3,backgroundColor:"greenyellow"}}>
      <Typography variant="body" gutterBottom>{plant.pheno}</Typography>
    </Box>
  );
}
Plant.propTypes = {
 onClick: PropTypes.func,
 plant: PropTypes.object,
}