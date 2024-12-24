import {
  FormControl,
  Select,
  MenuItem,
  Button,
  Typography,
  TextField,
  Divider,
  Chip,
  Stack,
  Box,
  Drawer,
  useTheme,
  IconButton,
  Autocomplete,
} from "@mui/material";
import TuneIcon from "@mui/icons-material/Tune";
import CancelIcon from "@mui/icons-material/Cancel";
import PropTypes from "prop-types";

import { useDispatch, useSelector } from "react-redux";
import {
  addPheno,
  addAfterDate,
  addBeforeDate,
  addState,
  addStrain,
  addPotSize,
  addAddress,
  clearFilter,
} from "../../store/filterSlice";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { InputLabel } from "@mui/material";
import { useEffect, useState } from "react";
import OutlinedInput from "@mui/material/OutlinedInput";
import { buildRooms, pots } from "../../config/config";

export const FilterBar = (props) => {
  const { data } = props;
  const dispatch = useDispatch();
  const filter = useSelector((state) => state.filter);
  const [address, setAddress] = useState({});
  const [values, setValues] = useState([...Object.values(filter)]);
  const [phenos, setPhenos] = useState([]);
  const [afterDate, setAfterDate] = useState(dayjs());
  const [beforeDate, setBeforeDate] = useState(dayjs());
  const [rooms, setRooms] = useState([]);
  const [open, setOpen] = useState(false);
  const theme = useTheme();

  const strains = [...new Set(data?.map((obj) => obj.strain))];

  const handlerBuilding = (e) => {
    const { value } = e.target;
    setAddress((prev) => {
      return { ...prev, building: value };
    });
    dispatch(addAddress({ ...address, building: value }));
    setRooms(() => [...buildRooms[value]]);
  };

  const handlerRoom = (e) => {
    const { value } = e.target;
    setAddress((prev) => ({ ...prev, room: value }));
    dispatch(addAddress({ ...address, room: value }));
  };

  const handlerRow = (e) => {
    const { value } = e.target;
    setAddress((prev) => ({ ...prev, row: Number.parseInt(value) }));
    dispatch(addAddress({ ...address, row: Number.parseInt(value) }));
  };

  const handlerRack = (e) => {
    const { value } = e.target;
    setAddress((prev) => ({ ...prev, rack: Number.parseInt(value) }));
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

  const states = [
    "Germination",
    "Cloning",
    "Growing",
    "MotherPlant",
    "Blooming",
    "Stopped",
    "Harvested",
  ];
  // useEffect(() => {
  //   setData(getData());

  //   console.log("Data", data.length);
  // }, [filter]);
  useEffect(() => {
    if (!filter.strain) return;
    const pheno = [
      ...new Set(
        data?.filter((i) => i.strain == filter.strain).map((obj) => obj.pheno)
      ),
    ];
    setPhenos(pheno);
  }, [filter]);

  const handleChangeStrain = (_, newValue) => {
    dispatch(addStrain(newValue));
  };
  const handleChangePotSize = (event) => {
    dispatch(addPotSize(event.target.value));
  };

  const handleChangePheno = (event) => {
    dispatch(addPheno(event.target.value));
  };
  const handleChangeState = (_, newValue) => {
    dispatch(addState(newValue));
    setPhenos([]);
  };

  const handleChangeAfter = (value) => {
    dispatch(addAfterDate(new Date(value.$d)));
    setAfterDate(new Date(value.$d));
  };
  const handleChangeBefore = (value) => {
    dispatch(addBeforeDate(new Date(value.$d)));
    setBeforeDate(new Date(value.$d));
  };

  return (
    <>
      <IconButton onClick={() => setOpen(!open)}>
        <TuneIcon />
      </IconButton>
      <Drawer
        open={open}
        anchor="right"
        sx={{
          width: "100%",
          height: "100%",
          m: 2,
          p: 2,
        }}
      >
        <Box
          sx={{
            m: 1,
            marginTop: "64px",
            width: { xs: "100%" },
          }}
        >
          <Typography variant="h5" mr={5}>
            Filter
          </Typography>
          <Stack spacing={2} direction="row" justifyContent="center">
            <Button
              sx={{
                borderRadius: 5,
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
                setAfterDate(null);
                setBeforeDate(null);
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
              if (typeof value === "object" && value !== null) {
                return Object.keys(value).map((key, index) => {
                  if (key === "$gte") {
                    return (
                      <Chip
                        color="primary"
                        size="small"
                        key={index}
                        label={`After: ${dayjs(value[key] || 0).format(
                          "DD/MM/YYYY"
                        )}`}
                      />
                    );
                  } else if (key === "$lte") {
                    return (
                      <Chip
                        color="primary"
                        size="small"
                        key={index}
                        label={`Before: ${dayjs(value[key] || 0).format(
                          "DD/MM/YYYY"
                        )}`}
                      />
                    );
                  }
                });
              } else
                return (
                  <Chip
                    color="primary"
                    size="small"
                    key={index}
                    label={value}
                  />
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
                  <Autocomplete
                    onChange={handleChangeState}
                    id="state"
                    name="state"
                    options={states}
                    value={filter.state ?? ""}
                    renderInput={(params) => (
                      <TextField {...params} label="State" />
                    )}
                  />
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
              {strains?.length > 0 && (
                <Stack direction="row" spacing={1}>
                  <FormControl sx={{ m: "1px", width: "95%" }}>
                    <Autocomplete
                      onChange={handleChangeStrain}
                      id="strain-checkbox"
                      name="strain"
                      value={filter.strain ?? ""}
                      options={strains}
                      renderInput={(params) => (
                        <TextField {...params} label="Strain" />
                      )}
                    />
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
                    <CancelIcon fontSize="small" />{" "}
                  </Button>
                </Stack>
              )}
              <Box>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Stack direction="row" spacing={1}>
                    <DatePicker
                      sx={{ m: "1px" }}
                      disableFuture
                      closeOnSelect
                      size="small"
                      value={afterDate || dayjs()}
                      label="After"
                      onChange={handleChangeAfter}
                    />
                    <Button
                      sx={{
                        display: afterDate ? "block" : "none",
                      }}
                      onClick={() => {
                        dispatch(addAfterDate(null));
                        setAfterDate(dayjs());
                      }}
                    >
                      <CancelIcon fontSize="small" />
                    </Button>
                  </Stack>
                  <Stack direction="row" spacing={1}>
                    <DatePicker
                      sx={{ m: "1px" }}
                      disableFuture
                      closeOnSelect
                      size="small"
                      value={beforeDate || dayjs()}
                      label="Before"
                      onChange={handleChangeBefore}
                    />

                    <Button
                      sx={{
                        display: beforeDate ? "block" : "none",
                      }}
                      onClick={() => {
                        dispatch(addBeforeDate(null));
                        setBeforeDate(dayjs());
                      }}
                    >
                      <CancelIcon fontSize="small" />
                    </Button>
                  </Stack>
                </LocalizationProvider>
              </Box>
              <Stack direction="row" spacing={1}>
                <FormControl variant="outlined" sx={{ m: "2px", width: "90%" }}>
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
                    if (tmp.room) delete tmp.room;
                    setAddress({ ...tmp });
                    dispatch(addAddress(tmp));
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
                    dispatch(addAddress(tmp));
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
                        dispatch(addAddress(tmp));
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
                        dispatch(addAddress(tmp));
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
                        dispatch(addAddress(tmp));
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
                        dispatch(addAddress(tmp));
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
                        dispatch(addAddress(tmp));
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
                        dispatch(addAddress(tmp));
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
  data: PropTypes.array,
};
