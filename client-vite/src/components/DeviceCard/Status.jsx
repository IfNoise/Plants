import PropTypes from "prop-types";
import { Badge, Tooltip } from "@mui/material";
import OnlinePredictionIcon from "@mui/icons-material/OnlinePrediction";
import ErrorIcon from "@mui/icons-material/Error";
import CloudOffIcon from "@mui/icons-material/CloudOff";
import useDeviceStatusContext from "../../hooks/useDeviceStatusContext";

/**
 * Device status icon component
 * @param {Object} props
 * @param {string} props.status - Device status (connected, disconnected, error)
 */
const Status = ({ status }) => {
  const { isConnected } = useDeviceStatusContext();

  const getStatusIcon = () => {
    switch (status) {
      case "connected":
        return <OnlinePredictionIcon color="success" />;
      case "disconnected":
        return <OnlinePredictionIcon color="disabled" />;
      case "error":
        return <ErrorIcon color="error" />;
      default:
        return <OnlinePredictionIcon color="disabled" />;
    }
  };

  const getTooltipText = () => {
    if (!isConnected) {
      return "WebSocket disconnected";
    }
    switch (status) {
      case "connected":
        return "Device connected";
      case "disconnected":
        return "Device disconnected";
      case "error":
        return "Device error";
      default:
        return "Unknown status";
    }
  };

  return (
    <Tooltip title={getTooltipText()}>
      <Badge
        overlap="circular"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        variant="dot"
        color={isConnected ? "success" : "error"}
        invisible={isConnected}
        badgeContent={!isConnected ? <CloudOffIcon fontSize="small" /> : null}
      >
        {getStatusIcon()}
      </Badge>
    </Tooltip>
  );
};

Status.propTypes = {
  status: PropTypes.string.isRequired,
};

export default Status;
