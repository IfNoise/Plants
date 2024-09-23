import { useEffect, useMemo, useState } from "react";
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

} from "@mui/material";

import DeleteIcon from '@mui/icons-material/Delete';
import PropTypes from "prop-types";
import { AddPumpToUnitDialog, AddFertigationUnitDialog } from "./Helpers";
import { elements } from "../../config/config";
import { useDeleteFertilizerUnitMutation, useGetAllConcentratesQuery, useGetAllFertilizersQuery, useGetConcentrateByIdQuery, useGetFertilizerUnitsQuery, useRemovePumpFromFertilizerUnitMutation, useUpdatePumpFromFertilizerUnitMutation } from "../../store/feedingApi";
import AreYouSure from "../AreYouSure";
import { set } from "mongoose";
const units=[
  "ppm",
  "mM",
  "%w/v"
]

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




const DosingPump = ({ unitId,pump, onChange }) => {
  const { _id,name,factor:factorProp , flowRate: flowRateProp,concentrate:concentrateId} = pump;
  const {data:concentrate}=useGetConcentrateByIdQuery(concentrateId);
  const [flowRate, setFlowRate] = useState(flowRateProp);
  const [deletePump]=useRemovePumpFromFertilizerUnitMutation();
  const [sliderRate,setSliderRate]=useState(flowRateProp);
  const [factor, setFactor] = useState(factorProp||1);
  const [del, setDel] = useState(false);
  const factors =[
    {factor:1.0,name:"1x"},
    {factor:0.5,name:"1/2x"},
    {factor:0.33,name:"1/3x"},
    {factor:0.25,name:"1/4x"},
    {factor:0.2,name:"1/5x"},
    {factor:0.1,name:"1/10x"},
  ]
  const changeFlowRate = (flowRate) => {
    setFlowRate(flowRate);
    if (onChange) onChange({flowRate});
  };
  const changeFactor = (e) => {
    const factor = e.target.value;
    setFactor(factor);
    if (onChange) onChange({factor});
  };

  const deletePumpHandler = () => {
    deletePump({id:unitId,pumpId:_id});
    setDel(false);
  };

  const marks = [
    {
      value: 0.4,
      label: "0.4",
    },
    {
      value: 1.0,
      label: "1.0",
    },
    {
      value: 2.0,
      label: "2.0",
    },
    {
      value: 3.0,
      label: "3.0",
    },
    {
      value: 4.0,
      label: "4.0",
    },
  ];

  return (
    <Card>
      <CardHeader variant="h4" title={<>
        {name}
        <IconButton
          aria-label="delete"
          sx={{ float: "right",m:-2,p:0.5 }}
          onClick={() => {setDel(true)}}
        >
          <DeleteIcon/>
        </IconButton>
        </>}
        subheader={concentrate?.name}
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
          sx={{ height: 200,mb:"1rem" }}
          min={0.4}
          marks={marks}
          max={4.0}
          step={0.1}
          value={sliderRate}
          onChange={(_, value) => {
            setSliderRate(value);
            changeFlowRate(value);
          }}
        />

        <Typography variant="h4" color="yellowgreen" display={"block"} >{sliderRate}</Typography>
          <Select
            value={factor}
            onChange={changeFactor}
          >
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
    </Card>
  );
};
DosingPump.propTypes = {
  pump: PropTypes.object.isRequired,
  onChange: PropTypes.func,
};

const FertigationUnit = ({ unit }) => {
  const {data:fertilizers}=useGetAllFertilizersQuery();
  const {data:concentrateList} = useGetAllFertilizersQuery();
  const [updatePump]=useUpdatePumpFromFertilizerUnitMutation();
  const [deleteFertilizerUnit]=useDeleteFertilizerUnitMutation(); 
  const { _id,name,concentrates,pumps} = unit;
  const [solution, setSolution] = useState([]);
  const coefficients = elements.map((element) => element.content).flat();
  useMemo(() => {
    if (pumps?.length > 0 && concentrates?.length > 0) {
      const solution = pumps
        .map((pump) => {
          if (pump.concentrate === null) return [];
          const concentrate = concentrateList.find(
            (c) => c.name === pump.concentrate
          );
          if (!concentrate) return;
          return concentrate.content.map((fertilizer) => {
            return {
              name: fertilizer.name,
              concentration: (
                (fertilizer.concentration * pump.flowRate*pump.factor) /
                10
              ).toFixed(3),
            };
          });
        })
        .flat()
        .map((fertilizer) => {
          const frt = fertilizers.find((f) => f.name === fertilizer.name);
          return {
            name: fertilizer.name,
            concentration: fertilizer.concentration,
            elements: frt.content,
          };
        })
        .map((f) => {
          return f.elements.map((element) => {
            return {
              name: element.name,
              concentration: (element.concentration * f.concentration),
            };
          });
        })
        .flat()
        .map((element) => {
          return {
            id:
              elements.find((e) => element.name?.startsWith(e.code))?.id ||
              element.id,
            name:
              elements.find((e) => element.name?.startsWith(e.code))?.code ||
              element.name,
            concentration:
              element.concentration *
              coefficients.find((c) => element.name === c.element).coef,
          };
        })
        .sort((a, b) => a.id - b.id)
        .reduce((acc, element) => {
          const existing = acc.find((e) => e.name === element.name);
          if (existing) {
            existing.concentration += element.concentration;
          } else {
            acc.push(element);
          }
          return acc;
        }, []);

      setSolution(solution);
    }
  }, [pumps, concentrateList, fertilizers]);


  const editPumpHandler = (id,changes) => {
    updatePump({id:_id,pumpId:id,body:changes});
  };

  const [open, setOpen] = useState(false);
  return (
    <Card>
      <CardHeader variant="h4" title={name}/>
      <CardContent>
        <Box>
        <Typography variant="h4">Solution</Typography>
        <Stack
        direction="row"
        margin={2}
        spacing={2}

        
        >
        {pumps?.length > 0 &&
          pumps.map((pump, i) => (
            <DosingPump
              key={i}
              pump={pump}
              unitId={_id}
              onChange={(changes) => {
                editPumpHandler(pump._id,changes);
              }}
            />
          ))}
      </Stack>
      <Table 
        sx={{
          width:"auto",
        }}
      >
        <TableHead 
        
        >
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

}
FertigationUnit.propTypes = {
  unit: PropTypes.object.isRequired,  
};

export default function FertigationUnitList() {
  const {isLoading,isError,error,data:units}=useGetFertilizerUnitsQuery();
  const [open, setOpen] = useState(false);
  return (
    <Box>
      {isLoading && <CircularProgress />}
      {isError && <Alert severity="error">{error.message}</Alert>}
      <Stack
        direction="column"
        margin={2}
        spacing={2}
        justifyContent="center"
      >
      {units?.length > 0 &&
        units.map((unit, i) => <FertigationUnit key={i} unit={unit} />)}
      </Stack>
      <Button onClick={() => setOpen(true)}>Add Fertigation Unit</Button>
      <AddFertigationUnitDialog
        open={open}
        onClose={() => setOpen(false)}
      />

    </Box>
  );
}
