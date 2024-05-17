import PropTypes from 'prop-types';
import { useNavigate } from "react-router-dom";
import { Card, CardContent, Typography, Button } from '@mui/material';


const PlantCard = ({ plant }) => {
  const navigate = useNavigate();
  
  const handleDetailsClick = () => {
    navigate(`/plant/${plant._id}`);
  };
  const plantAge=Math.floor((new Date()-new Date(plant.startDate))/86400000);
  const now=new Date();
  const vegStartDate = new Date(plant.actions.find((action)=>action.type==="Picking"&&action.potSize==="1 L")?.date);
  const bloomStartDate = new Date(plant.actions.find((action)=>action.type==="Blooming")?.date)
  const cloningStage =Math.floor(vegStartDate-now)/86400000;
  const vegStage = plant.state ==="Growing" ? Math.floor(now-vegStartDate)/86400000 : Math.floor(bloomStartDate-vegStartDate)/86400000;
  const bloomStage = plant.state==="Blooming"? Math.floor(now-bloomStartDate)/86400000:0;

  return (
    <Card className="plant-card">
      <CardContent>
      {plantAge && (
          <Typography variant="h2" color="text.secondary" >
            {plantAge} days old
          </Typography>
        )}
      {plant?.pheno && (
          <Typography variant="h2" color="text.secondary" >
            {plant.pheno}
          </Typography>
        )}
        {plant?.strain && (
          <Typography variant="body2" color="text.secondary" >
            Strain: {plant.strain}
          </Typography>
        )}
     
        {plant?.state && (
          <Typography variant="body2" color="text.secondary">
            State: {plant?.state}
          </Typography>
        )}
        {plant?.type && (
          <Typography variant="boby2" color="text.success">
            Type: {plant.type}
          </Typography>
        )}
        {plant?.startDate && (
          <Typography variant="caption" color="text.secondary">
          Start Date: {plant.startDate}
          </Typography>
        )}
        <Button variant="contained" onClick={handleDetailsClick}>
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};
PlantCard.propTypes = {
  plant: PropTypes.object,
};
export default PlantCard;
