import { Alert, CircularProgress} from "@mui/material";
import { PlantsList } from "../components/PlantsList/PlantsList";
import { useGetTrayQuery } from "../store/trayApi";

export const TrayPage = () => {
  const {
    isLoading,
    isError,
    error,
    data,
  } = useGetTrayQuery({ 
    refetchOnMountOrArgChange: true, 
    refetchOnFocus: true ,
  });

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
