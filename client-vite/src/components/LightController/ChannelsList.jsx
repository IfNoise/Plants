import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Card,
  Checkbox,
  CircularProgress,
  Dialog,
  IconButton,
  Menu,
  MenuItem,
  Select,
  Slide,
  Slider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  useAddChannelMutation,
  useAddDeviceMutation,
  useGetDevicesQuery,
  useGetLightChannelsQuery,
  useGetLightChannelStateQuery,
  useRemoveChannelMutation,
  useSetMaxLevelMutation,
} from "../../store/lightApi";
import DeveloperBoardIcon from "@mui/icons-material/DeveloperBoard";
import TungstenIcon from "@mui/icons-material/Tungsten";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import AvTimerIcon from "@mui/icons-material/AvTimer";
import TouchAppIcon from "@mui/icons-material/TouchApp";
import CircularProgressWithLabel from "../CircularProgress";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";

function valuetext(value) {
  return `${value}%`;
}

const AddDeviceDialog = () => {
  const [addDevice] = useAddDeviceMutation();
  const [newDevice, setNewDevice] = useState({
    name: "",
    address: "",
    port: "",
  });
  const [open, setOpen] = useState(false);
  const handleAddDevice = () => {
    const { name, address, port } = newDevice;
    if (!name || !address || !port) {
      return;
    } else {
      addDevice({ name, address, port });
      setNewDevice({ name: "", address: "", port: "" });
      setOpen(false);
    }
  };
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <>
      <IconButton onClick={() => setOpen(!open)}>
        <DeveloperBoardIcon />
      </IconButton>
      <Dialog open={open} onClose={handleClose}>
        <Stack sx={{ m: 2 }} spacing={1} direction="row">
          <TextField
            label="Name"
            required
            value={newDevice.name}
            onChange={(e) =>
              setNewDevice({ ...newDevice, name: e.target.value })
            }
          />
          <TextField
            label="Address"
            required
            value={newDevice.address}
            onChange={(e) =>
              setNewDevice({ ...newDevice, address: e.target.value })
            }
          />
          <TextField
            label="Port"
            required
            value={newDevice.port}
            onChange={(e) =>
              setNewDevice({ ...newDevice, port: e.target.value })
            }
          />
        </Stack>
        <Button onClick={handleAddDevice}>Add Device</Button>
      </Dialog>
    </>
  );
};
export const AddChannelDialog = () => {
  const { data: devices } = useGetDevicesQuery();
  const [newChannel, setNewChannel] = useState({
    name: "",
    device: "",
    port: "",
  });
  const [addChannel] = useAddChannelMutation();
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };
  const handleAddChannel = () => {
    if (!newChannel.name || !newChannel.device || newChannel.port === "") {
      Alert("All fields are required");
      return;
    }
    addChannel(newChannel);
    setNewChannel({ name: "", device: "", port: "" });
    setOpen(false);
  };

  return (
    <>
      <IconButton onClick={() => setOpen(!open)}>
        <TungstenIcon />
      </IconButton>
      <Dialog open={open} TransitionComponent={Slide} onClose={handleClose}>
        <Typography variant="h6">Add Channel</Typography>
        <Stack margin={"5px"} direction={"column"} spacing={1}>
          <TextField
            label="Name"
            required
            value={newChannel.name}
            onChange={(e) =>
              setNewChannel({ ...newChannel, name: e.target.value })
            }
          />
          <Box>
            <Select
              label="Device"
              required
              value={newChannel.device}
              onChange={(e) =>
                setNewChannel({ ...newChannel, device: e.target.value })
              }
            >
              {devices?.length > 0 &&
                devices.map((device, idx) => (
                  <MenuItem key={idx} value={device.name}>
                    {device.name}
                  </MenuItem>
                ))}
            </Select>
            <AddDeviceDialog />
          </Box>
          <Select
            label="Port"
            required
            value={newChannel.port}
            onChange={(e) =>
              setNewChannel({ ...newChannel, port: e.target.value })
            }
          >
            {devices?.length > 0 &&
              devices
                .find((device) => device.name === newChannel.device)
                ?.ports?.map((port, idx) => (
                  <MenuItem key={idx} value={idx}>{`${idx}:${port}`}</MenuItem>
                ))}
          </Select>
          <pre>{JSON.stringify(newChannel, null, 2)}</pre>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddChannel}
          >
            Add
          </Button>
        </Stack>
      </Dialog>
    </>
  );
};
const LockWrapper = ({ children, lockedDefault }) => {
  const [locked, setLocked] = useState(lockedDefault);
  return (
    <>
      <Box
        sx={{
          position: "relative",
          zIndex: 0,
        }}
      >
        {children}
        {locked && (
          <>
            <Box
              sx={{
                borderRadius: "10px",
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                zIndex: 1100,
                pointerEvents: "none",
              }}
            />
            <Box
              sx={{
                borderRadius: "10px",
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 1101,
                pointerEvents: "all",
              }}
            />
          </>
        )}
        <Checkbox
          checked={locked}
          size="small"
          sx={{
            position: "absolute",
            bottom: "0px",
            right: "0px",
            zIndex: 1102,
          }}
          icon={<LockOpenIcon />}
          checkedIcon={<LockIcon />}
          onChange={(e) => setLocked(e.target.checked)}
        />
      </Box>
    </>
  );
};

LockWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  lockedDefault: PropTypes.bool,
};

const ChannalCard = ({ channel }) => {
  const { name, device, port, maxLevel, manual } = channel;
  const [contextMenu, setContextMenu] = useState(null);
  const [maxValue, setMaxValue] = useState((maxLevel / 32767) * 100);
  const { data: state } = useGetLightChannelStateQuery(name, {
    pollingInterval: 60000,
  });
  const [setMaxLevel] = useSetMaxLevelMutation();
  const [removeChannel] = useRemoveChannelMutation();
  useEffect(() => {
    setMaxValue((maxLevel / 32767) * 100);
  }, [maxLevel]);

  const handleContextMenu = (event) => {
    event.preventDefault();
    setContextMenu(
      contextMenu === null
        ? {
            mouseX: event.clientX + 2,
            mouseY: event.clientY - 6,
          }
        : null
    );
  };

  return (
    <>
      <LockWrapper lockedDefault={manual}>
        <Card
          sx={{
           // m: "4px",
            p: "8px",
            display: "flex",
            flexDirection: "column",
            width: "100px",
          }}
          onContextMenu={handleContextMenu}
        >
          <Stack direction="row" spacing={1}>
            <Box>
              <Typography
                variant="body"
                sx={{
                  fontWeight: "bold",
                  fontSize: "10px",
                  maxWidth: "90px",
                }}
              >
                {name}
              </Typography>
              <Typography
                sx={{
                  fontSize: "8px",
                  maxWidth: "90px",
                }}
                variant="caption"
                component={"div"}
              >
                {device || ""} port: {port || 0}
              </Typography>
            </Box>
          </Stack>
          {manual && (
            <TouchAppIcon
              sx={{
                fontSize: "18px",
                alignSelf: "flex-end",
              }}
              color="error"
            />
          )}
          {!manual && (
            <AvTimerIcon
              sx={{
                fontSize: "18px",
                alignSelf: "flex-end",
              }}
              color="success"
            />
          )}
          <Stack
            sx={{
              alignItems: "center",
            }}
            direction={"column"}
            spacing={1}
          >
            <CircularProgressWithLabel
              variant="determinate"
              value={Math.floor((state?.state / 32767) * 100) || 0}
              sx={{
                color: "lime",
              }}
            />
            <Slider
              sx={{
                height: "90px",
                width: "35px",
                color: "green",
              }}
              size="small"
              orientation="vertical"
              getAriaLabel={() => "Minimum distance"}
              valueLabelDisplay="on"
              getAriaValueText={valuetext}
              disableSwap
              min={0}
              max={100}
              value={Math.floor(maxValue) || 0}
              onChange={(e) => setMaxValue(e.target.value)}
              onChangeCommitted={(e) => {
                console.log(e);
                setMaxLevel({ name, maxLevel: 32767*maxValue/100 });
              }}
            />
          </Stack>
        </Card>
      </LockWrapper>
      <Menu
        open={contextMenu !== null}
        onClose={() => setContextMenu(null)}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
      >
        <MenuItem
          onClick={() => {
            setContextMenu(null);
            removeChannel(name);
          }}
        >
          Remove
        </MenuItem>
      </Menu>
    </>
  );
};

ChannalCard.propTypes = {
  channel: PropTypes.object.isRequired,
};

export default function ChannelsList({
  channelNames,
  addButton,
  defaultCollapsed,
}) {
  const { data, isLoading, isSuccess, isError, error } =
    useGetLightChannelsQuery({});
  const [channels, setChannels] = useState([]);
  useEffect(() => {
    if (!data) {
      return;
    }
    if (data?.length > 0 && channelNames?.length > 0) {
      const ch = data.filter((channel) => channelNames.includes(channel.name));
      setChannels(ch);
    }
    if (data?.length > 0 && !channelNames) {
      setChannels(data);
    }
  }, [data, channelNames]);
  return (
    <Accordion

    >
      <AccordionSummary
         expandIcon={<ExpandMoreIcon color="red" />}
      >Channels</AccordionSummary>
      <AccordionDetails>
        {isLoading && <CircularProgress />}
        {isError && <Alert severity="error">{error.message}</Alert>}
        <Stack direction="row" useFlexGap flexWrap={"wrap"} spacing={1}>
          {isSuccess &&
            channels?.map((channel, idx) => (
              <ChannalCard key={idx} channel={channel} />
            ))}
        </Stack>
      </AccordionDetails>
      <AccordionActions>{addButton && <AddChannelDialog />}</AccordionActions>
    </Accordion>
  );
}
ChannelsList.propTypes = {
  channelNames: PropTypes.array,
  addButton: PropTypes.bool,
  defaultCollapsed: PropTypes.bool,
};
