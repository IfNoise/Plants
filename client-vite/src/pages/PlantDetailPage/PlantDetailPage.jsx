import { useEffect } from "react";

import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Card, Alert, CircularProgress, Grid, Link } from "@mui/material";
import { useParams } from "react-router-dom";
import { useState } from "react";
import FemaleIcon from "@mui/icons-material/Female";
import MaleIcon from "@mui/icons-material/Male";

import { useGetPlantsQuery } from "../../store/plantsApi";
import PlantTimeline from "../../components/PlantTimeline/PlantTimeline";
import PlantSpeedDial from "../../components/PlantSpeedDial/PlantSpeedDial";
import propsTypes from "prop-types";
import { useContext } from "react";
import { AppBarContext } from "../../context/AppBarContext";
import Scanner from "../../components/Scanner/Scanner";
import { TrayButton } from "../../components/TrayButton/TrayButton";

const PlantGroup = ({ group }) => {
  const params = new URLSearchParams({ group });
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "green",
        color: "white",
        borderRadius: "5px",
        padding: "5px",
        margin: "5px",
      }}
    >
      {group && (
        <Link sx={{ color: "white" }} href={`/plants?${params}`}>
          Group
        </Link>
      )}
      {!group && (
        <Typography variant="caption" color="text.secondary">
          No Group
        </Typography>
      )}
    </div>
  );
};
PlantGroup.propTypes = {
  group: propsTypes.string.isRequired,
};

const PlantSource = ({ plant }) => {
  const { type, source, motherPlant } = plant;
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "green",
        color: "white",
        borderRadius: "5px",
        padding: "5px",
        margin: "5px",
      }}
    >
      {type === "Seed" && source && (
        <Link sx={{ color: "white" }} to={`/strains/${source}`}>
          Source Strain
        </Link>
      )}
      {type === "Clone" && motherPlant && (
        <Link sx={{ color: "white" }} href={`/plant/${motherPlant}`}>
          Mother Plant
        </Link>
      )}
      {source || motherPlant ? null : (
        <Typography variant="caption" color="text.secondary">
          No Source
        </Typography>
      )}
    </div>
  );
};
PlantSource.propTypes = {
  plant: propsTypes.object.isRequired,
};

const PlantGender = ({ gender }) => {
  if (gender === "Female") {
    return <FemaleIcon fontSize="large" />;
  } else if (gender === "Male") {
    return <MaleIcon fontSize="large" />;
  } else {
    return (
      <Typography variant="caption" color="text.secondary">
        Undefined
      </Typography>
    );
  }
};
PlantGender.propTypes = {
  gender: propsTypes.string,
};

const PlantStages = ({ plant }) => {
  const { state, actions } = plant;
  const now = new Date();
  const startDate = new Date(
    actions?.find((action) => action.type === "Start")?.date
  );
  const plantAge = Math.floor((now - new Date(startDate)) / 86400000);
  const vegStartDate = new Date(
    actions?.find(
      (action) =>
        action.type === "Picking" &&
        (action.potSize === "1 L" || action.potSize === "0.25 L")
    )?.date
  );
  const bloomStartDate = new Date(
    actions?.find((action) => action.type === "Blooming")?.date
  );
  const motherPlantStartDate = new Date(
    actions?.find((action) => action.type === "MakeMother")?.date
  );
  const harvestDate = new Date(
    actions?.find((action) => action.type === "Harvest")?.date
  );
  const stopDate = new Date(
    actions?.find((action) => action.type === "Stop")?.date
  );

  const cloningStage =
    state === "Cloning"
      ? Math.floor((now - startDate) / 86400000)
      : Math.floor((vegStartDate - startDate) / 86400000);
  const vegStage =
    state === "Growing"
      ? Math.floor((now - vegStartDate) / 86400000)
      : state === "Blooming"
      ? Math.floor((bloomStartDate - vegStartDate) / 86400000)
      : state === "MotherPlant"
      ? Math.floor((now - vegStartDate) / 86400000)
      : 0;
  const bloomStage =
    state === "Blooming"
      ? Math.floor((now - bloomStartDate) / 86400000)
      : state === "Harvested"
      ? Math.floor((now - harvestDate) / 86400000)
      : state === "Stoped"
      ? Math.floor((now - stopDate) / 86400000)
      : 0;
  const motherPlantStage =
    state === "MotherPlant"
      ? Math.floor((now - motherPlantStartDate) / 86400000)
      : 0;

  return (
    <>
      <Typography variant="h6" color="text.secondary">
        Plant Age: {plantAge} days
      </Typography>
      {state === "Cloning" && (
        <Typography variant="caption" color="text.secondary">
          Cloning Stage: {cloningStage} days
        </Typography>
      )}
      {state === "Growing" && (
        <Typography variant="caption" color="text.secondary">
          Cloning Stage: {cloningStage} days Veg Stage: {vegStage} days
        </Typography>
      )}
      {state === "Blooming" && (
        <Typography variant="caption" color="text.secondary">
          Cloning Stage: {cloningStage}days Veg Stage: {vegStage}days Bloom
          Stage: {bloomStage} days
        </Typography>
      )}
      {state === "MotherPlant" && (
        <Typography variant="caption" color="text.secondary">
          Cloning Stage: {cloningStage}days Veg Stage: {vegStage}days Mother
          Plant Stage: {motherPlantStage} days
        </Typography>
      )}
    </>
  );
};
PlantStages.propTypes = {
  plant: propsTypes.object.isRequired,
};

export const PlantDetailPage = () => {
  const id = useParams().id;
  const appBar = useContext(AppBarContext);
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
    appBar.setAppBar({
      title: "Plant Details",
      toolbar: (
        <>
          <Scanner />
          <TrayButton />
        </>
      ),
    });
  }, []);

  useEffect(() => {
    if (data?.length > 0) {
      setPlant(data[0]);
    }
  }, [data]);

  const {
    type,
    strain,
    pheno,
    gender,
    state,
    actions,
    cloneCounter,
    maxClones,
    potSize,
    currentAddress,
    group,
  } = plant;

  return (
    <Grid container>
      {isError && <Alert severity="error">{error.message}</Alert>}
      {isLoading && <CircularProgress />}
      {data?.length > 0 && (
        <>
          <Grid
            item
            xs={12}
            md={12}
            lg={6}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <Card sx={{ width: "100%", height: "auto" }}>
              <CardContent>
                <Grid container>
                  <Grid
                    item
                    xs={12}
                    sx={{ display: "flex", justifyContent: "center" }}
                  >
                    <Typography variant="h6">{type ?? ""}</Typography>
                    <Typography gutterBottom variant="h4">
                      {strain ?? "undefined"}
                    </Typography>
                    <PlantGender gender={gender} />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sx={{ display: "flex", justifyContent: "left" }}
                  >
                    <Typography gutterBottom variant="h6">
                      Pheno.:{pheno ?? "undefined"}
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
                  {group && (
                    <Grid
                      item
                      xs={12}
                      sx={{ display: "flex", justifyContent: "left" }}
                    >
                      <PlantGroup group={group} />
                      <PlantSource plant={plant} />
                    </Grid>
                  )}

                  <Grid
                    item
                    xs={12}
                    sx={{ display: "flex", justifyContent: "center" }}
                  >
                    <Typography variant="h6" color="text.secondary">
                      Pot Size: {potSize || "undefined"}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    md={6}
                    xs={12}
                    sx={{ display: "flex", justifyContent: "left" }}
                  >
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      display="block"
                    >
                      {currentAddress &&
                        `Building: ${currentAddress?.building ?? "undefined"} 
                            Room:${currentAddress?.room ?? " "} 
                            ${
                              currentAddress?.room === "Laboratory"
                                ? ` 
                                Rack: ${currentAddress?.rack}`
                                : ` 
                                  Row: ${currentAddress?.row ?? ""}`
                            } 
                                  ${
                                    currentAddress?.room === "Laboratory"
                                      ? ` 
                                    Shelf: ${currentAddress?.shelf}`
                                      : ` 
                                    Tray: ${currentAddress?.tray ?? ""}`
                                  }
                                        Number:  ${currentAddress?.number ?? ""}
                                        `}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    md={6}
                    xs={12}
                    sx={{ display: "flex", justifyContent: "left" }}
                  >
                    <PlantStages plant={plant} />
                  </Grid>
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
                    {state === "MotherPlant" && (
                      <>
                        <Grid
                          item
                          xs={12}
                          sx={{ display: "flex", justifyContent: "left" }}
                        >
                          <Typography variant="body" color="text.secondary">
                            Mother Plant yeld:{cloneCounter ?? "0"} clones
                          </Typography>

                          <Typography color="text.secondary">
                            Max Clones yeld:{maxClones ?? "0"} clones
                          </Typography>
                        </Grid>
                      </>
                    )}
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid
            item
            xs={12}
            md={12}
            lg={6}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <PlantTimeline actions={actions ?? []} />
          </Grid>
          <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
            <PlantSpeedDial
              getPlants={getPlant}
              addPhotos
              addAction
              addToTray
              print
            />
          </Grid>
        </>
      )}
    </Grid>
  );
};
