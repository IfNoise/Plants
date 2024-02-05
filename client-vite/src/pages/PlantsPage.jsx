import { Alert, CircularProgress} from "@mui/material";
import { useGetPlantsQuery } from "../store/plantsApi";
import {  useState } from "react";
import { FilterBar } from "../components/FilterBar/FilterBar";
import { PlantsList } from "../components/PlantsList/PlantsList";


export const PlantsPage = () => {
  const [filter, setFilter] = useState({})
  const { isLoading, isError, error, data:plants=[] } = useGetPlantsQuery(filter,{
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true
  });
  return (
    <>
      <FilterBar setOutputFilter={setFilter} />
      {isError && <Alert severity="error">{error.message}</Alert>}
      {isLoading && <CircularProgress />}
      {plants.length>0 &&<PlantsList plants={plants}
                  addAction
                  addToTray
                  print
      />}
    </>
  )
};
