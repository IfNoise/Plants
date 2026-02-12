import { useEffect, useMemo } from "react";

import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import {
  Card,
  Alert,
  CircularProgress,
  Grid,
  Link,
  CardHeader,
  Box,
} from "@mui/material";
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
    <Box
      sx={{
        width: "6rem",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "green",
        color: "primary.main",
        borderRadius: "5px",
        padding: "5px",
        margin: "5px",
      }}
    >
      {group && (
        <Link sx={{ color: "primary.main" }} href={`/plants?${params}`}>
          Group
        </Link>
      )}
      {!group && (
        <Typography variant="caption" color="text.secondary">
          No Group
        </Typography>
      )}
    </Box>
  );
};
PlantGroup.propTypes = {
  group: propsTypes.string.isRequired,
};

const PlantSource = ({ plant }) => {
  const { type, source, motherPlant } = plant;
  return (
    <Box
      sx={{
        width: "6rem",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "green",
        color: "primary.main",
        borderRadius: "5px",
        padding: "5px",
        margin: "5px",
      }}
    >
      {type === "Seed" && source && (
        <Link sx={{ color: "primary.main" }} to={`/strains/${source}`}>
          Source Strain
        </Link>
      )}
      {type === "Clone" && motherPlant && (
        <Link sx={{ color: "primary.main" }} href={`/plant/${motherPlant}`}>
          Mother Plant
        </Link>
      )}
      {source || motherPlant ? null : (
        <Typography variant="caption" color="text.secondary">
          No Source
        </Typography>
      )}
    </Box>
  );
};
PlantSource.propTypes = {
  plant: propsTypes.object.isRequired,
};

const PlantGender = ({ gender }) => {
  const isMale = gender === "Male";
  const isFemale = gender === "Female";
  return (
    <>
      {isMale && <MaleIcon color="male" />}
      {isFemale && <FemaleIcon color="female" />}
    </>
  );
};
PlantGender.propTypes = {
  gender: propsTypes.string,
};

const PlantStages = ({ plant }) => {
  const { state, actions } = plant;
  const [age, setAge] = useState(0);
  const initialState = {
    germinationStage: 0,
    cloningStage: 0,
    vegStage: 0,
    bloomStage: 0,
    motherPlantStage: 0,
  };
  const [stages, setStages] = useState(initialState);
  useMemo(() => {
    const now = new Date();
    const startDate = new Date(
      actions?.find((action) => action.type === "Start")?.date,
    );

    const plantAge = Math.floor((now - new Date(startDate)) / 86400000);
    const vegStartDate = new Date(
      actions?.find(
        (action) =>
          action.type === "Picking" &&
          (action.potSize === "1 L" ||
            action.potSize === "0.25 L" ||
            action.potSize === undefined),
      )?.date,
    );
    const bloomStartDate = new Date(
      actions?.find((action) => action.type === "Blooming")?.date,
    );
    const motherPlantStartDate = new Date(
      actions?.find((action) => action.type === "MakeMother")?.date,
    );
    const harvestDate = new Date(
      actions?.find((action) => action.type === "Harvest")?.date,
    );
    const stopDate = new Date(
      actions?.find((action) => action.type === "Stop")?.date,
    );

    const cloningStage =
      state === "Cloning"
        ? Math.floor((now - startDate) / 86400000)
        : Math.floor((vegStartDate - startDate) / 86400000);
    const germinationStage =
      state === "Germination"
        ? Math.floor((now - startDate) / 86400000)
        : plant.type === "Seed"
          ? Math.floor((vegStartDate - startDate) / 86400000)
          : 0;

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
    setAge(plantAge);
    setStages({
      Germination: germinationStage,
      Cloning: cloningStage,
      Vegitation: vegStage,
      Blooming: bloomStage,
      MotherPlant: motherPlantStage,
    });
  }, [actions, state]);

  return (
    <Box
      sx={{
        border: "solid 1px",
        borderRadius: "5px",
        padding: "5px",
      }}
    >
      <Typography variant="h1" color="text.secondary" display="inline">
        {age}
      </Typography>
      <Typography variant="body" color="text.secondary" display="inline">
        days
      </Typography>
      {Object.keys(stages).map((stage) => {
        if (stages[stage])
          return (
            <Typography
              key={stage}
              variant="subtitle1"
              color="text.secondary"
              display="block"
            >
              {stage}: {stages[stage]}days
            </Typography>
          );
      })}
    </Box>
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
    { refetchOnMountOrArgChange: true, refetchOnFocus: true },
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
          <Grid item xs={12} md={12} lg={6}>
            <Card sx={{ width: "100%", height: "auto" }}>
              <CardHeader
                title={
                  <>
                    <Typography variant="h4" display="inline">
                      {type ?? ""}
                    </Typography>
                    <PlantGender gender={gender} />
                    <Typography gutterBottom variant="h6" display="inline">
                      {strain ?? "undefined"}
                    </Typography>
                    <Typography variant="h5" color="text.secondary">
                      {state ?? "undefined"}
                    </Typography>
                  </>
                }
              />
              <CardContent>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography gutterBottom variant="h6">
                      Pheno.:{pheno ?? "undefined"}
                    </Typography>
                    {group && <PlantGroup group={group} />}
                    <PlantSource plant={plant} />
                    <Typography variant="h6" color="text.secondary">
                      Pot Size: {potSize || "undefined"}
                    </Typography>
                  </Grid>
                  <Grid item md={4} xs={4}>
                    <PlantStages plant={plant} />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    {currentAddress && (
                      <>
                        <Typography variant="body2">
                          Building: {currentAddress.building || "undefined"}
                        </Typography>
                        <Typography variant="body2">
                          Room: {currentAddress.room || "undefined"}
                        </Typography>
                        {currentAddress?.row && (
                          <Typography variant="body2">
                            Row: {currentAddress.row}
                          </Typography>
                        )}
                        {currentAddress?.rack && (
                          <Typography variant="body2">
                            Rack: {currentAddress.rack}
                          </Typography>
                        )}
                        {currentAddress?.shelf && (
                          <Typography variant="body2">
                            Shelf: {currentAddress.shelf}
                          </Typography>
                        )}
                        {currentAddress?.tray && (
                          <Typography variant="body2">
                            Tray: {currentAddress.tray || "undefined"}
                          </Typography>
                        )}
                      </>
                    )}
                  </Grid>

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
            {actions && <PlantTimeline actions={actions} />}
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
