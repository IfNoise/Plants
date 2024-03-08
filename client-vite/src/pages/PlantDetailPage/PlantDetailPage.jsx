import { useEffect } from "react";

import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Card, Alert, CircularProgress, Grid } from "@mui/material";
import { useParams } from "react-router-dom";
import { useState } from "react";

import { useGetPlantsQuery } from "../../store/plantsApi";
import PlantTimeline from "../../components/PlantTimeline/PlantTimeline";
import PlantSpeedDial from "../../components/PlantSpeedDial/PlantSpeedDial";

export const PlantDetailPage = () => {
  const id = useParams().id;
  const [plant, setPlant] = useState({});
  const { isLoading, isError, error, data } = useGetPlantsQuery({ _id: id },{ refetchOnMountOrArgChange: true, refetchOnFocus: true }
    );
  const getPlant=()=>{
    if(data?.length<1) return []
    return [data[0]]
  };

  useEffect(() => {
    if (data?.length > 0) {
      setPlant(data[0]);
    }
  }, [data]);

  const {strain,pheno,gender,state,startDate,actions,cloneCounter,maxClones,} = plant;
  return (
    <Grid container>
      {isError && <Alert severity="error">{error.message}</Alert>}
      {isLoading && <CircularProgress />}
      {data?.length>0 && 
        <>
        <Grid item xs={12} sx={{display:'flex',justifyContent:'center'}}>
          <Card sx={{ width: "100%" }}>
            <CardContent>
              <Grid container>
                <Grid item xs={12} sx={{display:'flex',justifyContent:'center'}}> 
              <Typography gutterBottom variant="h4" component="div">
                {strain ?? "undefined"}
              </Typography>
              </Grid>
              <Grid item xs={12} sx={{display:'flex',justifyContent:'left'}}>
              <Typography variant="body2" color="text.secondary">
                Start Date: {new Date(startDate).toDateString() ?? "undefined"}
              </Typography>
              </Grid>
              <Grid item xs={12} sx={{display:'flex',justifyContent:'left'}}>
              <Typography gutterBottom variant="h7" component="div">
                {pheno ?? "undefined"}
              </Typography>
              </Grid>
              {/* <Grid item xs={12} sx={{display:'flex',justifyContent:'left'}}>
              <Typography gutterBottom variant="h7" component="div">
                {currentAddress?.bulding ?? "undefined"}
                {currentAddress?.room ?? "undefined"}
                {currentAddress?.row ?? "undefined"}
                {currentAddress?.tray ?? "undefined"}
                {currentAddress?.number ?? "undefined"}
              </Typography>
              </Grid> */}
              <Grid item xs={12} sx={{display:'flex',justifyContent:'left'}}>
              <Typography
                gutterBottom
                variant="h7"
                sx={{ color: "green" }}
                component="div"
              >
                Gender: {gender ?? "undefined"}
              </Typography>
              </Grid>
              <Grid item xs={12} sx={{display:'flex',justifyContent:'left'}}>
              <Typography variant="h5" color="text.secondary">
                State: {state ?? "undefined"}
              </Typography>
              </Grid>

              {state === "MotherPlant" && 
              <>
                <Grid item xs={12} sx={{display:'flex',justifyContent:'left'}}>
                <Typography variant="caption" color="text.secondary">
                  Clones Counter:{cloneCounter ?? "0"}
                </Typography>
                </Grid>
                <Grid item xs={12} sx={{display:'flex',justifyContent:'left'}}>
                <Typography variant="caption" color="text.secondary">
                  Max Clones yeld:{maxClones ?? "0"} clones
                </Typography>
                </Grid>
                </>
              }
             </Grid> 
            </CardContent>
          </Card>
          </Grid>
          <Grid item xs={12} sx={{display:'flex',justifyContent:'center'}}>
          <PlantTimeline actions={actions ?? []} />
          </Grid>
          <Grid item xs={12} sx={{display:'flex',justifyContent:'center'}}>
          <PlantSpeedDial
            getPlants={getPlant}
            addAction
            addToTray
            print
          />
          </Grid>
        </>
      }
    </Grid>
  );
};
