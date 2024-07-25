import { Alert, CircularProgress} from "@mui/material";
import { PlantsList } from "../components/PlantsList/PlantsList";
import { useGetTrayQuery } from "../store/trayApi";
import { useEffect } from "react";

export const TrayPage = () => {
  const {
    isLoading,
    isError,
    error,
    data,
    refetch
    
  } = useGetTrayQuery({ 
    refetchOnMountOrArgChange: true, 
    refetchOnFocus: true ,
    refetchOnReconnect:true,
    refetchOnMount:true
  });
  useEffect(() => {
    refetch();
  }
  , [refetch]);
  return (
    <>
      {isError && <Alert severity="error">{error?.message||'error'}</Alert>}
      {isLoading && <CircularProgress />}
      {data?.length>0 &&
        <PlantsList
          plants={data}
          show
          addAction
          addToTray
          printTray
          print
          clearTray
        />
      }
    </>
  );
};
