import { Box, Paper, Stack, Typography } from "@mui/material";
import PropTypes from "prop-types";
import MiniPlant from "./MiniPlant";
export default function Shelf({plants}) {
  const height =100;
  const width = 200
  const plantCount = plants.length;
  return (
    <Paper
      sx={{
        width,
        height,
        margin: 1,
      }}
    >
      <Paper
        sx={{
          p:"1px",
          m:"3px",
          height:"25px",
          contentAlign:"center",

        }}
      >
        <Typography 
        sx={{
          fontSize: "9px",
          fontWeight: "bold",
          color: "black",
        }}
        variant="caption"
        >Total:{plantCount}plants</Typography>
      </Paper>
      <Stack direction="row" useFlexGap flexWrap="wrap" spacing={0.2} margin="1px"
      sx={{
        overflowY:"auto",
        height:"100px",
      }}
      >
      {plants?.map((plant,i) => (
        <MiniPlant key={i} plant={plant} />
      ))}
      </Stack>
    </Paper>
  );
}
Shelf.propTypes = {
  plants: PropTypes.array,
};
