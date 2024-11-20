import PropTypes from "prop-types";

import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import { CardHeader, Grid } from "@mui/material";
import PlantAvatar from "../../../components/PlantAvatar";

export const MotherCard = (props) => {
  const navigate = useNavigate();
  const plantDetails = (id) => {
    navigate(`/plant/${id}`);
  };
  const plantAge = () => {
    const startDate = new Date(props.plant.startDate);
    const now = new Date();
    const diffTime = Math.abs(now - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  return (
    <Card sx={{ width: 345, m: 1, p: "5px", boxShadow: 4 }}>
      <CardHeader
        avatar={<PlantAvatar pheno={props.plant.pheno} />}
        title={
          <Typography variant="h4" color="text.secondary" component="div">
            {props.plant.strain}
          </Typography>
        }
        subheader={props.plant.pheno}
        sx={{
          borderBottom: 1,
          borderBottomColor: "text.secondary",
        }}
      ></CardHeader>
      <CardContent>
        <Grid container>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary" component="span">
              Total:
            </Typography>
            <Typography variant="h3" color="text.secondary" component="span">
              {props.plant.cloneCounter ?? "0"}
            </Typography>
            <Typography variant="body2" color="text.secondary" component="span">
              clones
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary" component="span">
              age:
            </Typography>
            <Typography variant="h3" color="text.secondary" component="span">
              {plantAge()}
            </Typography>
            <Typography variant="body2" color="text.secondary" component="span">
              days
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography
              variant="body2"
              fontWeight="bold"
              color="text.secondary"
              component="div"
            >
              Maximum Clones Yeld:{props.plant.maxClones ?? "0"}clones
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          onClick={() => {
            plantDetails(props.plant._id);
          }}
        >
          Details
        </Button>
      </CardActions>
    </Card>
  );
};
MotherCard.propTypes = {
  plant: PropTypes.object,
};
