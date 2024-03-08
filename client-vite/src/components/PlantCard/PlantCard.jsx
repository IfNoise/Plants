import PropTypes from 'prop-types';
import { useNavigate } from "react-router-dom";
import { Card, CardContent, Typography, Button } from '@mui/material';

const PlantCard = ({ plant }) => {
  const navigate = useNavigate();

  const handleDetailsClick = () => {
    navigate(`/plant/${plant._id}`);
  };

  return (
    <Card className="plant-card">
      <CardContent>
      {plant?.pheno && (
          <Typography variant={{md:"h5",lg:"h1"}} color="text.secondary" >
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
