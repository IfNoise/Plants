import { Alert, CircularProgress} from "@mui/material";
import { PlantsList } from "../components/PlantsList/PlantsList";
import { useGetTrayQuery } from "../store/trayApi";

export const TrayPage = () => {
  const {
    isLoading: isLoading,
    isError: isError,
    error,
    data,
  } = useGetTrayQuery({
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
  });

  return (
    <>
      {isError && <Alert severity="error">{error.message}</Alert>}
      {isLoading && <CircularProgress />}
      {data?.tray && (
        <PlantsList
          plants={data?.tray}
          show
          addAction
          addToTray
          printTray
          print
          clearTray
        />
      )}
    </>
  );
};
