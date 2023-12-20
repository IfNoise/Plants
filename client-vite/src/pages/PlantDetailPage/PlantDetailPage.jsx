import { useEffect } from "react";

import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Card, Box, Alert, CircularProgress } from "@mui/material";

import { useParams } from "react-router-dom";
import { useState } from "react";

import { useGetPlantsQuery } from "../../store/plantsApi";
import PlantTimeline from "../../components/PlantTimeline/PlantTimeline";
import { NewActionButton } from "../../components/NewActionButton/NewActionButton";

export const PlantDetailPage = () => {
  const id = useParams().id;

  const { isLoading, isError, error, data } = useGetPlantsQuery({ _id: id });

  const [plant, setPlant] = useState({
  });
  useEffect(() => {
    if (data) {
      setPlant(data[0]);
    }
  }, [data]);

  return (
    <Box>
      {isError && <Alert severity="error">{error.message}</Alert>}
      {isLoading && <CircularProgress />}
      {data && (
        <>
          <Card sx={{ width: 640 }}>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {plant.strain}
              </Typography>
              <Typography gutterBottom variant="h7" component="div">
                {plant.pheno}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {plant.state}
              </Typography>
              {plant.state === "MotherPlant" && (
                <Typography variant="caption" color="text.secondary">
                  Clones Counter:{plant.cloneCounter ?? "0"}
                </Typography>
              )}
              <PlantTimeline actions={plant.actions} />
            </CardContent>
          </Card>
          {plant?.state&&<NewActionButton id={[id]} state={plant.state} />}
        </>
      )}
    </Box>
  );
};
