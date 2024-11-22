import Timeline from "@mui/lab/Timeline";
import TimelineAction from "./TimelineAction";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Checkbox,
  ListItemText,
  Box,
} from "@mui/material";
import PropTypes from "prop-types";
import { useState } from "react";

export default function PlantTimeline({ actions }) {
  const initialFilter = Array.from(new Set(actions?.map((a) => a.type)));
  console.log(initialFilter);
  const [filter, setFilter] = useState(initialFilter);
  console.log(filter);
  const filteredActions = actions?.filter((a) => filter.includes(a.type));
  return (
    <Box>
      <Box sx={{ display: "block", position: "relative", right: 0 }}>
        <FormControl sx={{ m: 1, width: 300 }}>
          <InputLabel id="action-filter-label">Filter Actions</InputLabel>
          <Select
            labelId="action-filter-label"
            multiple
            value={filter}
            label="Filter Actions"
            onChange={(e) => setFilter(e.target.value)}
            renderValue={(selected) => selected.join(", ")}
          >
            {initialFilter.map((type, i) => (
              <MenuItem key={i} value={type}>
                <Checkbox checked={filter.includes(type)} />
                <ListItemText primary={type} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Timeline>
        {actions &&
          filteredActions.map((action, i) => (
            <TimelineAction key={i} action={action} />
          ))}
      </Timeline>
    </Box>
  );
}
PlantTimeline.propTypes = {
  actions: PropTypes.array,
};
