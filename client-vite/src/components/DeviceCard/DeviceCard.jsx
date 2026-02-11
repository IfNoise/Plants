import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import {
  Alert,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Dialog,
  Stack,
} from "@mui/material";
import Status from "./Status";
import Outputs from "./Outputs";
import IrrigatorCard from "./IrrigatorCard";
import LightTimerCard from "./LightTimerCard";
import DeviceSettingsList from "../DeviceSettingsList/DeviceSettingsList";
import { useSetConfigMutation } from "../../store/deviceApi";
import useDeviceStatusContext from "../../hooks/useDeviceStatusContext";
import { selectDeviceConfig, selectDeviceStatus } from "../../store/deviceStatusSlice";

/**
 * Main device card component
 * @param {Object} props
 * @param {Object} props.device - Device object with id, address, config, status
 */
const DeviceCard = ({ device }) => {
  const [open, setOpen] = useState(false);
  const { id, address, config, status } = device;
  const [setConfig, { isError, error }] = useSetConfigMutation();

  // WebSocket integration
  const { subscribeToDevice, unsubscribeFromDevice } = useDeviceStatusContext();
  const realtimeConfig = useSelector((state) => selectDeviceConfig(state, id));
  const realtimeStatus = useSelector((state) => selectDeviceStatus(state, id));

  // Subscribe to device updates on mount
  useEffect(() => {
    subscribeToDevice(id);
    return () => {
      unsubscribeFromDevice(id);
    };
  }, [id, subscribeToDevice, unsubscribeFromDevice]);

  // Use real-time data if available, fallback to initial data
  const currentConfig = realtimeConfig || config;
  const currentStatus = realtimeStatus || status;

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <>
      {isError && <Alert severity="error">{error.message}</Alert>}
      <Card
        sx={{
          m: "2px",
        }}
      >
        <CardHeader
          avatar={<Status status={currentStatus} />}
          title={id}
          subheader={address}
        />
        <CardContent>
          <Outputs deviceId={id} updateInterval={60000} />
          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
            {Object.keys(currentConfig)
              .filter((key) => key.startsWith("irr") && currentConfig[key].enable)
              .map((key, i) => (
                <IrrigatorCard
                  key={i}
                  id={key}
                  name={key}
                  deviceId={id}
                  config={currentConfig[key]}
                  onSave={(changes, reboot) =>
                    setConfig({
                      deviceId: id,
                      config: changes,
                      reboot,
                    })
                  }
                />
              ))}
            {Object.keys(currentConfig)
              .filter((key) => key.startsWith("light") && currentConfig[key].enable)
              .map((key, i) => (
                <LightTimerCard
                  key={i}
                  name={key}
                  config={currentConfig[key]}
                  onSave={(changes, reboot) =>
                    setConfig({
                      deviceId: id,
                      config: changes,
                      reboot,
                    })
                  }
                />
              ))}
          </Stack>
        </CardContent>
        <CardActions>
          <Button onClick={handleOpen}>Settings</Button>
        </CardActions>
      </Card>
      <Dialog fullScreen open={open} onClose={handleClose}>
        {currentConfig && <DeviceSettingsList deviceId={id} onCancel={handleClose} />}
      </Dialog>
    </>
  );
};

DeviceCard.propTypes = {
  device: PropTypes.object.isRequired,
};

export default DeviceCard;
