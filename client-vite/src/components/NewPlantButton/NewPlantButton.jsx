import { useState, useContext, useEffect } from "react";
import {
  Button,
  FormControl,
  Stack,
  Fab,
  Popover,
  Typography,
  TextField,
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
      setSnack({ open: true, severity: "success", message: "Plant is added" });
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
    newPlant({strain, ...form});
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
          New Plant
        </Typography>
        <Stack sx={{ p:'2px', width: 300 }} spacing={2}>
          <FormControl variant="outlined" sx={{ my:'2px', minWidth: 200 }}>
            <TextField
              name="group"
              label="Group"
              onChange={changeHandler}
            />

            <TextField
              name="number"
              type="number"
              InputLabelProps={{
                shrink: true,
              }}
              value={form.number||0}
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
  strain: PropTypes.string,
};