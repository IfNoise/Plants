import { Box } from '@mui/material';
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';


import { useGetPlantsQuery } from "../../store/plantsApi";
const Dashboard = () => {
  const { data: plants } = useGetPlantsQuery({}, { refetchOnMountOrArgChange: true, refetchOnFocus: true });
 
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}>
      <h1>Stat Page</h1>
      <PieChart />
      </Box>
  );
};

export default Dashboard;
