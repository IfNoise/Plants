import { Alert, CircularProgress} from "@mui/material";
import {  useState } from "react";
import { FilterBar } from "../components/FilterBar/FilterBar";
import { PlantsList } from "../components/PlantsList/PlantsList";
import { useGetTrayQuery } from "../store/trayApi";


export const TrayPage = () => {
  const [filter, setFilter] = useState({})
  const { isLoading:isLoading, isError:isError,error, data} = useGetTrayQuery({refetchOnMountOrArgChange: true,
    refetchOnFocus: true});

  
  return (
    <>
      <FilterBar setOutputFilter={setFilter} />
      {isError && <Alert severity="error">{error.message}</Alert>}
      {isLoading && <CircularProgress />}
      {data?.tray&&<PlantsList plants={data?.tray} />}
    </>
  )
};
