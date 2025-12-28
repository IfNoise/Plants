import PropTypes from "prop-types";
import OnlinePredictionIcon from "@mui/icons-material/OnlinePrediction";
import ErrorIcon from "@mui/icons-material/Error";

/**
 * Device status icon component
 * @param {Object} props
 * @param {string} props.status - Device status (connected, disconnected, error)
 */
const Status = ({ status }) => {
  switch (status) {
    case "connected":
      return <OnlinePredictionIcon color="success" />;
    case "disconnected":
      return <OnlinePredictionIcon color="gray" />;
    case "error":
      return <ErrorIcon color="red" />;
    default:
      return <OnlinePredictionIcon color="gray" />;
  }
};

Status.propTypes = {
  status: PropTypes.string.isRequired,
};

export default Status;
