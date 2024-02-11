import { Alert, CircularProgress} from "@mui/material";
import { useGetPlantsQuery } from "../store/plantsApi";
import {  useState } from "react";
import { FilterBar } from "../components/FilterBar/FilterBar";
import { PlantsList } from "../components/PlantsList/PlantsList";


export const PlantsPage = () => {
  const [filter, setFilter] = useState({})
  const { isLoading, isError, error, data:plants } = useGetPlantsQuery(filter,{
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true
  });
  const getData = () => plants.map((plant) => plant);
  return (
    <>
      
      {isError && <Alert severity="error">{error.message}</Alert>}
      {isLoading && <CircularProgress />}
      {plants?.length>0 &&
      <>
      <FilterBar setOutputFilter={setFilter} getData={getData} />
      <PlantsList plants={plants}
                  addAction
                  addToTray
                  print
      /></>}
    </>
  )
};
