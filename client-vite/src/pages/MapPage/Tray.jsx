import { Box } from "@mui/material";
import PropTypes from "prop-types"; 
export  default function Tray(props){
  const {size, plants} = props;
  const width = size==="4x4"?100:200
  const height = size==="4x4"?100:50  
  return (
    <Box sx={{width,height,borderColor:"green",borderRadius:3,backgroundColor:"greenyellow"}}>
      {plants?.map((plant)=>(
        <Pla
     ) )}
    </Box>
  );
}
Tray.propTypes = {
 size: PropTypes.string ,
 plants: PropTypes.array,
}