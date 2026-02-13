import {
  Alert,
  Box,
  CircularProgress,
  Stack,
  Typography,
  Tooltip,
} from "@mui/material";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { useGetStateQuery } from "../../store/deviceApi";
import { selectDeviceState } from "../../store/deviceStatusSlice";
import { subtleContainer } from "../../styles/commonStyles";

/**
 * Compact LED-style output indicator with depth + pulse
 * - accessible: `aria-label` + hidden live region for screen readers
 * - tooltip: shows name, state and optional lastChanged
 * - graceful fallback to polling data
 */
const Outputs = ({ deviceId, updateInterval }) => {
  // Fallback polling for initial data
  const { isLoading, isError, data } = useGetStateQuery(deviceId, {
    pollingInterval: updateInterval,
  });

  // Real-time state from WebSocket
  const realtimeState = useSelector((state) =>
    selectDeviceState(state, deviceId),
  );

  // Use real-time data if available, otherwise fallback to polling
  const currentState = realtimeState || data?.result;
  const outputs = currentState?.outputs || [];

  return (
    <Box
      sx={(theme) => ({
        width: "100%",
        p: "6px 8px",
        m: 0.5,
        borderRadius: 1,
        border: `1px solid ${
          theme.palette.mode === "dark"
            ? "rgba(255, 255, 255, 0.12)"
            : "rgba(0, 0, 0, 0.12)"
        }`,
        backgroundColor:
          theme.palette.mode === "dark"
            ? "rgba(255, 255, 255, 0.04)"
            : "rgba(0, 0, 0, 0.02)",
      })}
    >
      {isLoading && <CircularProgress size={20} />}
      {isError && <Alert severity="error">{isError.message}</Alert>}

      <Stack direction="row" useFlexGap flexWrap="wrap" alignItems="center">
        {outputs.map((output, i) => {
          const isOn = Boolean(output.state);

          return (
            <Tooltip
              key={i}
              title={
                <>
                  <strong>{output.name}</strong>
                  <div>{isOn ? "ON" : "OFF"}</div>
                  {output.lastChanged && (
                    <div style={{ fontSize: 12, opacity: 0.8 }}>
                      {new Date(output.lastChanged).toLocaleTimeString()}
                    </div>
                  )}
                </>
              }
              placement="top"
            >
              <Box
                component="button"
                onClick={(e) => e.preventDefault()}
                aria-label={`Output ${output.name}: ${isOn ? "on" : "off"}`}
                sx={(theme) => ({
                  ...subtleContainer(theme),
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 1,
                  p: "6px 8px",
                  m: 0.5,
                  cursor: "default",
                })}
              >
                {/* LED (wrapper provides a slightly darker ring) */}
                <Box
                  aria-hidden
                  sx={(theme) => ({
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    // slightly dark, noticeable ring around LED
                    border: `1.5px solid ${theme.palette.mode === "dark" ? "rgba(69, 66, 66, 0.6)" : "rgba(0,0,0,0.22)"}`,
                    background:
                      theme.palette.mode === "dark"
                        ? "rgba(144, 136, 136, 0.57)"
                        : "transparent",
                    boxShadow: isOn
                      ? `0 8px 18px -8px ${theme.palette.success.main}`
                      : "none",
                    // inner LED
                    "& > span": {
                      width: 16,
                      height: 16,
                      borderRadius: "50%",
                      background: isOn
                        ? `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.95), ${theme.palette.success.main} 30%, ${theme.palette.success.dark} 90%)`
                        : `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.9), ${theme.palette.grey[400]} 30%, ${theme.palette.grey[600]} 90%)`,
                      boxShadow: isOn
                        ? `0 6px 18px -6px ${theme.palette.success.main}, 0 2px 6px -2px rgba(0,0,0,0.35)`
                        : `inset 0 -2px 0 rgba(0,0,0,0.15)`,
                      transform: "translateZ(0)",
                      transition:
                        "transform 220ms ease, box-shadow 300ms ease, opacity 220ms",
                      opacity: isOn ? 1 : 0.9,
                      ...(isOn && {
                        animation: `pulse 1800ms infinite ease-in-out`,
                      }),
                    },
                    "@keyframes pulse": {
                      "0%": {
                        transform: "scale(1)",
                        boxShadow: `0 6px 18px -6px ${theme.palette.success.main}`,
                      },
                      "50%": {
                        transform: "scale(1.08)",
                        boxShadow: `0 18px 40px -18px ${theme.palette.success.main}`,
                      },
                      "100%": {
                        transform: "scale(1)",
                        boxShadow: `0 6px 18px -6px ${theme.palette.success.main}`,
                      },
                    },
                  })}
                >
                  <Box component="span" />
                </Box>

                {/* Label (compact) */}
                <Typography
                  component="span"
                  sx={(t) => ({
                    fontSize: 12,
                    fontWeight: 600,
                    color: isOn
                      ? t.palette.text.primary
                      : t.palette.text.secondary,
                    lineHeight: "16px",
                    minWidth: 36,
                    textAlign: "left",
                    ml: 0.5,
                  })}
                >
                  {output.name}
                </Typography>

                {/* Hidden live region for screen readers to announce state changes */}
                <Box
                  component="span"
                  sx={{
                    position: "absolute",
                    width: 1,
                    height: 1,
                    padding: 0,
                    margin: -1,
                    overflow: "hidden",
                    clip: "rect(0,0,0,0)",
                    whiteSpace: "nowrap",
                    border: 0,
                  }}
                  aria-live="polite"
                >
                  {`${output.name} ${isOn ? "on" : "off"}`}
                </Box>
              </Box>
            </Tooltip>
          );
        })}
      </Stack>
    </Box>
  );
};

Outputs.propTypes = {
  deviceId: PropTypes.string.isRequired,
  updateInterval: PropTypes.number.isRequired,
};

export default Outputs;
