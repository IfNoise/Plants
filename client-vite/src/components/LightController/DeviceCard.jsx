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
  const { name, options } = device;
  const [removeDevice] = useRemoveDeviceMutation();
  
  const handleRemoveDevice = () => {
    removeDevice(name);
  }
  
  const getDeviceInfo = () => {
    if (options.type === "rtu") {
      return `RTU: ${options.path} (${options.baudRate} baud, ${options.dataBits}${options.parity[0].toUpperCase()}${options.stopBits})`;
    } else {
      return `TCP: ${options.host}:${options.port}`;
    }
  };
  
  return (
    <Card>
      <CardHeader
        title={name}
        subheader={getDeviceInfo()}
        action={<Checkbox icon={<LockIcon />} checkedIcon={<LockOpenIcon/>} />}
      />
      <CardContent>
        {options.type === "rtu" && (
          <>Unit ID: {options.unitId}</>
        )}
        {options.timeout && (
          <> • Timeout: {options.timeout}ms</>
        )}
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
