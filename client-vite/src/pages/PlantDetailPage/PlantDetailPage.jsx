import { useEffect } from "react";

import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Card, Alert, CircularProgress } from "@mui/material";
import Box from "@mui/material/Box";
import { useParams } from "react-router-dom";
import { useState } from "react";

import { useGetPlantsQuery } from "../../store/plantsApi";
import PlantTimeline from "../../components/PlantTimeline/PlantTimeline";
import { NewActionButton } from "../../components/NewActionButton/NewActionButton";

export const PlantDetailPage = () => {
  const id = useParams().id;

  const { isLoading, isError, error, data } = useGetPlantsQuery({ _id: id });

  const [plant, setPlant] = useState({});
  useEffect(() => {
    if (data) {
      setPlant(data[0]);
    }
  }, [data]);
  const getPlant = () => [plant];

  const { strain, pheno, gender, state, cloneCounter, actions } = plant;

  return (
    <Box>
      {isError && <Alert severity="error">{error.message}</Alert>}
      {isLoading && <CircularProgress />}
      {data && (
        <>
          <Card sx={{ width: 640 }}>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {strain}
              </Typography>
              <Typography gutterBottom variant="h7" component="div">
                {pheno}
              </Typography>
              <Typography
                gutterBottom
                variant="h7"
                sx={{ color: "green" }}
                component="div"
              >
                Gender: {gender ?? "undefined"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                State: {state ?? "undefined"}
              </Typography>
              {state === "MotherPlant" && (
                <Typography variant="caption" color="text.secondary">
                  Clones Counter:{cloneCounter ?? "0"}
                </Typography>
              )}
              <PlantTimeline actions={actions} />
            </CardContent>
          </Card>
          {state && <NewActionButton getPlants={getPlant} />}
        </>
      )}
    </Box>
  );
};
