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
  const { isLoading, isError, error, data } = useGetPlantsQuery(
    { _id: id },
    { refetchOnMountOrArgChange: true, refetchOnFocus: true }
  );
  const getPlant = () => {
    if (data?.length < 1) return [];
    return [data[0]];
  };

  useEffect(() => {
    if (data?.length > 0) {
      setPlant(data[0]);
    }
  }, [data]);

  const {
    strain,
    pheno,
    gender,
    state,
    actions,
    cloneCounter,
    maxClones,
  } = plant;
  const startDate =new Date(actions.find((action) => action.type === "Start")?.date);
  const plantAge=Math.floor((new Date()-new Date(startDate))/86400000);
  const now=new Date();
  const vegStartDate = new Date(actions.find((action)=>action.type==="Picking"&&action.potSize==="1 L")?.date);
  const bloomStartDate = new Date(actions.find((action)=>action.type==="Blooming")?.date)
  const harvestDate = new Date(actions.find((action)=>action.type==="Harvest")?.date)  
  const cloningStage =state==="Cloning"? Math.floor((now-startDate)/86400000): Math.floor((vegStartDate-startDate)/86400000);
  const vegStage = state ==="Growing" ? Math.floor((now-vegStartDate)/86400000) : state==="Blooming"?Math.floor((bloomStartDate-vegStartDate)/86400000):0;
  const bloomStage = state==="Blooming"? Math.floor((now-bloomStartDate)/86400000):state==="Harvest"?Math.floor((now-harvestDate)/86400000):0;
  return (
    <Grid container>
      {isError && <Alert severity="error">{error.message}</Alert>}
      {isLoading && <CircularProgress />}
      {data?.length > 0 && (
        <>
          <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
            <Card sx={{ width: "100%" }}>
              <CardContent>
                <Grid container>
                  <Grid
                    item
                    xs={12}
                    sx={{ display: "flex", justifyContent: "center" }}
                  >
                    <Typography gutterBottom variant="h4">
                      {strain ?? "undefined"}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sx={{ display: "flex", justifyContent: "center" }}
                  >
                    <Typography variant="h6" color="text.secondary">
                      {plantAge} days old
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sx={{ display: "flex", justifyContent: "left" }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Start Date:{" "}
                      {new Date(startDate).toDateString() ?? "undefined"}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sx={{ display: "flex", justifyContent: "left" }}
                  >
                    <Typography gutterBottom variant="h7">
                      {pheno ?? "undefined"}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sx={{ display: "flex", justifyContent: "left" }}
                  >
                    <Typography
                      gutterBottom
                      variant="h7"
                      sx={{ color: "green" }}
                    >
                      Gender: {gender ?? "undefined"}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sx={{ display: "flex", justifyContent: "left" }}
                  >
                    <Typography variant="h5" color="text.secondary">
                      State: {state ?? "undefined"}
                    </Typography>
                  </Grid>
                  {state === "Cloning" && (
                    
                    <Grid
                      item
                      xs={12}
                      sx={{ display: "flex", justifyContent: "left" }}
                    > 
                      <Typography variant="caption" color="text.secondary">
                        Cloning Stage: {cloningStage} days
                      </Typography>
                    </Grid>
                  )}
                  {state === "Growing" && (
                    <>
                    <Grid
                      item
                      xs={12}
                      sx={{ display: "flex", justifyContent: "left" }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        Cloning Stage: {cloningStage} days
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sx={{ display: "flex", justifyContent: "left" }}
                    >
                      <Typography variant="caption" color="text.secondary">
                      Cloning Stage: {cloningStage} days Veg Stage: {vegStage} days
                      </Typography>
                    </Grid>
                    </>
                  )}
                  {state === "Blooming" && (
            
                    <Grid
                      item
                      xs={12}
                      sx={{ display: "flex", justifyContent: "left" }}
                    >
                      <Typography variant="body" color="text.secondary">
                      Cloning Stage: {cloningStage}days    Veg Stage: {vegStage}days    Bloom Stage: {bloomStage} days
                      </Typography>
                    </Grid>
                
                  )}
                  {state === "MotherPlant" && (
                    <>
                      <Grid
                        item
                        xs={12}
                        sx={{ display: "flex", justifyContent: "left" }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          Clones Counter:{cloneCounter ?? "0"}
                        </Typography>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sx={{ display: "flex", justifyContent: "left" }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          Max Clones yeld:{maxClones ?? "0"} clones
                        </Typography>
                      </Grid>
                    </>
                  )}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
            <PlantTimeline actions={actions ?? []} />
          </Grid>
          <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
            <PlantSpeedDial getPlants={getPlant} addAction addToTray print />
          </Grid>
        </>
      )}
    </Grid>
  );
};
