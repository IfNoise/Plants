import {
  FormControl,
  Select,
  MenuItem,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Grid,
  AccordionActions,
  TextField,
  Divider,
  Chip,
  Stack,

} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PropTypes from "prop-types";

import { useDispatch, useSelector } from "react-redux";
import {
  addPheno,
  addStartDate,
  addState,
  addStrain,
  addAddress,
  clearFilter,
} from "../../store/filterSlice";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { InputLabel } from "@mui/material";
import { useEffect, useState } from "react";
import OutlinedInput from "@mui/material/OutlinedInput";
import { buildRooms } from "../../config/config";

export const FilterBar = (props) => {
  const { getData } = props;
  const dispatch = useDispatch();
  const filter = useSelector((state) => state.filter);
  const [address, setAddress] = useState({});
  const [values, setValues] = useState([...Object.values(filter)]);
  const [phenos, setPhenos] = useState([]);
  const [compare, setCompare] = useState("$gte");
  const [startDate, setStartDate] = useState("");
  const [rooms, setRooms] = useState([]);

  

  const handlerBuilding = (e) => {
    const { value } = e.target;
    setAddress({ ...address, building: value });
    dispatch(addAddress({...address, building: value}));
    
    setRooms(buildRooms[value]);
  };

  const handlerRoom = (e) => {
    const { value } = e.target;
    setAddress({ ...address, room: value });
    dispatch(addAddress({...address, room: value}));
  };

  const handlerRow = (e) => {
    const { value } = e.target;
    setAddress({ ...address, row: Number.parseInt(value) });
    dispatch(addAddress({...address,row:Number.parseInt(value)}));
  };

  const handlerRack = (e) => {
    const { value } = e.target;
    setAddress({ ...address, rack: Number.parseInt(value) });
    dispatch(addAddress({...address,rack:Number.parseInt(value)}));
  };

  const handlerTray = (e) => {
    const { value } = e.target;
    setAddress({ ...address, tray: Number.parseInt(value) });
    dispatch(addAddress({...address,tray:Number.parseInt(value)}));
  };

  const handlerNumber = (e) => {
    const { value } = e.target;
    setAddress({ ...address, number: Number.parseInt(value) });
    dispatch(addAddress({...address,number:Number.parseInt(value)}));
  };

  const handlerShelf = (e) => {
    const { value } = e.target;

    dispatch(addAddress({...address,shelf:Number.parseInt(value)}));
  };

  const strains = [...new Set(getData().map((obj) => obj.strain))];
  const states = [...new Set(getData().map((obj) => obj.state))];
  useEffect(() => {
    if (!filter.strain) {
      return;
    }
    const pheno = getData()
      .filter((plant) => plant.strain === filter.strain)
      .map((obj) => obj.pheno);
    const uniquePhenos = [...new Set(pheno)];
    setPhenos(uniquePhenos);
    setValues(()=>[...Object.values(filter)]);
  }, [filter]);

  const handleChangeStrain = (event) => {
    dispatch(addStrain(event.target.value));
  };

  const handleChangePheno = (event) => {
    dispatch(addPheno(event.target.value));
  };
  const handleChangeState = (event) => {
    dispatch(addState(event.target.value));
    setPhenos([]);
  };

  const handleChangeStart = (value) => {
    dispatch(addStartDate({ [compare]: new Date(value.$d) }));
    setStartDate(new Date(value.$d));
  };

  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel2-content"
        id="panel2-header"
        
      >
        <Typography variant="h5" mr={5}>Filter</Typography>
        <Stack direction="row" spacing={1}>
          {values.map((value, index) => {
          if(typeof value === "object" && value !== null && value !== undefined && !Array.isArray(value)){
            return <Chip color="primary" key={index} label={Object.keys(value)[0]==="$gte"?"After":"Before" + " " + new Date(Object.values(value)[0]).toDateString()} />
          }
          return <Chip color="primary" key={index} label={value} />
          })}
        </Stack>
      </AccordionSummary>
      <AccordionDetails>
        <Stack direction="column" spacing={1} divider={<Divider orientation="horizontal" flexItem />}>
        <Grid container spacing={1}>
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <FormControl sx={{ m: "1px", width: "100%" }}>
              <InputLabel id="state-label">State</InputLabel>
              <Select
                onChange={handleChangeState}
                labelId="state-label"
                id="state"
                name="state"
                value={filter.state ?? ""}
                input={<OutlinedInput label="State" />}
              >
                {states.map((state, id) => {
                  return (
                    <MenuItem key={id} value={state}>
                      {state}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Grid>

          {strains && (
            <Grid item xs={12} sm={6} md={4} lg={2}>
              <FormControl sx={{ m: "1px", width: "100%" }}>
                <InputLabel id="strain-multiple-checkbox-label">
                  Strain
                </InputLabel>
                <Select
                  onChange={handleChangeStrain}
                  labelId="strain-multiple-checkbox-label"
                  id="strain-multiple-checkbox"
                  name="strain"
                  value={filter.strain ?? ""}
                  input={<OutlinedInput label="Strain" />}
                >
                  {strains.map((strain, id) => {
                    return (
                      <MenuItem key={id} value={strain}>
                        {strain}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Grid>
          )}
          {phenos.length > 0 && (
            <Grid item xs={12} sm={6} md={4} lg={2}>
              <FormControl sx={{ width: "100%" }}>
                <InputLabel id="phenos-multiple-checkbox-label">
                  Phenotype
                </InputLabel>
                <Select
                  onChange={handleChangePheno}
                  labelId="phenos-multiple-checkbox-label"
                  id="phenos-multiple-checkbox"
                  name="pheno"
                  value={filter.pheno ?? ""}
                  input={<OutlinedInput label="Phenotypes" />}
                >
                  {phenos.map((pheno, id) => {
                    return (
                      <MenuItem key={id} value={pheno}>
                        {pheno}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Grid>
          )}
          <Grid item xs={12} sm={12} md={4} lg={3}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                sx={{ m: "1px" }}
                disableFuture
                closeOnSelect
                size="small"
                value={startDate}
                label="Start Date"
                onChange={handleChangeStart}
                slotProps={{
                  layout: {
                    sx: {
                      ".MuiDateCalendar-root": {
                        color: "#1565c0",
                        borderRadius: 4,
                        borderWidth: 1,
                        borderColor: "#2196f3",
                        border: "1px solid",
                        backgroundColor: "#bbdefb",
                      },
                    },
                  },
                }}
              />
            </LocalizationProvider>
            <FormControl>
              <RadioGroup
                sx={{
                  m: "1px",
                }}
                aria-labelledby="Equal start date"
                defaultValue={compare}
                row
                value={compare}
                name="radio-buttons-group"
                onChange={(e) => {
                  setCompare(e.target.value);
                  dispatch(addStartDate({ [e.target.value]: startDate }));
                }}
              >
                <FormControlLabel
                  value="$gte"
                  control={<Radio />}
                  label="After"
                />
                <FormControlLabel
                  value="$lte"
                  control={<Radio />}
                  label="Before"
                />
              </RadioGroup>
            </FormControl>
          </Grid>
        </Grid>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={6} md={4} lg={2}>
              <FormControl variant="outlined" sx={{ m: "2px", width: "98%" }}>
                <InputLabel id="building-label">Building</InputLabel>
                <Select
                  labelId="building-label"
                  value={address.building ?? ""}
                  name="building"
                  label="Building"
                  onChange={handlerBuilding}
                  InputLabelProps={{
                    shrink: true,
                  }}
                >
                  {Object.keys(buildRooms).map((obj, index) => {
                    return (
                      <MenuItem key={index} value={obj}>
                        {obj}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={2}>
              <FormControl variant="outlined" sx={{ m: "2px", width: "98%" }}>
                <InputLabel id="room-label">Room</InputLabel>
                <Select
                  labelId="room-label"
                  name="room"
                  value={address.room ?? ""}
                  label="Room"
                  onChange={handlerRoom}
                  InputLabelProps={{
                    shrink: true,
                  }}
                >
                  {rooms.map((text, index) => {
                    return (
                      <MenuItem key={index} value={text}>
                        {text}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Grid>
            {address?.room != "Laboratory" && (
              <>
                <Grid item xs={12} sm={6} md={4} lg={2}>
                  <TextField
                    id="outlined-number"
                    sx={{ m: "2px", width: "98%" }}
                    label="Row"
                    type="number"
                    onChange={handlerRow}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={2}>
                  <TextField
                    id="outlined-number"
                    sx={{ m: "2px", width: "98%" }}
                    label="Tray"
                    type="number"
                    onChange={handlerTray}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
              </>
            )}
            {address?.room == "Laboratory" && (
                <><Grid item xs={12} sm={4} md={4} lg={2}>
                  <TextField
                    id="outlined-number"
                    sx={{ m: "2px", width: "98%" }}
                    label="Rack"
                    type="number"
                    onChange={handlerRack}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                  </Grid>
                  <Grid item xs={12} sm={4} md={4} lg={2}>
                  <TextField
                    id="outlined-number"
                    sx={{ mx: "2px", width: "98%" }}
                    label="Shelf"
                    type="number"
                    onChange={handlerShelf}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                </>
            )}
          
        </Grid>
        </Stack>
      </AccordionDetails>
      <AccordionActions>
        <Button variant="outlined" onClick={() => {
          dispatch(clearFilter())
          setValues([])
          setStartDate("")
          }}>
          Clear
        </Button>
      </AccordionActions>
    </Accordion>
  );
};

FilterBar.propTypes = {
  setOutputFilter: PropTypes.func,
  getData: PropTypes.func,
};
