import { Alert, Box, CircularProgress, Stack, Typography } from "@mui/material";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { useGetStateQuery } from "../../store/deviceApi";
import { selectDeviceState } from "../../store/deviceStatusSlice";

/**
 * Device outputs display component
 * @param {Object} props
 * @param {string} props.deviceId - Device ID
 * @param {number} props.updateInterval - Polling interval in milliseconds
 */
const Outputs = ({ deviceId, updateInterval }) => {
  // Fallback polling for initial data
  const { isLoading, isError, data } = useGetStateQuery(deviceId, {
    pollingInterval: updateInterval,
  });

  // Real-time state from WebSocket
  const realtimeState = useSelector((state) => selectDeviceState(state, deviceId));

  // Use real-time data if available, otherwise fallback to polling
  const currentState = realtimeState || data?.result;
  const outputs = currentState?.outputs || [];

  return (
    <Box
      sx={{
        m: "5px",
        p: "5px",
        width: "100%",
      }}
    >
      <Typography variant="h6">Outputs</Typography>
      {isLoading && <CircularProgress />}
      {isError && <Alert severity="error">{isError.message}</Alert>}
      <Stack direction="row" useFlexGap flexWrap="wrap">
        {outputs.map((output, i) => (
          <Box
            key={i}
            sx={{
              display: "inline",
              fontSize: "8px",
              fontFamily: "monospace",
              fontWeight: "bold",
              width: "45px",
              color: "white",
              m: "2px",
              p: "2px",
              height: "26px",
              borderRadius: "5px",
              borderStyle: "solid",
              borderColor: output.state ? "#76ff03" : "#eeeeee",
              borderWidth: "2px",
            }}
          >
            {output.name}
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

Outputs.propTypes = {
  deviceId: PropTypes.string.isRequired,
  updateInterval: PropTypes.number.isRequired,
};

export default Outputs;
