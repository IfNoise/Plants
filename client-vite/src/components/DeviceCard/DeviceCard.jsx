import { useState } from "react";
import PropTypes from "prop-types";
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

/**
 * Main device card component
 * @param {Object} props
 * @param {Object} props.device - Device object with id, address, config, status
 */
const DeviceCard = ({ device }) => {
  const [open, setOpen] = useState(false);
  const { id, address, config, status } = device;
  const [setConfig, { isError, error }] = useSetConfigMutation();

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
          avatar={<Status status={status} />}
          title={id}
          subheader={address}
        />
        <CardContent>
          <Outputs deviceId={id} updateInterval={60000} />
          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
            {Object.keys(config)
              .filter((key) => key.startsWith("irr") && config[key].enable)
              .map((key, i) => (
                <IrrigatorCard
                  key={i}
                  id={key}
                  name={key}
                  deviceId={id}
                  config={config[key]}
                  onSave={(changes, reboot) =>
                    setConfig({
                      deviceId: id,
                      config: changes,
                      reboot,
                    })
                  }
                />
              ))}
            {Object.keys(config)
              .filter((key) => key.startsWith("light") && config[key].enable)
              .map((key, i) => (
                <LightTimerCard
                  key={i}
                  name={key}
                  config={config[key]}
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
        {config && <DeviceSettingsList deviceId={id} onCancel={handleClose} />}
      </Dialog>
    </>
  );
};

DeviceCard.propTypes = {
  device: PropTypes.object.isRequired,
};

export default DeviceCard;
