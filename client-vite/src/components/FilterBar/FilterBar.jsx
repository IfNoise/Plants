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
import { useEffect, useRef, useState } from "react";
import OutlinedInput from "@mui/material/OutlinedInput";
import e from "cors";
//import { useGetStrainsQuery } from "../../store/plantsApi";
const states = [
  "Germination",
  "Cloning",
  "Growing",
  "Blooming",
  "Stopped",
  "Harvested",
  "MotherPlant",
];

const ITEM_HEIGHT = 36;
const ITEM_PADDING_TOP = 2;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 200,
    },
  },
};
export const FilterBar = (props) =>{
  const { setOutputFilter ,getData} = props; 
  const [filter, setFilter] = useState({});
  const [phenos, setPhenos] = useState([]);
  const phenoSelect=useRef(null);
  const [startDate, setStartDate] = useState('');

  // const { isSuccess, isLoading, isError, error, data } = useGetStrainsQuery({
  //   refetchOnMountOrArgChange: true,
  //   refetchOnFocus: true,
  // });

  const strains=[...new Set(getData().map((obj) => obj.strain))];

  useEffect(() => {
    if (!filter.strain) { return }
    const pheno = getData().filter((plant)=>(plant.strain===filter.strain)).map((obj) => obj.pheno);
    const uniquePhenos = [...new Set(pheno)];  
    setPhenos(uniquePhenos);

  }, [filter]);

  useEffect(() => {
    setOutputFilter(filter);
    console.log(filter);
  }, [filter]);

  const handleChangeStrain = (event) => {
    

      console.log(phenoSelect.current);
      setFilter((prevfilter) =>{
        return{
          state:prevfilter.state,
          strain: event.target.value,
          }
      });
  }

  const handleChangePheno = (event) => {
    

    console.log(phenoSelect.current);
    setFilter((prevfilter) =>{
      return{
        ...prevfilter,
        pheno: event.target.value,
        }
    });
}
  const handleChangeState = (event) => {
     if(event.target.value.length<1){
       setFilter({});
       return
     }
      setFilter({
        state: event.target.value,
      });
      setPhenos([]);
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
      {}

      <FormControl sx={{ m: 0, width: 200 }}>
        <InputLabel id="state-multiple-checkbox-label">State</InputLabel>
        <Select
          onChange={handleChangeState}
          sx={{ p:0} }
          labelId="state-multiple-checkbox-label"
          id="state-multiple-checkbox"
          multiple
          name="state"
          value={filter.state ?? []}
          input={<OutlinedInput label="State" />}
          renderValue={(selected) => selected.join(", ")}
          MenuProps={{ PaperProps: {
            style: {
              maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
              width: 150,
            },
          },}}
        >
          {states.map((state, id) => {
            return (
              <MenuItem key={id} value={state}>
                <Checkbox checked={filter.state?.indexOf(state) > -1}>
                  {state}
                </Checkbox>
                <ListItemText primary={state} />
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>

      {strains && (
        <FormControl sx={{ m: 0, width: 260 }}>
          <InputLabel id="strain-multiple-checkbox-label">Strain</InputLabel>
          <Select
            onChange={handleChangeStrain}
            labelId="strain-multiple-checkbox-label"
            id="strain-multiple-checkbox"
            name="strain"
            value={filter.strain ?? ''}
            input={<OutlinedInput label="Strain" />}
            MenuProps={{ PaperProps: {
              style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 150,
              },
            },}}
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
      )}
      {phenos.length > 0 && (
        <FormControl sx={{ width: 130 }}>
          <InputLabel id="phenos-multiple-checkbox-label">Phenotype</InputLabel>
          <Select
            onChange={handleChangePheno}
            labelId="phenos-multiple-checkbox-label"
            id="phenos-multiple-checkbox"
            name="pheno"
            ref={phenoSelect}
            multiple
            value={filter?.pheno || []}
            input={<OutlinedInput label="Phenotypes" />}
            renderValue={(selected) => {
              return selected.join(", ");
            }}
            MenuProps={
             { PaperProps: {
                style: {
                  maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                  width: 120,
                },
              },}
            }
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
      sx={{ m: 0, width: 300 }}
      disableFuture
      closeOnSelect
      value={startDate} 
      label="Start Date" 
      onChange={handleChangeStart}
      slotProps={{
        layout: {
          sx: {
            '.MuiDateCalendar-root': {
              color: '#1565c0',
              borderRadius: 4,
              borderWidth: 1,
              borderColor: '#2196f3',
              border: '1px solid',
              backgroundColor: '#bbdefb',
            }
          }
        }
      }}
      />
      </LocalizationProvider>
    </>
  );
};


FilterBar.propTypes = {
  setOutputFilter: PropTypes.func,
  getData: PropTypes.func,
};
