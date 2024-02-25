import { Checkbox, ListItem, ListItemButton, ListItemText } from "@mui/material";
import PropTypes from 'prop-types';

export default function PlantListItem(props) {
  const [checked, setChecked] = React.useState([1]);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  return (
  <ListItem
  secondaryAction={
    <Checkbox
      edge="end"
      onChange={props.onChange}
      checked={props.checked}
      inputProps={{ 'aria-labelledby': labelId }}
    />
  }
  disablePadding
>
  <ListItemButton>
    <ListItemText id={labelId} primary={`Line item ${value + 1}`} />
  </ListItemButton>
</ListItem>)
}
PlantListItem.propTypes = {
  plant: PropTypes.object,
  onChange: PropTypes.func,
  checked: PropTypes.bool,
};