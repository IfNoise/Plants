import { Alert, Box, CircularProgress, Typography} from "@mui/material";
import { useGetPlantsQuery} from "../store/plantsApi";
import { FilterBar } from "../components/FilterBar/FilterBar";
import { PlantsList } from "../components/PlantsList/PlantsList";
import { useSelector } from "react-redux";
import { useLocation} from "react-router-dom";
import { useDispatch } from "react-redux";
import { addGroup ,clearFilter} from "../store/filterSlice";
import { useEffect } from "react";
import { addBuilding, addRack, addRoom, addRow, addShelf, addTray } from "../store/newActionSlice";



export const PlantsPage = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const sFilter = useSelector((state) => state.filter);
  const params = new URLSearchParams(location.search);
  console.log(params);

  const pFilter = Object.fromEntries(params)
  console.log(pFilter);

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
      switch(key){
        case "building":
          dispatch(addBuilding(value));
          break;
        case "room":
          dispatch(addRoom(value));
          break;
        case "row":
          dispatch(addRow(value));
          break;
        case "rack":
          dispatch(addRack(value));
          break;
        case "tray":
          dispatch(addTray(value));
          break;
        case "shelf":
          dispatch(addShelf(value));
          break;
        case "group":
          dispatch(addGroup(value));
          break;
        default:
          break;
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
