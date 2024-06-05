import { Alert, Box, CircularProgress, Typography} from "@mui/material";
import { useGetPlantsQuery} from "../store/plantsApi";
import { FilterBar } from "../components/FilterBar/FilterBar";
import { PlantsList } from "../components/PlantsList/PlantsList";
import { useSelector } from "react-redux";
import { useLocation} from "react-router-dom";
import { useDispatch } from "react-redux";
import { addGroup } from "../store/filterSlice";
import { useEffect } from "react";



export const PlantsPage = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const sFilter = useSelector((state) => state.filter);
  const params = new URLSearchParams(location.search);
  console.log(params);

  const pFilter = Object.fromEntries(params)
  console.log(pFilter);

  const { isLoading, isError, error, data:plants } = useGetPlantsQuery(sFilter,{
    refetchOnReconnect:true,
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true
  });
  useEffect(() => {
    if (pFilter['group']) {
      dispatch(addGroup(pFilter['group']));
    }
  },[])
 
  const getData = () => plants.map((plant) => plant);
  return (
    <Box >
      
      {isError && <Alert severity="error">{error.message}</Alert>}
      {isLoading && <CircularProgress />}
      {plants &&
      <>
      <Box sx={{}} >
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
