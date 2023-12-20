import { useState, useContext, useEffect } from "react";
import {
  Button,
  FormControl,
  Stack,
  Fab,
  Popover,
  Typography,
  TextField,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import PropTypes from "prop-types";
import AddIcon from "@mui/icons-material/Add";

import { SnackbarContext } from "../../context/SnackbarContext";

import { useNewPlantMutation } from "../../store/plantsApi";

const fabStyle = {
  position: "fixed",
  bottom: 16,
  right: 16,
};

export const NewPlantButton = ({strain}) => {
  //const theme = useTheme();
  const { setSnack } = useContext(SnackbarContext);
  const [newPlant, { isSuccess, isError }] = useNewPlantMutation()
  const [open, setOpen] = useState(false);
  const [anchor, setAnchor] = useState(null);
  const [form, setForm] = useState({});

  useEffect(() => {
    if (isError) {
      setSnack({ open: true, severity: "error", message: "error" });
    }
  }, [isError, setSnack]);

  useEffect(() => {
    if (isSuccess) {
      setSnack({ open: true, severity: "success", message: "Action is added" });
    }
  }, [isSuccess, setSnack]);

  const handleOpen = (e) => {
    setAnchor(e.target);

    setOpen(true);
  };
  const handleCancel = () => {
    setOpen(false);
    setForm({});
  };
  const changeHandler = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };
  const newStrain = () => {
    newPlant({strain,form});
    setOpen(false);
  };

  return (
    <>
      <Fab
        id="action_button"
        onClick={handleOpen}
        sx={fabStyle}
        aria-label="New Action"
        color="primary"
      >
        <AddIcon />
      </Fab>
      <Popover
        id="action_popover"
        open={open}
        anchorEl={anchor}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Typography sx={{ p: 2 }} gutterBottom variant="h5" component="div">
          New Action
        </Typography>
        <Stack sx={{ p:'2px', width: 300 }} spacing={2}>
          <FormControl variant="outlined" sx={{ my:'2px', minWidth: 200 }}>
            <TextField
              required
              name="name"
              label="Strain Name"
              onChange={changeHandler}
            />
            <TextField
              required
              name="seedBank"
              label="Seed Bank"
              onChange={changeHandler}
            />
            <InputLabel id="seed-label">Seed Type</InputLabel>
            <Select
              labelId="seed-label"
              name="seedType"
              label="Seed Type"
              onChange={changeHandler}
            >
              <MenuItem value="Feminised">Feminised</MenuItem>
              <MenuItem value="Regular">Regular</MenuItem>
            </Select>
            <TextField
              name="description"
              label="Description"
              onChange={changeHandler}
            />

            <TextField
              name="number"
              type="number"
              InputLabelProps={{
                shrink: true,
              }}
              label="Number of seeds"
              onChange={changeHandler}
            />
          </FormControl>
          <Button onClick={newStrain}>Ok</Button>
          <Button onClick={handleCancel}>Cancel</Button>
        </Stack>
      </Popover>
    </>
  );
};
NewPlantButton.propTypes = {
  strain: PropTypes.object,
};