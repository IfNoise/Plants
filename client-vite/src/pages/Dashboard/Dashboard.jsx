import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Typography,
} from "@mui/material";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";
import { useGetPlantCountsQuery } from "../../store/plantsApi";
import { useState } from "react";

const colors = [
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#0088FE",
];
const sizing = {
  margin: { right: 5 },
  width: 500,
  height: 500,
  legend: { hidden: false },
};

const Dashboard = () => {
  const { isSuccess, data: plants } = useGetPlantCountsQuery({
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
  });
  const [selectedState, setSelectedState] = useState([]);
  const getData = () => {
    console.log(plants);
    if (plants && plants?.length < 1) return [];
    return plants?.map((plant, id) => {
      return { label: plant._id, value: plant.count, color: colors[id] };
    });
  };
  const getFilteredData = () => {
    if (selectedState.length < 1) return getData();
    return getData().filter((item) => selectedState.indexOf(item.label) > -1);
  };
  const TOTAL = getFilteredData()
    ?.map((item) => item.value)
    .reduce((a, b) => a + b, 0);
  const states = getData()?.map((item) => item.label);
  const handleChange = (event) => {
    const state = event.target.name;
    if (selectedState.indexOf(state) > -1) {
      setSelectedState(selectedState.filter((item) => item !== state));
    } else {
      setSelectedState([...selectedState, state]);
    }
  };
  const getArcLabel = (params) => {
    const percent = params.value / TOTAL;
    return `${(percent * 100).toFixed(0)}%`;
  };
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <h1>Stat Page</h1>
      {isSuccess && plants.length>1 && (
        <>
          <Typography
            variant="h6"
            gutterBottom
            component="div"
          >{`Total: ${TOTAL}`}</Typography>
          {plants?.map((plant, index) => {
            <Typography key={index} variant="h6" gutterBottom component="div">
              {plant._id + ":" + plant.count}
            </Typography>;
          })}
          <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
            <FormLabel component="legend">Assign responsibility</FormLabel>
            <FormGroup>
              {states.map((state, index) => {
                return (
                  <FormControlLabel
                    key={index}
                    control={
                      <Checkbox
                        checked={selectedState.indexOf(state) > -1}
                        onChange={handleChange}
                        name={state}
                      />
                    }
                    label={state}
                  />
                );
              })}
            </FormGroup>
          </FormControl>

          <PieChart
            series={[
              {
                outerRadius: 200,
                data: getFilteredData(),
                arcLabel: getArcLabel,
              },
            ]}
            sx={{
              [`& .${pieArcLabelClasses.root}`]: {
                fill: "white",
                fontSize: 14,
              },
            }}
            {...sizing}
          />
        </>
      )}
    </Box>
  );
};

export default Dashboard;
