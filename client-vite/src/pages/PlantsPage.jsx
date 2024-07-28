import { Alert, Box, CircularProgress, Typography} from "@mui/material";
import { useGetPlantsQuery} from "../store/plantsApi";
import { FilterBar } from "../components/FilterBar/FilterBar";
import { PlantsList } from "../components/PlantsList/PlantsList";
import { useSelector } from "react-redux";
import { useLocation} from "react-router-dom";
import { useDispatch } from "react-redux";
import { addGroup ,addAddress,clearFilter} from "../store/filterSlice";
import { useEffect } from "react";



export const PlantsPage = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const sFilter = useSelector((state) => state.filter);
  const params = new URLSearchParams(location.search);
  const pFilter = Object.fromEntries(params)

  const { isLoading, isError, error, data:plants,refetch} = useGetPlantsQuery(Object.entries(sFilter).length>0?{...sFilter}:{state:{$nin:["Stopped","Harvested"]}},{
    refetchOnReconnect:true,
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true
  });
  useEffect(() => {
    //dispatch(clearFilter());
    if(Object.keys(pFilter).length>0){
      dispatch(clearFilter());
    }
    
    Object.keys(pFilter).forEach((key) => {
      const value=pFilter[key]
      if(value==="undefined") return;
      if(key==="group"){
        dispatch(addGroup({key,value}))
      }
      if(key==="building"||key==="room"||key==="rack"||key==="shelf"||key==="tray"){
        dispatch(addAddress({...pFilter}))
      }
    })
    refetch();
    }
,[])
 
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
