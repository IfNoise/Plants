import { Alert, Box, CircularProgress, Grid, Stack } from "@mui/material";

import { useGetDevicesQuery } from "../../store/deviceApi";
import DeviceCard from "../../components/DeviceCard";

const Dashboard = () => {
  const { isLoading, isError, error, data,refetch }=useGetDevicesQuery({refetchOnReconnect:true,
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true});
  if (data?.length === 0) {
    return <Alert severity="info">No devices found{error}</Alert>;
  }
  return (
    <Box >
      {!data && <CircularProgress /> }
      {data?.length === 0 && <Alert severity="info">No devices found</Alert>}
      <Grid container spacing={2}>
      {data && data.map((device) => (
        <Grid item key={device.id} xs={12} sm={12} md={10} lg={6} xl={2}>
        <DeviceCard key={device.id} device={device} />
        </Grid>
      ))}
      </Grid>
    </Box>
  );
}
export default Dashboard;