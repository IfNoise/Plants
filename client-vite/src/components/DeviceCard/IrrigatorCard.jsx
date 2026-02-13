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
import ShowChartIcon from "@mui/icons-material/ShowChart";
import EnableField from "./EnableField";
import TimerMode from "./TimerMode";
import TimeField from "./TimeField";
import IrrigationMapDialog from "./IrrigationMapDialog";
import IrrigationTimeline from "./IrrigationTimeline";
import { timeToSec } from "./utils";
import {
  useGetIrrigationTableQuery,
  useSetIrrigationTableMutation,
} from "../../store/deviceApi";
import MetricsChart from "../MetricsChart";
import TimeRangeDial from "./TimeRangeDial";

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
  const [metricsDialogOpen, setMetricsDialogOpen] = useState(false);
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

  // Extract irrigator number from name (e.g., "Irrigator2" -> "2")
  const irrigatorNumber = name.match(/\d+/)?.[0] || name;

  // Build Victoria Metrics query for this irrigator
  // Формат topic: esp32_A8A154/state/outputs/Valve2
  const metricsQuery = `${deviceId}_value{topic=~".*Valve${irrigatorNumber}", tag="outputs"}`;

  return (
    <>
      <Card
        sx={(theme) => ({
          m: "10px",
          p: "8px",
          borderStyle: "solid",
          borderWidth: config.mode === 1 ? "2px" : "1px",
          borderColor:
            config.mode === 1
              ? theme.palette.error.main
              : theme.palette.divider,
          borderRadius: 1,
          transition: "border-color 200ms ease",
        })}
      >
        {/* Header: small toolbar with name, enable switch and action icons */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
            pb: 1,
            borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="subtitle1">{config.name}</Typography>
            <EnableField
              name={""}
              value={newConfig.enable}
              onChange={(checked) => {
                onSave({ [name]: { enable: checked } }, false);
              }}
            />
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <TimerMode
              mode={config.mode}
              interactive={false}
              showIcons={true}
              activeColor="#00ff00"
            />
            <IconButton
              size="small"
              aria-label="settings"
              onClick={handleOpen}
              title="Настройки"
            >
              <SettingsIcon fontSize="small" />
            </IconButton>
            {config.mode === 3 && (
              <IconButton
                size="small"
                aria-label="map"
                onClick={handleOpenMapDialog}
                color="primary"
                title="Карта полива"
              >
                <MapIcon fontSize="small" />
              </IconButton>
            )}
            <IconButton
              size="small"
              aria-label="metrics"
              onClick={() => setMetricsDialogOpen(true)}
              title="Показать метрики"
            >
              <ShowChartIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        {/* Body: dial / timeline + details */}
        <Box sx={{ mt: 1 }}>
          {config.mode !== 3 ? (
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <TimeRangeDial
                startSeconds={config.start}
                stopSeconds={config.stop}
              />
              <Box>
                <Typography variant="caption" display="block">
                  Irrigation window: {config.win} s.
                </Typography>
                <Typography variant="caption" display="block">
                  Irrigation number: {config.num}
                </Typography>
              </Box>
            </Box>
          ) : (
            <IrrigationTimeline
              regMap={currentRegMap}
              lightsOnTimeSeconds={config.start}
              lightsOffTimeSeconds={config.stop}
              strategyParams={currentStrategyParams}
            />
          )}
        </Box>
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
            interactive={true}
            activeColor="#3cff00"
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

      {/* Metrics Dialog */}
      <Dialog
        open={metricsDialogOpen}
        onClose={() => setMetricsDialogOpen(false)}
        maxWidth="lg"
        fullWidth
        TransitionComponent={Slide}
      >
        <DialogTitle>
          Метрики {config.name}
          <Typography variant="caption" display="block" color="text.secondary">
            {deviceId} - Valve[{irrigatorNumber}]
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <MetricsChart
              title="Состояние клапана"
              query={metricsQuery}
              victoriaMetricsUrl="/api/v1/query_range"
              defaultTimeRange="12h"
              height={125}
              autoRefresh={false}
              refreshInterval="off"
              yAxisLabel="Вкл/Выкл"
              showControls={true}
              discrete={true}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMetricsDialogOpen(false)}>Закрыть</Button>
        </DialogActions>
      </Dialog>
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
