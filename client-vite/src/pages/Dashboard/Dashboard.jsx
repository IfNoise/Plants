import { Alert, Box, CircularProgress, Stack } from "@mui/material";

import { useGetDevicesQuery } from "../../store/deviceApi";
import DeviceCard from "../../components/DeviceCard";

const Dashboard = () => {
  const { isLoading, isError, error, data,refetch }=useGetDevicesQuery({refetchOnReconnect:true,
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true});
  if (data?.length === 0) {
    return <Alert severity="info">No devices found</Alert>;
  }
  return (
    <Box >
      {!data && <CircularProgress /> }
      {data?.length === 0 && <Alert severity="info">No devices found</Alert>}
      <Stack direction="row" useFlexGap flexWrap="wrap" spacing={2}>
      {data && data.map((device) => (
        <DeviceCard key={device.id} device={device} />
      ))}
      </Stack>
    </Box>
  );
}
export default Dashboard;