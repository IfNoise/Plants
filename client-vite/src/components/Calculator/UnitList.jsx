import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
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

} from "@mui/material";
import PropTypes from "prop-types";
import { AddConcentrateToUnitDialog, AddFertigationUnitDialog } from "./Helpers";
import { elements } from "../../config/config";
import { addPumpToUnit,editPump,removeFertilizerUnit } from "../../store/nutrientsSlice";




const DosingPump = ({ pump, onChange }) => {
  const { name, flowRate: flowRateProp} = pump;
  const [flowRate, setFlowRate] = useState(flowRateProp);
  const changeFlowRate = (flowRate) => {
    setFlowRate(flowRate);
    if (onChange) onChange(flowRate);
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
      <CardHeader variant="h4" title={name}></CardHeader>
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
          value={flowRate}
          onChange={(_, value) => {
            changeFlowRate(value);
          }}
        />

        <Typography variant="h4" color="yellowgreen" display={"block"} >{flowRate}</Typography>

      </CardContent>
    </Card>
  );
};
DosingPump.propTypes = {
  pump: PropTypes.object.isRequired,
  onChange: PropTypes.func,
};

const FertigationUnit = ({ unit }) => {
  const units = useSelector((state) => state.nutrients.fertilizerUnits);
  const fertilizers = useSelector((state) => state.nutrients.fertilizers);
  const concentrateList = useSelector((state) => state.nutrients.concentrates);
  const { name,concentrates,pumps} = units.find((u) => u.name === unit);
  const [solution, setSolution] = useState([]);
  const coefficients = elements.map((element) => element.content).flat();
  const dispatch = useDispatch();

  useEffect(() => {
    if(pumps.length===0){
      concentrates.forEach((concentrate,id) => {
        const pump = { id,name: concentrate, flowRate: 0.4, concentrate: concentrate };
        dispatch(addPumpToUnit({ unit: name, pump }));
      }
      );
    }else if(pumps.length<concentrates.length){
      concentrates.forEach((concentrate,id) => {
        if(!pumps.find((p)=>p.name===concentrate)){
          const pump = { id,name: concentrate, flowRate: 0.4, concentrate: concentrate };
          dispatch(addPumpToUnit({ unit: name, pump }));
        }
      }
      );
    }
  }, [pumps,concentrates]);

 
  useEffect(() => {
    
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
              (fertilizer.concentration * pump.flowRate) /
              100
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
            concentration: (element.concentration * f.concentration*10).toFixed(1),
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

    setSolution(solution);}
  }, [pumps, concentrateList, fertilizers]);

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
              onChange={(flowRate) => {
                dispatch(editPump({ unit: name, pumpIdx: i, flowRate }));
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
           </Box>
      </CardContent>
      <CardActions>
        <Button 
          onClick={() => {
            setOpen(true);
          }}
        >
          Add Concentrate
        </Button>
        <Button
          onClick={() => {
            dispatch(removeFertilizerUnit(name));
          }}
        >
          Remove Unit
        </Button>
        <AddConcentrateToUnitDialog
          open={open}
          onClose={() => {
            setOpen(false);
          }}
          unit={unit}
        
        />
      </CardActions>
    </Card>
  );

}
FertigationUnit.propTypes = {
  unit: PropTypes.string.isRequired,
};

export default function FertigationUnitList() {
  const units = useSelector((state) => state.nutrients.fertilizerUnits);
  const [open, setOpen] = useState(false);
  return (
    <Box>
      <Stack
        direction="column"
        margin={2}
        spacing={2}
        justifyContent="center"
      >
      {units?.length > 0 &&
        units.map((unit, i) => <FertigationUnit key={i} unit={unit.name} />)}
      </Stack>
      <Button onClick={() => setOpen(true)}>Add Fertigation Unit</Button>
      <AddFertigationUnitDialog
        open={open}
        onClose={() => setOpen(false)}
      />

    </Box>
  );
}
