import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

import PropTypes from "prop-types";

export default function AreYouSure({
  show,
  onCancel,
  onConfirm,
  message = "Are you sure?",
}) {
  return (
    <Dialog open={show}>
      <DialogTitle>Are you sure?</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button onClick={onConfirm}>Yes</Button>
      </DialogActions>
    </Dialog>
  );
}

AreYouSure.propTypes = {
  show: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  message: PropTypes.string,
};
