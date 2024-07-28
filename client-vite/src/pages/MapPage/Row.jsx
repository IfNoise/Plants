import { Box, Link, Stack, Typography } from "@mui/material";
import PropTypes from "prop-types";
import Tray from "./Tray";
export const Row = ({ index, trays ,direction}) => {
  const plants = trays.map((tray) => tray.plants).flat().length;
  if(plants===0) return null;
  const {building, room,row} = trays[0].plants[0].currentAddress;
  const params = new URLSearchParams({building, room,row}).toString();
  const Banner=()=>(      <Box
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
        borderRadius:"5px",
        margin: "1px",
        padding: "1px",
      }}
      variant="caption"
    >
      {index + 1}
    </Typography>
    <Link
          href={`/plants?${params}`}
          sx={{
            fontSize: "14px",
            fontWeight: "bold",
            color: "black",
          }}
        >
      {plants}plants
        </Link>
  </Box>)
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
        width: "117px",
        height: "auto",
        alignSelf: "flex-start",
      }}
    >
    {direction==="Down"&&<Banner/>}

      <Stack direction="column" spacing={0.5}>
        {trays?.map((tray, index) => (
          <Tray size={tray.size} key={index} plants={tray.plants} />
        ))}
      </Stack>
      {direction==="Up"&&<Banner/>}
    </Box>
  );
};
Row.propTypes = {
  index: PropTypes.number,
  trays: PropTypes.array,
  direction: PropTypes.string,
};
