import { Box } from '@mui/material';
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';
import { useGetPlantCountsQuery } from "../../store/plantsApi";

const colors = [ '#00C49F', '#FFBB28', '#FF8042', '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#0088FE'];
const sizing = {
  margin: { right: 5 },
  width: 500,
  height: 500,
  legend: { hidden: false },
};



const Dashboard = () => {
  const {isSuccess, data: plants } = useGetPlantCountsQuery({ refetchOnMountOrArgChange: true, refetchOnFocus: true });
  const getData = () =>{
    console.log(plants);
    if(plants?.length<1)return [];
     return plants?.filter((plant)=>(plant._id!=="Stopped"))?.map((plant,id) =>{
    return {label: plant._id, value: plant.count,color:colors[id]}
  })}; 
const TOTAL = getData()?.map((item) => item.value).reduce((a, b) => a + b, 0);

const getArcLabel = (params) => {
  const percent = params.value / TOTAL;
  return `${(percent * 100).toFixed(0)}%`;
}
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}>
      <h1>Stat Page</h1>
      {isSuccess && 
      <PieChart 
            series={[
              {
                outerRadius: 200,
                data:getData(),
                arcLabel: getArcLabel,
              },
            ]}
            sx={{
              [`& .${pieArcLabelClasses.root}`]: {
                fill: 'white',
                fontSize: 14,
              },
            }}
            {...sizing}
      
      />}
      </Box>
  );
};

export default Dashboard;
