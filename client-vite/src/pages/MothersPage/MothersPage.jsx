import { Box,Typography ,Alert, CircularProgress, Stack, Grid} from "@mui/material";
import { MotherCard } from "./MotherCard/MotherCard";
import { useGetPlantsQuery } from "../../store/plantsApi";
export const MothersPage = () => {
  const {isLoading,isError,error,data}=useGetPlantsQuery({state:"MotherPlant"})
  return (
    <Box sx={{maxHeight:"100%"}}>
      <Typography variant="h3"> Mothers Page</Typography>
    
    {isError && <Alert severity="error">{error.message}</Alert>}
      {isLoading && <CircularProgress />}
      <Grid container spacing={1}>
      {data?.map((obj)=>{
        return (<MotherCard key ={obj._id}plant={obj}/>)
      })}
      
      </Grid>  
    </Box>
  );
};
