import PropTypes from "prop-types";

import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";

export const MotherCard = (props) => {
  const navigate = useNavigate();
  const plantDetails = (id) => {
    navigate(`/plant/${id}`)
  };
  return (
    <Card sx={{ width: 345 ,p:2,m:2,boxShadow:4}}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {props.plant.strain}
        </Typography>
        <Typography gutterBottom variant="h7" component="div">
          {props.plant.pheno}
        </Typography>
        <Typography variant="body2" color="text.secondary" component="div">
          Clone counter:{props.plant.cloneCounter??'0'}clones
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={()=>{plantDetails(props.plant._id)}}>Details</Button>
        <Button size="small">Cut clones</Button>
      </CardActions>
    </Card>
  );
};
MotherCard.propTypes= {
  plant: PropTypes.object,
};
