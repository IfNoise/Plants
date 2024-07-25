import { useRef, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useAddToTrayMutation } from "../../store/trayApi";
import QrScanner from "qr-scanner";
import {
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import { useMediaQuery } from "@mui/material";
import { useGetPlantsQuery } from "../../store/plantsApi";

var audioCtx = new (window.AudioContext ||
  window.webkitAudioContext ||
  window.audioContext)();


function beep(duration, frequency, volume, type, callback) {
  var oscillator = audioCtx.createOscillator();
  var gainNode = audioCtx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  if (volume) {
    gainNode.gain.value = volume;
  }
  if (frequency) {
    oscillator.frequency.value = frequency;
  }
  if (type) {
    oscillator.type = type;
  }
  if (callback) {
    oscillator.onended = callback;
  }

  oscillator.start(audioCtx.currentTime);
  oscillator.stop(audioCtx.currentTime + (duration || 500) / 1000);
}
const okSnd=()=>{
  beep(100, 580, 0.7, "sine");
}

const errorSnd=()=>{
  beep(120, 60, 0.4, "square");
}

const addedSnd=()=>{
  beep(120, 100, 0.4, "square");
}

export default function Scanner({ setOutput }) {
  const isSmall = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const [plant, setPlant] = useState(null); //
  const [open, setOpen] = useState(false);
  const video = useRef(null);
  const [qrScanner, setQrScanner] = useState(null);
  const navigate = useNavigate();
  const [scanResult, setScanResult] = useState(null);
  const [idResult, setIdResult] = useState(null);
  const [addressRes, setAddressRes] = useState(null); //
  const { isLoading, isError, error, data } = useGetPlantsQuery(
    { _id: idResult }
  );
  const [addToTray] = useAddToTrayMutation();
  const store = new Set();
  const params = new URLSearchParams({ ...addressRes });

  const tempAddress = useRef(null);
  const tempRes = useRef(null); 

  const addToTrayHandler = () => {
    addToTray([idResult]);
    addedSnd();
    handlerNext();
  };

  function close() {
    qrScanner?.stop();
    qrScanner?.destroy();
    setScanResult(null);
    setQrScanner(null);
    setPlant(null);
    setOpen(false);
    setIdResult(null);
    setAddressRes(null);
  }
  function handlerNext() {
    if (qrScanner) {
      qrScanner?.start();
      console.log("start");
    } else initScanner();
    setPlant(null);
    setScanResult(null);
    setIdResult(null);
    setAddressRes(null);
  }
  function handleScan(result) {
    const data = result.data;
    if (tempRes.current === data) return;
    tempRes.current = data;
    setScanResult(data);
  }
  const initScanner = () => {
    if (Object.keys(video.current).length !== 0) {
      let target = video.current;
      const newQrScanner = new QrScanner(
        target,
        (result) => handleScan(result),
        {
          highlightScanRegion: true,
          highlightCodeOutline: true,
          maxScansPerSecond: 10,
        }
      );
      setQrScanner(newQrScanner);
      newQrScanner.start();
      console.log("init");
    }
  };

  const toggleScan = () => {
    setOpen((prev) => !prev);
  };

  useEffect(() => {
    let id;
    let address;
    if(!scanResult)return
    if (scanResult?.length === 24) id = scanResult;
    else try {
      const json = JSON.parse(scanResult);
      if (json.type === "plant") id = json.id;
      if (json.type === "address") address = { ...json.address };
    } catch (e) {
      console.log(e);
    }
    if (id) {
      setIdResult(id);
      if (!store.has(id)) {
        setScanResult({ id });
        store.add(id);
        console.log(store);
        okSnd();
      }
    }
    if (address) {
      if (JSON.stringify(tempAddress.current) === JSON.stringify(address)) return;
      if (address?.building) {
        tempAddress.current = address;
        setAddressRes(address);
        okSnd();
      }
    }
  }, [scanResult]);

  useEffect(() => {
    if (Array.isArray(data) && data?.length > 0) {
      setPlant(data[0]);
    }
  }, [data]);
  const style = {
    width: "100%",
    bottom: 0,
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
        <Box component="div" style={{ position: "relative", height: "100%" }}>
          <video
            ref={video}
            style={{ width: "100%", height: "auto", display: "block" }}
          ></video>
          <Box
            sx={{
              left: 30,
              position: "absolute",
              top: 0,
              zIndex: 1,
              width: "90%",
            }}
          >
            <IconButton
              variant="outlined"
              onClick={close}
              size="large"
              sx={{
                right: 0,
                position: "absolute",
                borderColor: "red",
                borderWidth: "2px",
                borderBlockColor: "red",
                color: "red",
              }}
            >
              <CloseIcon fontSize="medium" />
            </IconButton>
            {isError && (
              <Typography variant="caption">{error.message}</Typography>
            )}
            {isLoading && <Typography variant="caption">Loading...</Typography>}
            {plant && (
              <Card
                variant="outlined"
                sx={{ backgroundColor: "transparent", border: "none" }}
              >
                <Typography variant="h2" color="yellow">
                  {plant.strain}
                </Typography>
                <Typography variant="h5" color="yellow">
                  {plant.pheno} {plant.state}
                </Typography>
                <Typography variant="h7" color="fuchsia">
                  {plant._id}
                </Typography>
              </Card>
            )}
            {addressRes && (
              <Card
                variant="outlined"
                sx={{ backgroundColor: "transparent", border: "none" }}
              >
                <Typography variant="h2" color="yellow">
                  {addressRes?.building}
                </Typography>
                <Typography variant="h5" color="yellow">
                  {addressRes?.room}
                </Typography>
                <Typography variant="h7" color="fuchsia">
                  {addressRes?.row}
                </Typography>
                <Typography variant="h7" color="fuchsia">
                  {addressRes?.tray}
                </Typography>
                <Typography variant="h7" color="fuchsia">
                  {addressRes?.rack}
                </Typography>
                <Typography variant="h7" color="fuchsia">
                  {addressRes?.shelf}
                </Typography>
              </Card>
            )}
          </Box>
          <DialogActions
            sx={{
              left: 30,
              position: "absolute",
              bottom: 0,
              zIndex: 1,
              width: "80%",
              justifyContent: "center",
            }}
          >
            {idResult && (
              <>
                <Button
                  variant="outlined"
                  sx={{
                    borderColor: "red",
                    borderWidth: "2px",
                    borderBlockColor: "red",
                    color: "red",
                  }}
                  onClick={() => {
                    close();
                    navigate(`/plant/${idResult}`);
                  }}
                  disabled={!idResult}
                >
                  Details
                </Button>
                <Button
                  variant="outlined"
                  disabled={!idResult}
                  onClick={addToTrayHandler}
                  sx={{
                    borderColor: "red",
                    borderWidth: "2px",
                    borderBlockColor: "red",
                    color: "red",
                    height: "100px",
                    width: "100px",
                    borderRadius: "50%",
                  }}
                >
                  ADD
                </Button>
              </>
            )}
            {addressRes && (
              <>
                <Button
                  href={`/plants/${params}`}
                  variant="outlined"
                  sx={{
                    borderColor: "red",
                    borderWidth: "2px",
                    borderBlockColor: "red",
                    color: "red",
                  }}
                  disabled={!addressRes}
                >
                  Details
                </Button>

                <Button
                  variant="outlined"
                  onClick={() => {
                    added();
                    if(setOutput) setOutput({...addressRes});
                    setAddressRes(null);
                    close();
                  }}
                  sx={{
                    borderColor: "red",
                    borderWidth: "2px",
                    borderBlockColor: "red",
                    color: "red",
                    height: "100px",
                    width: "100px",
                    borderRadius: "50%",
                  }}
                >
                  OK
                </Button>
              </>
            )}
            <Button
              variant="outlined"
              onClick={handlerNext}
              sx={{
                borderColor: "red",
                borderWidth: "2px",
                borderBlockColor: "red",
                color: "red",
              }}
            >
              Next
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
}
Scanner.propTypes = {
  setOutput: PropTypes.func,
};
