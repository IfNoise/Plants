import { useEffect } from "react";

import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import { Card, Box, Alert, CircularProgress } from "@mui/material";
import Popover from "@mui/material/Popover";

import { useParams } from "react-router-dom";
import { useState } from "react";
import { NewAction } from "./NewAction/NewAction";

import { useGetPlantsQuery  } from "../../store/plantsApi";
import PlantTimeline from "../../components/PlantTimeline/PlantTimeline";
import { useRef } from "react";
import Scanner from "../../components/Scanner/Scanner";

const fabStyle = {
  position: "fixed",
  bottom: 16,
  right: 16,
};

export const PlantDetailPage = () => {
  const id = useParams().id;
  const fab=useRef()
  const { isLoading, isError, error, data} = useGetPlantsQuery({ _id: id });
  const [actOpen, setActOpen] = useState(false);
  const [plant, setPlant] = useState({
    strain: " ",
    pheno: " ",
    state: " ",
  });
  useEffect(() => {
    if (data) {
      setPlant(data[0]);
    }
  }, [data]);

  const handleNewAction = () => {
    setActOpen(true);
  };
  const handleActionOk = () => {
    setActOpen(false);
  };

  return (
    <Box >
      {isError && <Alert severity="error">{error.message}</Alert>}
      {isLoading && <CircularProgress />}
      {data && (
        <Card sx={{ maxWidth: 640}}>
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
            {plant.state==="MotherPlant"&&<Typography variant="caption" color="text.secondary">
              Clones Counter:{plant.cloneCounter ?? '0'}
            </Typography> }
            <PlantTimeline actions={plant.actions} />
        </CardContent>
        </Card>
      )}
      <Fab
        id="action_button"
        onClick={handleNewAction}
        sx={fabStyle}
        ref={fab}
        aria-label="New Action"
        color="primary"
      >
        <AddIcon />
      </Fab>
      <Popover
        id="action_popover"
        open={actOpen}
        anchorEl={fab.current}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        {" "}
        <Typography sx={{ p: 2 }} gutterBottom variant="h5" component="div">
          New Action
        </Typography>
        <NewAction id={[id]} state={plant.state} handleOk={handleActionOk} />
      </Popover>
      
    </Box>
  );
};
