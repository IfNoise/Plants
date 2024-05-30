import { Box, Stack, Typography } from "@mui/material";
import PropTypes from "prop-types";
import Tray from "./Tray";
export const Row = (props) => {
  const { trays } = props;
  const plants = trays.map((tray) => tray.plants).flat().length;
  return (
    <Box
      sx={{
        display: "flow",
        borderColor: "green",
        borderRadius: 1,
        border: "1px solid green",
        backgroundColor: "#f0f0f0",
        m: "2px",
        p: "2px",
        height: "auto",
        alignSelf: "flex-start"
      }}
    >
      <Box
        sx={{
          borderColor: "green",
          borderRadius: 1,
          border: "1px solid green",
          p:"2px",
          m:"2px",
        }}
      >
        <Typography 
        sx={{
          fontSize: "10px",
          fontWeight: "bold",
          color: "black",
        }}
        variant="caption">Total:{plants}plants</Typography>
      </Box>
      <Stack direction="column" spacing={0.5}>
        {trays?.map((tray, index) => (
          <Tray size={tray.size} key={index} plants={tray.plants ?? []} />
        ))}
      </Stack>
    </Box>
  );
};
Row.propTypes = {
  trays: PropTypes.array,
};
