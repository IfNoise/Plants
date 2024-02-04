import { useEffect } from "react";

import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Card, Alert, CircularProgress, Grid } from "@mui/material";
import { useParams } from "react-router-dom";
import { useState } from "react";

import { useGetPlantsQuery } from "../../store/plantsApi";
import PlantTimeline from "../../components/PlantTimeline/PlantTimeline";
import { NewActionButton } from "../../components/NewActionButton/NewActionButton";
import PlantSpeedDial from "../../components/PlantSpeedDial/PlantSpeedDial";

export const PlantDetailPage = () => {
  const id = useParams().id;

  const { isLoading, isError, error, data } = useGetPlantsQuery({ _id: id },{ refetchOnMountOrArgChange: true, refetchOnFocus: true }
    );

  const [plant, setPlant] = useState({});
  useEffect(() => {
    if (data) {
      setPlant(data[0]);
    }
  }, [data]);
  const getPlant = () => [plant];

  const { strain, pheno, gender, state, cloneCounter, actions } = plant;

  return (
    <Grid container>
      {isError && <Alert severity="error">{error.message}</Alert>}
      {isLoading && <CircularProgress />}
      {data && (
        <>
        <Grid item xs={12} sx={{display:'flex',justifyContent:'center'}}>
          <Card sx={{ width: "100%" }}>
            <CardContent>
              <Grid container>
                <Grid item xs={12} sx={{display:'flex',justifyContent:'center'}}> 
              <Typography gutterBottom variant="h4" component="div">
                {strain}
              </Typography>
              </Grid>
              <Grid item xs={12} sx={{display:'flex',justifyContent:'left'}}>
              <Typography gutterBottom variant="h7" component="div">
                {pheno}
              </Typography>
              </Grid>
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
              <Typography variant="body2" color="text.secondary">
                State: {state ?? "undefined"}
              </Typography>
              </Grid>

              {state === "MotherPlant" && 
                <Grid item xs={12} sx={{display:'flex',justifyContent:'left'}}>
                <Typography variant="caption" color="text.secondary">
                  Clones Counter:{cloneCounter ?? "0"}
                </Typography>
                </Grid>
              }
             </Grid> 
            </CardContent>
          </Card>
          </Grid>
          <Grid item xs={12} sx={{display:'flex',justifyContent:'center'}}>
          <PlantTimeline actions={actions} />
          </Grid>
          <Grid item xs={12} sx={{display:'flex',justifyContent:'center'}}>
          {state && <PlantSpeedDial
            getPlants={getPlant}
            addAction
            addToTray
            print
          />}
          </Grid>
        </>
      )}
    </Grid>
  );
};
