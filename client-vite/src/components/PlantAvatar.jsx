import { Avatar } from "@mui/material";
import PropTypes from "prop-types";

function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function stringAvatar(name) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children:
      name.split('#')[0] ,
  };
}

export default function PlantAvatar({ pheno }) {
  return (
    <Avatar {...stringAvatar(pheno)} />
  );
}
PlantAvatar.propTypes = {
  pheno: PropTypes.string,
};
