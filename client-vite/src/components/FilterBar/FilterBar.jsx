import {
  Checkbox,
  FormControl,
  ListItemText,
  Select,
  MenuItem,
  ListSubheader,
} from "@mui/material";
import PropTypes from 'prop-types';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { InputLabel } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { useEffect, useState } from "react";
import OutlinedInput from "@mui/material/OutlinedInput";
import { useGetStrainsQuery } from "../../store/plantsApi";
import { Alert } from "@mui/material";
const states = [
  "Germination",
  "Cloning",
  "Growing",
  "Blooming",
  "Stopped",
  "Harvested",
  "MotherPlant",
];

function MyListSubheader(props) {
  return <ListSubheader {...props} />;
}
MyListSubheader.muiSkipListHighlight = true;

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
export const FilterBar = (props) => {
  const { setOutputFilter } = props; 
  const [filter, setFilter] = useState({});
  const [phenos, setPhenos] = useState([]);

  const [startDate, setStartDate] = useState('');

  const { isSuccess, isLoading, isError, error, data } = useGetStrainsQuery({
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
  });

  const strains = data?.strains;

  useEffect(() => {
    if (!filter.strain) { return }
    const pheno = [];
      pheno.push(...(strains.filter((obj) => (obj.strain === filter.strain))[0].pheno))   
    setPhenos(pheno);

  }, [filter]);

  useEffect(() => {
    setOutputFilter(filter);
    console.log(filter);
  }, [filter]);

  const handleChange = (event) => {
    setFilter({
      ...filter,
      [event.target.name]: event.target.value,
    });
  }

  const handleChangeStart = (value) => {
    setStartDate(value);
    console.log(value);
    setFilter({
      ...filter,
      startDate: { $gt: new Date(value.$d)},
    });
  }

  return (
    <>
      {isError && <Alert severity="error">{error.message}</Alert>}

      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="state-multiple-checkbox-label">State</InputLabel>
        <Select
          onChange={handleChange}
          labelId="state-multiple-checkbox-label"
          id="state-multiple-checkbox"
          multiple
          name="state"
          value={filter.state ?? []}
          input={<OutlinedInput label="State" />}
          renderValue={(selected) => selected.join(", ")}
          MenuProps={MenuProps}
        >
          {states.map((state, id) => {
            return (
              <MenuItem key={id} value={state}>
                <Checkbox checked={filter.state?.indexOf(state) > -1}>
                  {" "}
                </Checkbox>
                <ListItemText primary={state} />
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>

      {isLoading && <CircularProgress />}
      {isSuccess && strains && (
        <FormControl sx={{ m: 1, width: 300 }}>
          <InputLabel id="strain-multiple-checkbox-label">Strain</InputLabel>
          <Select
            onChange={handleChange}
            labelId="strain-multiple-checkbox-label"
            id="strain-multiple-checkbox"
            name="strain"
            value={filter.strain ?? ''}
            input={<OutlinedInput label="Strain" />}
            MenuProps={MenuProps}
          >
            {strains.map((strain, id) => {
              return (
                <MenuItem key={id} value={strain.strain}>
                  {strain.strain}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      )}
      {phenos.length > 0 && (
        <FormControl sx={{ m: 1, width: 300 }}>
          <InputLabel id="phenos-multiple-checkbox-label">Phenotype</InputLabel>
          <Select
            onChange={handleChange}
            labelId="phenos-multiple-checkbox-label"
            id="phenos-multiple-checkbox"
            name="pheno"
            multiple
            value={filter.pheno ?? []}
            input={<OutlinedInput label="Phenotypes" />}
            renderValue={(selected) => selected.join(", ")}
            MenuProps={MenuProps}
          >
            {phenos.map((pheno, id) => {
              return (
                <MenuItem key={id} value={pheno}>
                  <Checkbox checked={filter.pheno?.indexOf(pheno) > -1}>
                  </Checkbox>
                  <ListItemText primary={pheno} />
                </MenuItem>

              );
            })}
          </Select>
        </FormControl>
      )}
      <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker 
      sx={{ m: 1, width: 300 }}
      disableFuture
      closeOnSelect
      value={startDate} 
      label="Start Date" 
      onChange={handleChangeStart}
      />
      </LocalizationProvider>
    </>
  );
};


FilterBar.propTypes = {
  setOutputFilter: PropTypes.func,
};
