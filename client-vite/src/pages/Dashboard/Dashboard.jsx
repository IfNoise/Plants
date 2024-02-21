import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  Typography,
  useMediaQuery,
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

const Dashboard = () => {
  const { isSuccess, data: plants } = useGetPlantCountsQuery({
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
  });
  const isSmall = useMediaQuery((theme) => theme.breakpoints.down("md"));

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
  const sizing = {
    margin: { right: 5 },
    width: isSmall ? 300 : 600,
    height: isSmall ? 400 : 700,
    legend: { hidden: false },
  };

  return (
    <Box
    // sx={{
    //   display: "flex"
    // }}
    >
      <Typography variant="h4" gutterBottom component="div">
        Dashboard
      </Typography>
      {isSuccess && plants.length > 1 && (
        <>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: "block" }}>
                <Typography variant="h6" gutterBottom component="div">
                  Total: {TOTAL}
                </Typography>
                {getData().map((plant, index) => {
                  return (
                    <Typography
                      key={index}
                      variant="h6"
                      component={"div"}
                    >
                      {plant.label + ": " + plant.value}
                    </Typography>
                  );
                })}
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <PieChart
                series={[
                  {
                    outerRadius: isSmall ? 100 : 200,
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
            </Grid>
            <Grid item xs={12} sm={6} md={12}>
              <FormControl
                sx={{ m: 3,display:"flex", width: "100% "}}
                fullWidth
                small
                component="div"
                divariant="outlined"
              >
                <FormLabel component="legend">States</FormLabel>
                <FormGroup row>
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
            </Grid>
            
          </Grid>
        </>
      )}
    </Box>
  );
};

export default Dashboard;
