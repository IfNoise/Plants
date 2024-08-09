import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Checkbox,
} from "@mui/material";
import PropTypes from "prop-types";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { useRemoveDeviceMutation } from "../../store/lightApi";


const DeviceCard = ({ device}) => {
  const { name, host, port} = device.options;
  const [removeDevice] = useRemoveDeviceMutation();
  const {ports}=device;
  const handleRemoveDevice = () => {
    removeDevice(name);
  }
  return (
    <Card>
      <CardHeader
        title={name}
        subheader={`${host}:${port}`}
        action={<Checkbox icon={<LockIcon />} checkedIcon={<LockOpenIcon/>} />}
      />
      <CardContent>
      </CardContent>
      <CardActions>
        <Button
          variant="contained"
          color="error"
          onClick={handleRemoveDevice}
        >Delete</Button>

      </CardActions>
    </Card>
  );
}
DeviceCard.propTypes = {
  device: PropTypes.object.isRequired,
};



export default DeviceCard;
