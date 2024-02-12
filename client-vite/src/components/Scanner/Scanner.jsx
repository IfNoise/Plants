import { createRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAddToTrayMutation } from "../../store/trayApi";
import QrScanner from "qr-scanner";
import {
  Button,
  Dialog,
  DialogActions,
  IconButton,
  Popover,
  Stack,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import { useMediaQuery } from "@mui/material";

export default function Scanner() {
  const isSmall = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  const [open, setOpen] = useState(false);
  const video = createRef(null);
  const [qrScanner, setQrScanner] = useState(null);
  const navigate = useNavigate();
  const [scanResult, setScanResult] = useState(null);
  const [addToTray] = useAddToTrayMutation();
  const store = new Set();
  const addToTrayHandler = () => {
    console.log(scanResult);
    addToTray([scanResult]);
    handlerNext();
  };

  function close() {
    setOpen(false);
    qrScanner?.stop();
    qrScanner?.destroy();
    setQrScanner(undefined);
  }
  function handlerNext() {
    if (!qrScanner) {
      initScanner();
    }
    setScanResult(null);
  }
  function initScanner() {
    if (video.current) {
      let target = video.current;
      const qrScanner = new QrScanner(target, (result) => handleScan(result), {
        highlightScanRegion: true,
        highlightCodeOutline: true,
        maxScansPerSecond: 10,
      });
      qrScanner.start();
      setQrScanner(qrScanner);
    }
  }
  function handleScan(result) {
    const data = result.data;
    if (!store.has(data)) {
      setScanResult(data);
      store.add(result.data);
      console.log(store);
    }
  }
  const toggleScan = () => {
    setOpen((prev) => !prev);
  };

  useEffect(() => {
    initScanner();
  }, []);

  const style = {
    width: "100%",
  };
  return (
    <>
      <IconButton onClick={toggleScan}>
        <QrCode2Icon />
      </IconButton>
      <Dialog
        open={open}
        onClose={close}
        style={style}
        fullScreen={isSmall}
        maxWidth="sm"
      >
        <div style={{ position: "relative" }}>
          <video
            ref={video}
            style={{ width: "100%", height: "auto", display: "block" }}
          ></video>
          <Typography variant="caption">{scanResult ?? ""}</Typography>
          <DialogActions
            sx={{
              left:30,
              position: "absolute",
              bottom: 0,
              zIndex: 1,
              width: "90%",
            }}
          >
            <Button
              variant="outlined"
              sx={{ borderColor: "yellow", color: "yellow" }}
              onClick={() => {
                close();
                navigate(`/plant/${scanResult}`);
              }}
              disabled={!scanResult}
            >
              Details
            </Button>

            <Button
              variant="outlined"
              onClick={handlerNext}
              sx={{ borderColor: "yellow", color: "yellow" }}
            >
              Next
            </Button>
            <Button
              variant="outlined"
              disabled={!scanResult}
              onClick={addToTrayHandler}
              sx={{ borderColor: "yellow", color: "yellow" }}
            >
              ADD
            </Button>
            <Button
              variant="outlined"
              onClick={close}
              sx={{ borderColor: "yellow", color: "yellow" }}
            >
              <CloseIcon />
            </Button>
          </DialogActions>
        </div>
      </Dialog>
    </>
  );
}
