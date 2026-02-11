import { useState } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Button,
  Card,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Slide,
  TextField,
  Typography,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import MapIcon from "@mui/icons-material/Map";
import EnableField from "./EnableField";
import TimerMode from "./TimerMode";
import TimeField from "./TimeField";
import IrrigationMapDialog from "./IrrigationMapDialog";
import IrrigationTimeline from "./IrrigationTimeline";
import { TIMER_MODES, secToTime, timeToSec } from "./utils";
import {
  useGetIrrigationTableQuery,
  useSetIrrigationTableMutation,
} from "../../store/deviceApi";

/**
 * Irrigator card component with Map mode support
 * @param {Object} props
 * @param {string} props.name - Irrigator name
 * @param {Object} props.config - Irrigator configuration
 * @param {Function} props.onSave - Save handler
 * @param {string} props.deviceId - Device ID
 */
const IrrigatorCard = ({ name, config, onSave, deviceId }) => {
  const [open, setOpen] = useState(false);
  const [mapDialogOpen, setMapDialogOpen] = useState(false);
  const [newConfig, setNewConfig] = useState(config);
  const [reboot, setReboot] = useState(false);

  // Fetch irrigation table for Map mode
  const { data: irrigationTableData } = useGetIrrigationTableQuery(
    { deviceId, irrigatorKey: name },
    { skip: config.mode !== 3 },
  );

  const [setIrrigationTable] = useSetIrrigationTableMutation();

  const handleClose = () => {
    setNewConfig(config);
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleSave = () => {
    onSave({ [name]: newConfig }, reboot);
    handleClose();
  };

  const handleOpenMapDialog = () => {
    setMapDialogOpen(true);
  };

  const handleSaveMap = async ({
    start,
    stop,
    periods: regMap,
    strategyParams,
  }) => {
    try {
      await setIrrigationTable({
        deviceId,
        irrigatorKey: name,
        irrigationTable: regMap,
        strategyParams: strategyParams || {},
      }).unwrap();
      // Also update start and stop times in config
      onSave(
        {
          [name]: {
            start,
            stop,
          },
        },
        false,
      );
      setMapDialogOpen(false);
    } catch (error) {
      console.error("Failed to save irrigation table:", error);
      alert("Ошибка при сохранении карты полива");
    }
  };

  const currentRegMap = irrigationTableData?.data?.irrigationTable || [];
  const currentStrategyParams =
    irrigationTableData?.data?.strategyParams || null;

  return (
    <>
      <Card
        sx={{
          m: "3px",
          p: "5px",
        }}
      >
        <Typography variant="body" display="inline">
          {config.name + "  "}
        </Typography>
        <EnableField
          name={""}
          value={newConfig.enable}
          onChange={(checked) => {
            onSave({ [name]: { enable: checked } }, false);
          }}
        />
        <IconButton onClick={handleOpen} size="small">
          <SettingsIcon />
        </IconButton>
        {config.mode === 3 && (
          <IconButton
            onClick={handleOpenMapDialog}
            size="small"
            color="primary"
          >
            <MapIcon />
          </IconButton>
        )}
        <Typography variant="caption" display="block">
          Mode: {TIMER_MODES[config.mode]}
        </Typography>
        {config.mode !== 3 ? (
          <>
            <Typography variant="caption" display="block">
              Start: {secToTime(config.start).format("HH:mm")} Stop:{" "}
              {secToTime(config.stop).format("HH:mm")}
            </Typography>
            <Typography variant="caption" display="block">
              Irrigation window: {config.win} s.
            </Typography>
            <Typography variant="caption" display="block">
              Irrigation number: {config.num}
            </Typography>
          </>
        ) : (
          <IrrigationTimeline
            regMap={currentRegMap}
            lightsOnTimeSeconds={config.start}
            lightsOffTimeSeconds={config.stop}
            strategyParams={currentStrategyParams}
          />
        )}
      </Card>

      {/* Settings Dialog */}
      <Dialog TransitionComponent={Slide} open={open} onClose={handleClose}>
        <DialogTitle>{config.name}</DialogTitle>
        <DialogContent>
          <EnableField
            name="Enable"
            value={newConfig.enable}
            onChange={(e) => {
              setNewConfig({ ...newConfig, enable: e });
            }}
          />
          <TimerMode
            mode={newConfig.mode}
            showMapMode={true}
            onChange={(e) => {
              setNewConfig({ ...newConfig, mode: parseInt(e.target.value) });
            }}
          />

          {/* Show traditional settings for modes 0, 1, 2 */}
          {newConfig.mode !== 3 && (
            <>
              <TimeField
                name="Start"
                value={newConfig.start}
                onChange={(e) => {
                  setNewConfig({ ...newConfig, start: timeToSec(e) });
                }}
              />
              <TimeField
                name="Stop"
                value={newConfig.stop}
                onChange={(e) => {
                  setNewConfig({ ...newConfig, stop: timeToSec(e) });
                }}
              />

              <TextField
                sx={{ m: "2px" }}
                variant="outlined"
                label="Irrigation window"
                type="number"
                value={newConfig.win}
                onChange={(event) => {
                  setNewConfig({
                    ...newConfig,
                    win: parseInt(event.target.value),
                  });
                }}
              />
              <TextField
                sx={{ m: "2px" }}
                variant="outlined"
                label="Irrigation number"
                type="number"
                value={newConfig.num}
                onChange={(event) => {
                  setNewConfig({
                    ...newConfig,
                    num: parseInt(event.target.value),
                  });
                }}
              />
            </>
          )}

          {/* Show map editor button for mode 3 */}
          {newConfig.mode === 3 && (
            <Box sx={{ mt: 2 }}>
              <Button
                variant="outlined"
                startIcon={<MapIcon />}
                onClick={handleOpenMapDialog}
                fullWidth
              >
                Настроить карту полива
              </Button>
              <IrrigationTimeline
                regMap={currentRegMap}
                lightsOnTimeSeconds={newConfig.start}
                lightsOffTimeSeconds={newConfig.stop}
                strategyParams={currentStrategyParams}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions
          sx={{ m: "2px", alignContent: "center", justifyContent: "center" }}
        >
          <Button onClick={handleSave}>Save</Button>
          <Checkbox
            checked={reboot}
            size="small"
            onChange={(e) => {
              setReboot(e.target.checked);
            }}
          />
          <Typography variant="caption" display="block">
            Reboot
          </Typography>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Irrigation Map Dialog */}
      <IrrigationMapDialog
        open={mapDialogOpen}
        onClose={() => setMapDialogOpen(false)}
        onSave={handleSaveMap}
        initialMap={currentRegMap}
        initialStrategyParams={currentStrategyParams}
        deviceId={deviceId}
        irrigatorName={config.name}
      />
    </>
  );
};

IrrigatorCard.propTypes = {
  name: PropTypes.string.isRequired,
  config: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired,
  deviceId: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};

export default IrrigatorCard;
