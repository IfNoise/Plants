import { Card, CardContent, CardHeader, Typography } from "@mui/material";
import PropTypes from "prop-types";

export default function CycleCard({ cycle }) {
  return (
    <Card variant="outlined">
      <CardHeader title="Cycle">
        {cycle.address.building??"" + cycle.address.room}
      </CardHeader>
      <CardContent>
        <Typography variant="h5" component="div">
          {cycle.startDate}
        </Typography>
        <Typography variant="h7" component="div">
          {cycle.endPoints.cloning??0}.{cycle.endPoints.growing??0}.{cycle.endPoints.blooming??0}.{cycle.endPoints.flushing??0}
        </Typography>
      </CardContent>
    </Card>
  );
}
CycleCard.propTypes = {
  cycle: PropTypes.object,
};
