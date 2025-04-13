import { forwardRef, useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Slider,
  Typography,
  CardActions,
  Stack,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  IconButton,
  InputLabel,
  OutlinedInput,
  FormControl,
  Popper,
  Paper,
  ClickAwayListener,
  TextField,
  Popover,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import PropTypes from "prop-types";
import {
  AddPumpToUnitDialog,
  AddFertigationUnitDialog,
  RecipeTable,
  Ballance,
} from "./Helpers";
import {
  useDeleteFertilizerUnitMutation,
  useGetAllConcentratesQuery,
  useGetAllFertilizersQuery,
  useGetAllRecieptsQuery,
  useGetConcentrateByIdQuery,
  useGetFertilizerUnitsQuery,
  useRemovePumpFromFertilizerUnitMutation,
  useUpdateFertilizerUnitMutation,
  useUpdatePumpFromFertilizerUnitMutation,
} from "../../store/feedingApi";
import AreYouSure from "../AreYouSure";

// const ElementsTable=({solution}) => {
// const [unit, setUnit] = useState('mM');//ppm,mM,%w/v
// const [elementsList, setElementsList] = useState(solution);
// const [iones, setIones] = useState([]);
// const [kationAnion, setKationAnion] = useState(0);
// useMemo(() => {
//   const ionesMmass = elements.map((element) => {
//     return element.content;
//   }).flat();
//   //const coefficients = ionesMmass.map((element) => element.coef);

//   if(solution?.length>0){
//    const iones = solution.filter((element) => {
//       return(!ionesMmass.find((e) => element.name===e.element)?.chelate);
//     })
//    .map((el) => {
//       const{ion,charge,mmass}=ionesMmass.find((e)=>el.name===e.element);
//       return {
//         name:ion,//NO3-,NH4+,PO4,PO4,PO4,K+,Ca++,Mg++
//         charge:charge,//-1,1,-3,-3,-3,1,2,2
//         concentration:el.concentration,//weight/1L
//         mmass,//g/mol

//       }
//     }
//     )
//     const kationAnion = iones.reduce((acc,element)=>{
//       if(element.charge>0){
//         acc.kation+=element.concentration/element.mmass*element.charge;
//       }else{
//         acc.anion+=element.concentration/element.mmass*element.charge;
//       }
//       acc.ballance=acc.kation+acc.anion;
//       return acc;
//     }
//     ,{kation:0,anion:0,ballance:0}
//     )
//     setIones(iones);
//     setKationAnion(kationAnion);
//     const eList= solution.map((element) => {
//       if(unit==='ppm'){

//         return {
//           name: element.name,
//           concentration: element.concentration,
//         };
//       }else if(unit==='mM'){
//         return {
//           name: element.name,
//           concentration: (element.concentration/1000),
//         };
//       } else if(unit==='%w/v'){
//         return {
//           name: element.name,
//           concentration: element.concentration/1000*(ionesMmass.find((e)=>element.name===e.element).mmass),
//         };
//       }

//     }
//     )
//     // .map((element) => {
//     //     return {
//     //       id:
//     //         elements.find((e) => element.name?.startsWith(e.code))?.id ||
//     //         element.id,
//     //       name:
//     //         elements.find((e) => element.name?.startsWith(e.code))?.code ||
//     //         element.name,
//     //       concentration:
//     //         element.concentration *
//     //         coefficients.find((c) => element.name === c.element).coef,
//     //     };
//     //   })
//     //   .sort((a, b) => a.id - b.id)
//     //   .reduce((acc, element) => {
//     //     const existing = acc.find((e) => e.name === element.name);
//     //     if (existing) {
//     //       existing.concentration += element.concentration;
//     //     } else {
//     //       acc.push(element);
//     //     }
//     //     return acc;
//     //   }, []);
//     setElementsList(eList);

//   }

// }, [solution,unit]);
// return (
// <Box

// >
// <ToggleButtonGroup
//   value={unit}
//   exclusive
//   onChange={(event, newUnit) => {
//     if (newUnit !== null) {
//       setUnit(newUnit);
//     }
//   }}

// >
// {units.map((u,i)=>(
//   <ToggleButton
//     key={i}
//     value={u}
//   >
//     {u}
//   </ToggleButton>
// ))}
// </ToggleButtonGroup>
// <pre>{JSON.stringify(solution,null,2)}</pre>
// <pre>{JSON.stringify(iones,null,2)}</pre>
// <pre>{JSON.stringify(kationAnion,null,2)}</pre>
// <pre>{JSON.stringify(elementsList,null,2)}</pre>
// {/* <Table>
//   <TableHead>
//     <TableRow>
//       <TableCell>Element</TableCell>
//       <TableCell>Concentration</TableCell>
//     </TableRow>
//   </TableHead>
//   <TableBody>
//     {elements?.length > 0 && elements.map((element, i) => (
//       <TableRow key={i}>
//         <TableCell>{element.name}</TableCell>
//         <TableCell>
//           {unit==='ppm'?element.concentration:unit==='mM'?(element.concentration/1000):element.concentration}
//         </TableCell>
//       </TableRow>
//     ))}
//   </TableBody>
// </Table> */}
// </Box>

// )
// }
// ElementsTable.propTypes={
//   solution:PropTypes.array.isRequired,
// }
const InputPopper = forwardRef(
  ({ label, anchorEl, open, onClose = () => {}, onChange }) => {
    const [value, setValue] = useState("");
    const handleChange = (e) => {
      setValue(e.target.value);
    };
    const handleOk = () => {
      if (value) onChange(value);
      onClose();
    };
    return (
      <Popover
        open={open}
        onClose={onClose}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Paper
          sx={{
            p: "6px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <TextField
            variant="outlined"
            label={label}
            onChange={handleChange}
            value={value}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleOk();
              }
            }}
          />
          <Button variant="outlined" onClick={handleOk} sx={{ ml: 1 }}>
            Ok
          </Button>
        </Paper>
      </Popover>
    );
  }
);
InputPopper.displayName = "InputPopper";
InputPopper.propTypes = {
  label: PropTypes.string,
  anchorEl: PropTypes.object,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onChange: PropTypes.func,
};

const SelectRecipe = ({ recipe, onChange }) => {
  const [recipeValue, setRecipeValue] = useState(recipe);
  const { data: recipes } = useGetAllRecieptsQuery();
  const changeRecipe = (e) => {
    const { value } = e.target;
    setRecipeValue(value);
    if (onChange) onChange({ recipe: value });
  };
  return (
    <>
      <FormControl variant="outlined" sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="select-recipe-label">Select Recipe</InputLabel>
        <Select
          labelId="select-recipe-label"
          input={<OutlinedInput label="Name" />}
          value={recipeValue}
          onChange={changeRecipe}
        >
          {recipes?.length > 0 &&
            recipes.map((r, i) => (
              <MenuItem key={i} value={r._id}>
                {r.name}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
    </>
  );
};
SelectRecipe.propTypes = {
  onChange: PropTypes.func,
};

const SelectConcentrate = ({ concentrate, onChange }) => {
  const [concentrateValue, setConcentrateValue] = useState(concentrate);
  const { data: concentrates } = useGetAllConcentratesQuery();
  const changeConcentrate = (e) => {
    const { value } = e.target;
    setConcentrateValue(value);
    if (onChange) onChange({ concentrate: value });
  };
  return (
    <>
      <Select
        sx={{ m: 1, p: 0, maxWidth: 120 }}
        input={<OutlinedInput label="Name" />}
        value={concentrateValue}
        onChange={changeConcentrate}
      >
        {concentrates?.length > 0 &&
          concentrates.map((c, i) => (
            <MenuItem key={i} value={c._id}>
              {c.name}
            </MenuItem>
          ))}
      </Select>
    </>
  );
};
SelectConcentrate.propTypes = {
  onChange: PropTypes.func,
};

const DosingPump = ({ unitId, pump, onChange }) => {
  const {
    _id,
    name,
    factor: factorProp,
    flowRate: flowRateProp,
    maxFlowRate,
    minFlowRate,
    concentrate: concentrateId,
  } = pump;
  const { data: concentrate } = useGetConcentrateByIdQuery(concentrateId);
  const [flowRate, setFlowRate] = useState(flowRateProp);
  const [updatePump] = useUpdatePumpFromFertilizerUnitMutation();
  const [deletePump] = useRemovePumpFromFertilizerUnitMutation();
  const [sliderRate, setSliderRate] = useState(flowRateProp);
  const [factor, setFactor] = useState(factorProp || 1);
  const [del, setDel] = useState(false);
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const factors = [
    { factor: 1.0, name: "1x" },
    { factor: 0.5, name: "1/2x" },
    { factor: 0.33, name: "1/3x" },
    { factor: 0.25, name: "1/4x" },
    { factor: 0.2, name: "1/5x" },
    { factor: 0.1, name: "1/10x" },
  ];
  const changeFlowRate = (flowRate) => {
    setFlowRate(flowRate);
    updatePump({ id: unitId, pumpId: _id, body: { flowRate } });
  };
  const changeFactor = (e) => {
    const factor = e.target.value;
    setFactor(factor);
    updatePump({ id: unitId, pumpId: _id, body: { factor } });
  };

  const deletePumpHandler = () => {
    deletePump({ id: unitId, pumpId: _id });
    setDel(false);
  };

  const marks = useMemo(() => {
    const marks = [];
    for (let i = minFlowRate; i <= maxFlowRate; i += 1.0) {
      marks.push({ value: i, label: `${i.toFixed(0)}` });
    }
    return marks;
  }, [minFlowRate, maxFlowRate]);

  return (
    <Card>
      <CardHeader
        variant="h4"
        title={
          <>
            {name}
            <IconButton
              aria-label="delete"
              sx={{ float: "right", m: -2, p: 0.5 }}
              onClick={() => {
                setDel(true);
              }}
            >
              <DeleteIcon />
            </IconButton>
          </>
        }
        subheader={
          <SelectConcentrate
            concentrate={concentrateId}
            onChange={(changes) => {
              updatePump({ id: unitId, pumpId: _id, body: changes });
            }}
          />
        }
        onDoubleClick={(e) => {
          e.preventDefault();
          setOpen(true);
          setAnchorEl(e.target);
        }}
      ></CardHeader>
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Slider
          orientation="vertical"
          sx={{ height: 200, mb: "1rem" }}
          min={minFlowRate || 0.4}
          marks={marks}
          max={maxFlowRate || 4.0}
          step={0.1}
          value={sliderRate}
          onChangeCommitted={(_, value) => {
            setSliderRate(value);
            changeFlowRate(value);
          }}
        />

        <Typography variant="h4" color="yellowgreen" display={"block"}>
          {sliderRate}
        </Typography>
        <Select value={factor} onChange={changeFactor}>
          {factors.map((f, i) => (
            <MenuItem key={i} value={f.factor}>
              {f.name}
            </MenuItem>
          ))}
        </Select>
        <AreYouSure
          show={del}
          onCancel={() => {
            setDel(false);
          }}
          onConfirm={deletePumpHandler}
          message="Are you sure you want to delete this pump?"
        />
      </CardContent>
      <InputPopper
        label="Name"
        anchorEl={anchorEl}
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        onChange={(value) => {
          updatePump({ id: unitId, pumpId: _id, body: { name: value } });
        }}
      />
    </Card>
  );
};
DosingPump.propTypes = {
  pump: PropTypes.object.isRequired,
  onChange: PropTypes.func,
};

const FertigationUnit = ({ unit }) => {
  const [updatePump] = useUpdatePumpFromFertilizerUnitMutation();
  const [deleteFertilizerUnit] = useDeleteFertilizerUnitMutation();
  const [updateUnit] = useUpdateFertilizerUnitMutation();
  const { _id, name, pumps, recipe, water, solution } = unit;

  const editPumpHandler = (id, changes) => {
    updatePump({ id: _id, pumpId: id, body: changes });
  };
  const onRecipeChange = (changes) => {
    updateUnit({ id: _id, body: changes });
  };

  const [open, setOpen] = useState(false);
  return (
    <Card>
      <CardHeader variant="h4" title={name} />
      <CardContent>
        <Box>
          {recipe && (
            <>
              <SelectRecipe
                recipe={recipe}
                onChange={(changes) => {
                  onRecipeChange(changes);
                }}
              />

              <RecipeTable recipe={recipe} content={solution?.elements || []} />
            </>
          )}
          {water && <Typography variant="h6">Water: {water.name}L</Typography>}
          {solution.kationes && solution.aniones && (
            <Ballance kationes={solution.kationes} aniones={solution.aniones} />
          )}
          <Stack direction="row" margin={2} spacing={2}>
            {pumps?.length > 0 &&
              pumps.map((pump, i) => (
                <DosingPump
                  key={i}
                  pump={pump}
                  unitId={_id}
                  onChange={(changes) => {
                    editPumpHandler(pump._id, changes);
                  }}
                />
              ))}
          </Stack>
          <Table
            sx={{
              width: "auto",
            }}
          >
            <TableHead>
              <TableRow>
                {solution?.length > 0 &&
                  solution.map((element, i) => (
                    <TableCell key={i}>{element.name}</TableCell>
                  ))}
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                {solution?.length > 0 &&
                  solution.map((element, i) => (
                    <TableCell key={i}>
                      {element.concentration.toFixed(1)}
                    </TableCell>
                  ))}
              </TableRow>
            </TableBody>
          </Table>
          {/* <ElementsTable solution={solution}/> */}
        </Box>
      </CardContent>
      <CardActions>
        <Button
          onClick={() => {
            setOpen(true);
          }}
        >
          Add Pump
        </Button>
        <Button
          onClick={() => {
            deleteFertilizerUnit(_id);
          }}
        >
          Remove Unit
        </Button>
        <AddPumpToUnitDialog
          open={open}
          onClose={() => {
            setOpen(false);
          }}
          unit={unit._id}
        />
      </CardActions>
    </Card>
  );
};
FertigationUnit.propTypes = {
  unit: PropTypes.object.isRequired,
};

export default function FertigationUnitList() {
  const {
    isLoading,
    isError,
    error,
    data: units,
  } = useGetFertilizerUnitsQuery();
  const [open, setOpen] = useState(false);
  return (
    <Box>
      {isLoading && <CircularProgress />}
      {isError && <Alert severity="error">{error.message}</Alert>}
      <Stack direction="column" margin={2} spacing={2} justifyContent="center">
        {units?.length > 0 &&
          units.map((unit, i) => <FertigationUnit key={i} unit={unit} />)}
      </Stack>
      <Button onClick={() => setOpen(true)}>Add Fertigation Unit</Button>
      <AddFertigationUnitDialog open={open} onClose={() => setOpen(false)} />
    </Box>
  );
}
