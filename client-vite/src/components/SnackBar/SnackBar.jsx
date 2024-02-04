import * as React from 'react';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { SnackbarContext } from '../../context/SnackbarContext';
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function SnackBar() {

  const { snack,setSnack} = React.useContext(SnackbarContext);
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnack({open:false});
  };
  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
      <Snackbar open={snack.open} autoHideDuration={3000} onClose={handleClose}>
        <Alert  severity={snack.severity} sx={{ width: '90vw' } } onClose={handleClose}>
          {snack.message}
        </Alert>
      </Snackbar>
    </Stack>
  );
}