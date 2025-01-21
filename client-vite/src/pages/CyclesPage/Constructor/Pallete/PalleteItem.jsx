import { Box, Typography } from "@mui/material";
import { stringToColor } from "../../../../utilites/color";
import PropTypes from "prop-types";

export default function PalleteItem({
  pheno,
  group,
  age,
  counter = 0,
  selected = false,
  onClick = () => {},
}) {
  return (
    <Box
      sx={{
        display: "flex",
        width: "100px",
        height: "100px",
        alignItems: "center",
        p: 1,
        m: 2,
        border: selected ? "2px solid #fff" : "1px solid #555",
        borderRadius: "4px",
        backgroundColor: stringToColor(pheno || ""),
        cursor: "pointer",
        userSelect: "none",
      }}
      onClick={onClick}
    >
      <Box>
        <Typography variant="button" fontSize={"12px"} fontWeight={"bold"}>
          {pheno}
        </Typography>
        <Typography
          variant="caption"
          component="p"
          sx={{
            backgroundColor: stringToColor(group || ""),
            borderRadius: "4px",
            padding: "0",
          }}
        >
          group
        </Typography>
        <Typography
          variant="caption"
          fontFamily={"monospace"}
          fontWeight={"bold"}
          fontSize={"10px"}
          color={stringToColor(age || "")}
        >
          {age} days old
        </Typography>
      </Box>
      <Box>
        <Typography
          variant="body1"
          fontFamily={"monospace"}
          fontWeight={"bold"}
          component="p"
        >
          {counter} pcs.
        </Typography>
      </Box>
    </Box>
  );
}
PalleteItem.propTypes = {
  pheno: PropTypes.string.isRequired,
  group: PropTypes.string.isRequired,
  age: PropTypes.number.isRequired,
  counter: PropTypes.number,
  selected: PropTypes.bool,
  onClick: PropTypes.func,
};
