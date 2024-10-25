import { useRef, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { SnackbarContext } from "../../context/SnackbarContext";
import { useAddToTrayMutation, useGetTrayQuery } from "../../store/trayApi";
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
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import { useMediaQuery } from "@mui/material";
import { useAddActionMutation, useGetPlantsQuery } from "../../store/plantsApi";
import { AddPhotoFast } from "../AddPhotoFast";
import { TrayButton } from "../TrayButton/TrayButton";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useDispatch } from "react-redux";

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
const okSnd = () => {
  beep(100, 580, 0.7, "sine");
};

const errorSnd = () => {
  beep(120, 60, 0.4, "square");
};

const addedSnd = () => {
  beep(120, 100, 0.4, "square");
};
const FastRelocationButton = ({ plants, address }) => {
  const {dispatch} = useDispatch()
  const [addAction,{isSuccess}] = useAddActionMutation();
  const { data} = useGetTrayQuery({
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
    refetchOnMount: true,
  })
  const {setSnack} = useContext(SnackbarContext);  
  console.log("Plants",plants);
  console.log("Address",address);
  const handleClick = async () => {
    
    const action = {
      id: data.map((item)=>item._id), 
      action:{
        address,
        actionType: "Relocation",
      },
    };
    addAction(action);
  };
  useEffect(() => {
    if(isSuccess){
      setSnack({open:true,severity:'success',message:'Relocated'})
    }
  }, [isSuccess])

  return (<>
     {
      data?.length>0 && 
      (<IconButton
        variant="outlined"
        onClick={handleClick}
        sx={{
          backgroundColor: "transparent",
          borderStyle: "solid",
          width: "80px",
          height: "80px",
          borderColor: "red",
          borderWidth: "2px",
          borderBlockColor: "red",
          color: "red",
          borderRadius: "50%",
        }}>
        <ArrowForwardIcon fontSize="40" />
      </IconButton>)
     }
     </>
  )
};
FastRelocationButton.propTypes = {
  plants: PropTypes.array,
  address: PropTypes.object,
};


export default function Scanner({ output }) {
  console.log(output);
  const isSmall = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const [plant, setPlant] = useState(null); //
  const [open, setOpen] = useState(false);
  const [openPhoto, setOpenPhoto] = useState(false);
  const video = useRef(null);
  const [qrScanner, setQrScanner] = useState(null);
  const navigate = useNavigate();
  const [scanResult, setScanResult] = useState(null);
  const [idResult, setIdResult] = useState(null);
  const [addressRes, setAddressRes] = useState(null); //
  const { isLoading, isError, error, data } = useGetPlantsQuery({
    _id: idResult,
  });
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
  function okHandler() {
    addedSnd();
    if (typeof output === "function") {
      output(addressRes);
    } else {
      console.error("setOutput is not a function");
    }
    //setAddressRes(null);
    close();
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
    }
  };

  const toggleScan = () => {
    setOpen((prev) => !prev);
  };

  useEffect(() => {
    let id;
    let address;
    if (!scanResult) return;
    if (scanResult?.length === 24) id = scanResult;
    else
      try {
        const json = JSON.parse(scanResult);
        if (json.type === "plant") id = json.id;
        if (json.type === "address") {
          const { type, room, ...scAddr } = json;
          const roomWithSpace = room.replace(/_/g, " ");

          address = { room: roomWithSpace, ...scAddr };
        }
      } catch (e) {
        console.log(e);
      }
    if (id) {
      okSnd();
      setIdResult(id);
      if (!store.has(id)) {
        setScanResult({ id });
        store.add(id);
      }
    }
    if (address) {
      okSnd();
      if (JSON.stringify(tempAddress.current) === JSON.stringify(address))
        return;
      if (address?.building) {
        tempAddress.current = address;
        setAddressRes(address);
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
    p: 0,
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
              right: "10px",
              position: "absolute",
              top: "10px",
              zIndex: 1,
              width: "90%",
            }}
          >
            <TrayButton />
            <IconButton
              variant="outlined"
              onClick={close}
              size="large"
              sx={{
                fontSize: "40px",
                right: 0,
                position: "absolute",
                borderColor: "red",
                borderStyle: "solid",
                borderWidth: "2px",
                borderBlockColor: "red",
                color: "red",
                height: "50px",
                width: "50px",
              }}
            >
              <CloseIcon fontSize="40" />
            </IconButton>
            {isError && (
              <Typography variant="caption">{error.message}</Typography>
            )}
            {isLoading && <Typography variant="caption">Loading...</Typography>}
            {plant && (
              <Box
                sx={{
                  backgroundColor: "transparent",
                  border: "none",
                  padding: "0px",
                }}
              >
                <Typography variant="h3" color="yellow" fontWeight="bold">
                  {plant?.strain || "Unknown"}
                </Typography>
                <Typography variant="h5" color="yellow" fontWeight="bold">
                  {plant?.pheno || "Unknown"} {plant?.state || "Unknown"}
                </Typography>
                <Box
                  sx={{
                    width: "25%",
                  }}
                >
                  <Typography
                    variant="body"
                    color="fuchsia"
                    fontWeight="bold"
                    sx={{
                      wordWrap: "normal",
                      overflow: "hidden",
                    }}
                  >
                    {`Building: ${plant.currentAddress?.building || "Unknown"}
                    Room: ${plant.currentAddress?.room || "Unknown"}
                    Row: ${plant.currentAddress?.row || "Unknown"}
                    Tray: ${plant.currentAddress?.tray || "Unknown"}
                  `}
                  </Typography>
                </Box>
              </Box>
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
                    backgroundColor: "transparent",
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
                    fontSize: "20px",
                    fontWeight: "bold",
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
                <IconButton
                  onClick={() => {
                    setOpenPhoto(true);
                  }}
                  size="large"
                  sx={{
                    fontSize: "40px",
                    borderColor: "red",
                    borderWidth: "2px",
                    borderBlockColor: "red",
                    borderStyle: "solid",
                    color: "red",
                    borderRadius: "50%",
                  }}
                >
                  <AddAPhotoIcon fontSize="28px" />
                </IconButton>
              </>
            )}
            {addressRes && (
              <>
                <Button
                  href={`/plants?${params}`}
                  variant="outlined"
                  sx={{
                    backgroundColor: "transparent",
                    borderColor: "red",
                    borderWidth: "2px",
                    borderBlockColor: "red",
                    color: "red",
                  }}
                  disabled={!addressRes}
                >
                  Details
                </Button>
                <FastRelocationButton plants={Array.from(store)} address={addressRes} />
                {typeof output === "function" && (
                  <Button
                    variant="outlined"
                    onClick={okHandler}
                    sx={{
                      backgroundColor: "transparent",
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
                  
                )}
                 
              </>
            )}
            <Button
              variant="outlined"
              onClick={handlerNext}
              sx={{
                backgroundColor: "transparent",
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
      <AddPhotoFast
        open={openPhoto}
        onClose={() => setOpenPhoto(false)}
        plants={[{ _id: idResult }]}
      />
    </>
  );
}
Scanner.propTypes = {
  output: PropTypes.func,
};
