import { Alert, Box, CircularProgress, Typography} from "@mui/material";
import { useGetPlantsQuery } from "../store/plantsApi";
import { FilterBar } from "../components/FilterBar/FilterBar";
import { PlantsList } from "../components/PlantsList/PlantsList";
import { useSelector } from "react-redux";

export const PlantsPage = () => {
  const filter = useSelector((state) => state.filter);

  const { isLoading, isError, error, data:plants } = useGetPlantsQuery(filter,{
    refetchOnReconnect:true,
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true
  });
  const getData = () => plants.map((plant) => plant);
  return (
    <Box sx={{display:"flex"}}>
      
      {isError && <Alert severity="error">{error.message}</Alert>}
      {isLoading && <CircularProgress />}
      {plants &&
      <>
      <Box sx={{position:"fixed"}} >
      <FilterBar getData={getData} />
      <Typography variant="h6" component="h1" gutterBottom>{plants.length} Plants</Typography>

      <PlantsList plants={plants}
                  show
                  addAction
                  addToTray
                  print
      />
      </Box></>}
    </Box>
  )
};
