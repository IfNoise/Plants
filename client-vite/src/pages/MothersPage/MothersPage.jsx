import { Box,Typography ,Alert, CircularProgress} from "@mui/material";
import { MotherCard } from "./MotherCard/MotherCard";
import { useGetPlantsQuery } from "../../store/plantsApi";
export const MothersPage = () => {
  const {isLoading,isError,error,data}=useGetPlantsQuery({state:"MotherPlant"})
  const plantDetails = (id) => {
    navigate(`/plant/${id}`)
  };
  return (
    <div>
      <Typography variant="h3"> Mothers Page</Typography>
    <Box>
    {isError && <Alert severity="error">{error.message}</Alert>}
      {isLoading && <CircularProgress />}
      {data?.map((obj)=>{
        return (<MotherCard key ={obj._id}plant={obj}/>)
      })}
      
      </Box>  
    </div>
  );
};
