import {
  FormControl,
  Select,
  MenuItem,
  Button,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Divider,
  Chip,
  Stack,
  Box,
  Drawer,
  Fab,
  useTheme,
} from "@mui/material";
import TuneIcon from "@mui/icons-material/Tune";
import CancelIcon from "@mui/icons-material/Cancel";
import PropTypes from "prop-types";

import { useDispatch, useSelector } from "react-redux";
import {
  addPheno,
  addStartDate,
  addState,
  addStrain,
  addPotSize,
  addAddress,
  clearFilter,
} from "../../store/filterSlice";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from 'dayjs';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { InputLabel } from "@mui/material";
import { useEffect, useState } from "react";
import OutlinedInput from "@mui/material/OutlinedInput";
import { buildRooms, pots } from "../../config/config";

export const FilterBar = (props) => {
  const { getData } = props;
  const dispatch = useDispatch();
  const filter = useSelector((state) => state.filter);
  const [address, setAddress] = useState({});
  const [values, setValues] = useState([...Object.values(filter)]);
  const [phenos, setPhenos] = useState([]);
  const [compare, setCompare] = useState("$gte");
  const [startDate, setStartDate] = useState(dayjs('2022-04-17'));
  const [rooms, setRooms] = useState([]);
  const [open, setOpen] = useState(false);
  const theme = useTheme();

  const handlerBuilding = (e) => {
    const { value } = e.target;
    setAddress((prev)=>{return { ...prev, building: value }});
    dispatch(addAddress({ ...address, building: value }));
    setRooms(()=>[...buildRooms[value]]);
  };

  const handlerRoom = (e) => {
    const { value } = e.target;
    setAddress((prev)=>({ ...prev, room: value }));
    dispatch(addAddress({ ...address, room: value }));
  };

  const handlerRow = (e) => {
    const { value } = e.target;
    setAddress((prev)=>({ ...prev, row: Number.parseInt(value) }));
    dispatch(addAddress({ ...address, row: Number.parseInt(value) }));
  };

  const handlerRack = (e) => {
    const { value } = e.target;
    setAddress((prev)=>({ ...prev, rack: Number.parseInt(value) }));
    dispatch(addAddress({ ...address, rack: Number.parseInt(value) }));
  };

  const handlerTray = (e) => {
    const { value } = e.target;
    setAddress({ ...address, tray: Number.parseInt(value) });
    dispatch(addAddress({ ...address, tray: Number.parseInt(value) }));
  };

  const handlerNumber = (e) => {
    const { value } = e.target;
    setAddress({ ...address, number: Number.parseInt(value) });
    dispatch(addAddress({ ...address, number: Number.parseInt(value) }));
  };

  const handlerShelf = (e) => {
    const { value } = e.target;

    dispatch(addAddress({ ...address, shelf: Number.parseInt(value) }));
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
    setValues(() => [...Object.values(filter)]);
  }, [filter]);

  const handleChangeStrain = (event) => {
    dispatch(addStrain(event.target.value));
  };
  const handleChangePotSize = (event) => {
    dispatch(addPotSize(event.target.value));
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
    <>
      <Fab
        onClick={() => setOpen(!open)}
        sx={{ position: "fixed", top: 65, right: 10 }}
      >
        <TuneIcon />
      </Fab>
      <Drawer
        open={open}
        anchor="right"
        sx={{
          width: { xs: "100vw", sm: "100vw", md: "20vw" },
          height: "100%",
          display: "flex",
          flexDirection: "column",
          m: 2,
          p: 2,
        }}
      >
        <Box sx={{ m: 1 }}>
          <Typography variant="h5" mr={5}>
            Filter
          </Typography>
          <Stack spacing={2} direction="row" justifyContent="center">
            <Button
              sx={{
                borderRadius: 5,
                backgroundColor: theme.palette.primary.main,
              }}
              variant="filled"
              onClick={() => {
                setOpen(false);
              }}
            >
              Ok
            </Button>
            <Button
              variant="filled"
              sx={{
                borderRadius: 5,
                backgroundColor: theme.palette.primary.main,
              }}
              onClick={() => {
                dispatch(clearFilter());
                setValues([]);
                setStartDate(null);
              }}
            >
              Clear
            </Button>
          </Stack>
          <Stack
            spacing={{ xs: 1, sm: 2 }}
            direction="row"
            useFlexGap
            flexWrap="wrap"
            width="100%"
          >
            {values.map((value, index) => {
              if (
                typeof value === "object" &&
                value !== null &&
                value !== undefined &&
                !Array.isArray(value)
              ) {
                return (
                  <Chip
                    color="primary"
                    size="small"
                    key={index}
                    label={
                      Object.keys(value)[0] === "$gte"
                        ? "After"
                        : "Before" +
                          " " +
                          new Date(Object.values(value)[0]).toDateString()
                    }
                  />
                );
              }
              return (
                <Chip color="primary" size="small" key={index} label={value} />
              );
            })}
          </Stack>
          <Box
            sx={{
              p: 2,
              width: "100%",
              height: "100%",
              overflowY: "auto",
              overflowX: "hidden",
            }}
          >
            <Stack
              direction="column"
              sx={{ m: "1px" }}
              spacing={1}
              divider={<Divider orientation="horizontal" flexItem />}
            >
              <Stack direction="row" spacing={1}>
                <FormControl sx={{ m: "1px", width: "95%" }}>
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
                <Button
                  sx={{
                    display: filter.state ? "block" : "none",
                  }}
                  onClick={() => dispatch(addState(null))}
                >
                  <CancelIcon fontSize="small" />
                </Button>
              </Stack>
              {strains && (
                <Stack direction="row" spacing={1}>
                  <FormControl sx={{ m: "1px", width: "95%" }}>
                    <InputLabel id="strain-checkbox-label">
                      Strain
                    </InputLabel>
                    <Select
                      onChange={handleChangeStrain}
                      labelId="strain-checkbox-label"
                      id="strain-checkbox"
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
                  <Button
                    sx={{
                      display: filter.strain ? "block" : "none",
                    }}
                    onClick={() => dispatch(addStrain(null))}
                  >
                    <CancelIcon fontSize="small" />
                  </Button>
                </Stack>
              )}
              {phenos.length > 0 && (
                <Stack direction="row" spacing={1}>
                  <FormControl sx={{ width: "95%" }}>
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
                  <Button
                    sx={{ display: filter.pheno ? "block" : "none" }}
                    onClick={() => dispatch(addPheno(null))}
                  >
                    {" "}
                    <CancelIcon fontSize="small"/>{" "}
                  </Button>
                </Stack>
              )}
              <Box>
                <Stack direction="row" spacing={1}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      sx={{ m: "1px" }}
                      disableFuture
                      closeOnSelect
                      size="small"
                      value={startDate||new Date()}
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
                  <Button
                    sx={{
                      display: filter.startDate ? "block" : "none",
                    }}
                    onClick={() => dispatch(addStartDate(null))}
                  >
                    <CancelIcon fontSize="small" />
                  </Button>
                </Stack>
              </Box>
              <Stack direction="row" spacing={1}>
                <FormControl
                  variant="outlined"
                  sx={{ m: "2px", width: "90%" }}
                >
                  <InputLabel id="potsize-label">Pot Size</InputLabel>
                  <Select
                    labelId="potsize-label"
                    value={filter.potSize ?? ""}
                    label="Pot Size"
                    onChange={handleChangePotSize}
                  >
                    {pots.map((text, index) => {
                      return (
                        <MenuItem key={index} value={text}>
                          {text}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
                <Button
                  sx={{
                    display: filter.potSize ? "block" : "none",
                  }}
                  onClick={() => dispatch(addPotSize(null))}
                >
                  <CancelIcon fontSize="small" />
                </Button>
              </Stack>
              <Stack direction="row" spacing={1}>
                <FormControl variant="outlined" sx={{ m: "2px", width: "95%" }}>
                  <InputLabel id="building-label">Building</InputLabel>
                  <Select
                    labelId="building-label"
                    value={address?.building ?? ""}
                    name="building"
                    label="Building"
                    onChange={handlerBuilding}
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
                <Button
                  sx={{ display: address?.building ? "block" : "none" }}
                  onClick={() => {
                    const tmp = { ...address };
                    delete tmp.building;
                    if(tmp.room) delete tmp.room;
                    setAddress({ ...tmp });   
                    dispatch(addAddress(tmp))
                    setRooms([]);

                  }}
                >
                  <CancelIcon fontSize="small" />
                </Button>
              </Stack>
              <Stack direction="row" spacing={1}>
              <FormControl variant="outlined" sx={{ m: "2px", width: "95%" }}>
                <InputLabel id="room-label">Room</InputLabel>
                <Select
                  labelId="room-label"
                  name="room"
                  value={address.room ?? ""}
                  label="Room"
                  onChange={handlerRoom}

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
              <Button
                  sx={{ display: address?.room ? "block" : "none" }}
                  onClick={() => {
                    const tmp = { ...address };
                    delete tmp.room;
                    setAddress({ ...tmp });   
                    dispatch(addAddress(tmp))
                  }}
                >
                  <CancelIcon fontSize="small" />
                </Button>
              </Stack>
              {address?.room != "Laboratory" && (
                <>
                <Stack direction="row" spacing={1}>
                  <TextField
                    id="outlined-number"
                    sx={{ m: "2px", width: "95%" }}
                    label="Row"
                    value={address?.row ?? 0}
                    type="number"
                    onChange={handlerRow}
                  />
                  <Button
                  sx={{ display: address?.row ? "block" : "none" }}
                  onClick={() => {
                    const tmp = { ...address };
                    delete tmp.row;
                    setAddress({ ...tmp });   
                    dispatch(addAddress(tmp))
                  }}
                >
                  <CancelIcon fontSize="small" />
                </Button>
                </Stack>
                <Stack direction="row" spacing={1}>
                  <TextField
                    id="outlined-number"
                    sx={{ m: "2px", width: "95%" }}
                    label="Tray"
                    type="number"
                    value={address?.tray ?? 0}
                    onChange={handlerTray}
                  />
                <Button
                  sx={{ display: address?.tray ? "block" : "none" }}
                  onClick={() => {
                    const tmp = { ...address };
                    delete tmp.tray;
                    setAddress({ ...tmp });   
                    dispatch(addAddress(tmp))
                  }}
                >
                  <CancelIcon fontSize="small" />
                </Button>
                </Stack>
                <Stack direction="row" spacing={1}>
                  <TextField
                    id="outlined-number"
                    sx={{ mx: "2px", width: "95%" }}
                    label="Number"
                    type="number"
                    value={address?.number ?? 0}
                    onChange={handlerNumber}
                  />
                                    <Button
                  sx={{ display: address?.number ? "block" : "none" }}
                  onClick={() => {
                    const tmp = { ...address };
                    delete tmp.number;
                    setAddress({ ...tmp });   
                    dispatch(addAddress(tmp))
                  }}
                >
                  <CancelIcon fontSize="small" />
                </Button>
                </Stack>
                </>
              )}
              {address?.room == "Laboratory" && (
                <>
                <Stack direction="row" spacing={1}>
                  <TextField
                    id="outlined-number"
                    sx={{ m: "2px", width: "95%" }}
                    label="Rack"
                    type="number"
                    value={address?.rack ?? 0}
                    onChange={handlerRack}
                  />
                                    <Button
                  sx={{ display: address?.rack ? "block" : "none" }}
                  onClick={() => {
                    const tmp = { ...address };
                    delete tmp.rack;
                    setAddress({ ...tmp });   
                    dispatch(addAddress(tmp))
                  }}
                >
                  <CancelIcon fontSize="small" />
                </Button>
                </Stack>
                <Stack direction="row" spacing={1}>
                  <TextField
                    id="outlined-number"
                    sx={{ mx: "2px", width: "95%" }}
                    label="Shelf"
                    type="number"
                    value={address?.shelf ?? 0}
                    onChange={handlerShelf}
                  />
                                    <Button
                  sx={{ display: address?.shelf ? "block" : "none" }}
                  onClick={() => {
                    const tmp = { ...address };
                    delete tmp.shelf;
                    setAddress({ ...tmp });   
                    dispatch(addAddress(tmp))
                  }}
                >
                  <CancelIcon fontSize="small" />
                </Button>
                </Stack>
                <Stack direction="row" spacing={1}>
                  <TextField
                    id="outlined-number"
                    sx={{ mx: "2px", width: "95%" }}
                    label="Number"
                    type="number"
                    value={address?.number ?? 0}
                    onChange={handlerNumber}
                  />
                   <Button
                  sx={{ display: address?.number ? "block" : "none" }}
                  onClick={() => {
                    const tmp = { ...address };
                    delete tmp.number;
                    setAddress({ ...tmp });   
                    dispatch(addAddress(tmp))
                  }}
                >
                  <CancelIcon fontSize="small" />
                </Button>
                </Stack>
                </>
              )}
            </Stack>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

FilterBar.propTypes = {
  setOutputFilter: PropTypes.func,
  getData: PropTypes.func,
};
