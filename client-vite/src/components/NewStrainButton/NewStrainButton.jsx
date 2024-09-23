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

import AddIcon from "@mui/icons-material/Add";

import { SnackbarContext } from "../../context/SnackbarContext";

import { useAddStrainMutation } from "../../store/strainApi";
import { useNewPlantMutation } from "../../store/plantsApi";

const fabStyle = {
  position: "fixed",
  bottom: 16,
  right: 16,
};

export const NewStrainButton = () => {
  //const theme = useTheme();
  const { setSnack } = useContext(SnackbarContext);
  const [addStrain, { isSuccess, isError }] = useAddStrainMutation();
  const [newPlant]=useNewPlantMutation()
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
      setSnack({ open: true, severity: "success", message: "Strain is added" });
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
    addStrain(form);
    if(form.sourceType==='Clone'){
 
    newPlant({
      strainName:form.name,
      code:form.code,
      number:form.number,
      type:form.sourceType,
    });
    }
    setForm({});
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
        <Stack sx={{ p: "2px", width: 300 }} spacing={1}>
          <FormControl variant="outlined" >
            <TextField
              required
              name="name"
              label="Strain Name"
              onChange={changeHandler}
            />
           <FormControl variant="outlined"> <TextField name="code" label="Code" onChange={changeHandler} /></FormControl>
          </FormControl>
          <FormControl>
            <TextField
              required
              name="seedBank"
              label="Seed Bank"
              onChange={changeHandler}
            />
          </FormControl>
          <FormControl>
            <InputLabel id="source-label">Source Type</InputLabel>
            <Select
              labelId="source-label"
              name="sourceType"
              label="Source Type"
              value={form?.sourceType || ""}
              onChange={changeHandler}
            >
              <MenuItem value="Clone">Clone</MenuItem>
              <MenuItem value="Seed">Seed</MenuItem>
            </Select>
          </FormControl>
      {    form?.sourceType === "Seed" &&
      <>    
        <FormControl>
          <InputLabel id="seed-label">Seed Type</InputLabel>
          <Select
            labelId="seed-label"
            name="seedType"
            label="Seed Type"
            value={form?.seedType || ""}
            onChange={changeHandler}
          >
            <MenuItem value="Feminised">Feminised</MenuItem>
            <MenuItem value="Regular">Regular</MenuItem>
          </Select>
        </FormControl>
        <FormControl>
          <TextField
            name="description"
            label="Description"
            onChange={changeHandler}
          />
        </FormControl>
        </>
        }
          <FormControl>
            <TextField
              name="number"
              type="number"
              label={"Number of " + form?.sourceType} 
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
