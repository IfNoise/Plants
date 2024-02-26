import {
  Avatar,
  Checkbox,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
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
      name.split(" ").length > 1
        ? `${name.split(" ").reduce((a, b) => a + b[0],"").toUpperCase()}`
        : `${name.split(" ")[0][0]}${name.split(" ")[0][1]}`,
  };
}
export default function PlantListItem(props) {
  const plant = props.plant;
  return (
    <>
      {plant && (
        <ListItem
          secondaryAction={
            <Checkbox
              edge="end"
              onChange={()=>{ props?.onChange(plant)}}
              checked={props?.checked || false}
            />
          }
          disablePadding
        >
          <ListItemButton onClick={()=>{props?.onClick(plant._id)}}>
            <ListItemAvatar>
              <Avatar {...stringAvatar(plant.strain)} />
            </ListItemAvatar>
            <ListItemText
              primary={plant.pheno}
              secondary={
                <>
                  <Typography mr='5px' component='span' variant="body2" color="text.secondary">
                    {plant.strain}
                  </Typography>
                  <Typography component="span" variant="h7" color="green">
                   {plant.state}
                  </Typography>
                  <Typography component='div' variant="caption" color="text.secondary">
                   Start date: {new Date(plant.startDate).toLocaleDateString()}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                   Id: {plant._id}
                  </Typography>
                </>
              }
            />
          </ListItemButton>
        </ListItem>
      )}
    </>
  );
}
PlantListItem.propTypes = {
  plant: PropTypes.object,
  onChange: PropTypes.func,
  onClick: PropTypes.func,
  checked: PropTypes.bool,
};
