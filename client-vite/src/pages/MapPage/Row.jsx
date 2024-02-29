import { Box } from "@mui/material";
import PropTypes from "prop-types"; 
import Tray from "./Tray";
export  const Row = (props) => {
  const {trays} = props;

  return (
    <Box sx={{display:"flow",borderColor:"green",borderRadius:3,backgroundColor:"greenyellow"}}>
      {trays?.map((tray,index)=>(
        <Tray size={tray.size} key={index} plants={tray.plants??[]} />
))}
    </Box>
  );
}
Row.propTypes = {
 trays: PropTypes.array,
}