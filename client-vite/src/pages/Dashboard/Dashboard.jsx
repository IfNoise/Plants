import { Alert, Box, CircularProgress, Grid} from "@mui/material";

import { useGetDevicesQuery } from "../../store/deviceApi";
import DeviceCard from "../../components/DeviceCard";
import LightController from "../../components/LightController/LightController";
import { useEffect, useState,useContext } from "react";
import { AppBarContext } from "../../context/AppBarContext";

const Dashboard = () => {
  const { isLoading, isError, error, data, isFetching}=useGetDevicesQuery({refetchOnReconnect:true,
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true});
  const appBar = useContext(AppBarContext);
  const [devices, setDevices] = useState([]);
  useEffect(() => {
    appBar.setAppBar({ title: "Dashboard" });
  }, []);
  useEffect(() => {
    // Обновляем devices только если данные есть и это не перезагрузка существующих данных
    if (data && data.length > 0) {
      setDevices(data);
    }
    // Не сбрасываем devices при рефетче, сохраняем предыдущие данные
  }, [data]); 
  return (
    <Box >
      {isLoading && <CircularProgress /> }
      {isError && <Alert severity="error">{error}</Alert>}
      {data?.length === 0 && <Alert severity="info">No devices found</Alert>}
      <Grid container spacing={2}>
      {devices?.length>0 && devices.map((device) => (
        <Grid item key={device.id} xs={12} sm={12} md={10} lg={6} xl={2}>
        <DeviceCard key={device.id} device={device} />
        </Grid>
      ))}
      <Grid item xs={12} sm={12} md={10} lg={6} xl={2}>
        <LightController/>
      </Grid>
      </Grid>
    </Box>
  );
}
export default Dashboard;