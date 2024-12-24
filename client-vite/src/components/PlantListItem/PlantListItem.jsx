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
import PlantAvatar from "../PlantAvatar";

export default function PlantListItem(props) {
  const plant = props.plant;
  return (
    <>
      {plant && (
        <ListItem
          secondaryAction={
            <Checkbox
              edge="end"
              onChange={(e) => {
                props?.onChange(e.target.checked);
              }}
              checked={props?.checked || false}
            />
          }
          disablePadding
        >
          <ListItemButton
            onClick={() => {
              props?.onClick(plant._id);
            }}
          >
            <ListItemAvatar>
              <PlantAvatar pheno={plant.pheno} />
            </ListItemAvatar>
            <ListItemText
              primary={plant.pheno}
              secondary={
                <Typography
                  sx={{ mr: "5px" }}
                  variant="body2"
                  color="text.secondary"
                >
                  {plant.strain}
                </Typography>
              }
            />
            <>
              <Typography variant="h7" color="#AAFFAA">
                {plant.state}
              </Typography>
              <Typography variant="body" color="text.secondary">
                Start date: {new Date(plant.startDate).toLocaleDateString()}
              </Typography>
            </>
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
