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
  Popover,
  Stack,
  SvgIcon,
  ToggleButton,
  ToggleButtonGroup,
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
import { set } from "mongoose";

const PickingIcon = () => {
  return (
    <SvgIcon
      sx={{ color: "red", width: "48px", height: "48px" }}
      viewBox="0 0 24 24"
    >
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        version="1.1"
        id="svg5"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="layer1">
          <path
            style={{
              fill: "none",
              stroke: "red",
              strokeWidth: 3,
              strokeLinecap: "round",
              strokeLinejoin: "round",
              strokeMiterlimit: 4,
              strokeDasharray: "none",
              strokeOpacity: 1,
            }}
            d="M 5.2291192,42.722255 3.2565526,23.245197 18.699196,23.219956 17.115306,42.733435 Z"
            id="path1600"
          />
          <path
            style={{
              fill: "none",
              stroke: "red",
              strokeWidth: 3,
              strokeLinecap: "round",
              strokeLinejoin: "round",
              strokeMiterlimit: 4,
              strokeDasharray: "none",
              strokeOpacity: 1,
            }}
            d="m 26.913327,42.343204 -3.624089,-25.807942 21.092454,0.0406 -3.281325,25.817295 z"
            id="path1600-3"
          />
          <path
            style={{
              fill: "none",
              stroke: "red",
              strokeWidth: 3,
              strokeLinecap: "butt",
              strokeLinejoin: "miter",
              strokeMiterlimit: 4,
              strokeDasharray: "none",
              strokeOpacity: 1,
            }}
            d="M 9.184941,18.084149 C 10.556713,4.6918471 18.379601,2.5576131 24.923475,3.8453976 28.88262,4.6245272 32.729499,8.345972 33.218914,11.846946"
            id="path1744"
          />
          <path
            style={{
              fill: "red",
              fillOpacity: 1,
              stroke: "red",
              strokeWidth: 2.97249,
              strokeLinecap: "butt",
              strokeLinejoin: "miter",
              strokeMiterlimit: 4,
              strokeDasharray: "none",
              strokeOpacity: 1,
            }}
            d="m 31.999552,6.8028442 0.532972,2.2047321 0.68639,2.8393697 -1.327536,-1.078973 -2.746857,-2.2325463 z"
            id="path2034"
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

const PotIcon = ({ value, color = "black" }) => {
  const displayValue = value.toString().replace(/^0+/, '');
  return (
    <SvgIcon
      sx={{ color, width: "48px", height: "48px" }}
      viewBox="0 0 24 24"
    >
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        version="1.1"
        id="svg5"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="layer1">
          <path
            style={{
              fill: "none",
              stroke: color,
              strokeWidth: 4.50505,
              strokeLinecap: "round",
              strokeLinejoin: "round",
              strokeMiterlimit: 4,
              strokeDasharray: "none",
              strokeOpacity: 1,
            }}
            d="M 13.950823,43.428599 8.4573519,5.034763 l 31.9723931,0.0604 -4.973903,38.40775 z"
            id="path1600-3"
          />
          <text x="24" y="24" textAnchor="middle" fontSize="10" fill="black" dy=".3em">{displayValue}</text>
        </g>
      </svg>
    </SvgIcon>
  );
};

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
  beep(120, 100, 0.3, "square");
};

const FastPickButton = () => {
  const [addAction, { isSuccess,isError,error }] = useAddActionMutation();
  const [anchorEl, setAnchorEl] = useState(null);

  const { data } = useGetTrayQuery({
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
    refetchOnMount: true,
  });
  const { setSnack } = useContext(SnackbarContext);
  const [open, setOpen] = useState(false);
  const [potSize, setPotSize] = useState("");
  const handleClick = async () => {
    const action = {
      id: data.map((item) => item._id),
      action: {
        actionType: "Picking",
        potSize,
      },
    };
    addAction(action);
  };
  const handleClose = () => {

    setAnchorEl(null);
  };
  useEffect(() => {
    if (isSuccess) {
      setSnack({ open: true, severity: "success", message: "Picked" });
      okSnd();
      setOpen(false);
      setAnchorEl(null);
    }
  }, [isSuccess]);
  useEffect(() => {
    if (isError) {
      setSnack({ open: true, severity: "error", message: error.message });
      errorSnd();
    }
  }, [isError]);

  return (
    <>
      {data?.length > 0 && (
        <IconButton
          variant="outlined"
          onClick={(e) => {
            if(anchorEl) return;
            setAnchorEl(e.currentTarget);
            setOpen(true)}}
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
          }}
        >
          <PickingIcon />
        </IconButton>
      )}
      <Popover 
      open={open} 
      anchorEl={anchorEl}
      onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
      >
        <Stack direction="column" spacing={1}
        sx={{ p: 1 }}
        >
          <ToggleButtonGroup
            value={potSize}
            orientation="vertical"
            exclusive
            onChange={(e, value) => setPotSize(value)}
            aria-label="text alignment"
            size="medium"
          >
            <ToggleButton value={"0.25L"} aria-label="left aligned">
              <PotIcon value={0.25} color="white" />
            </ToggleButton>
            <ToggleButton value={"1L"} aria-label="centered">
              <PotIcon value={1} color="white"/>
            </ToggleButton>
            <ToggleButton value={"4L"} aria-label="right aligned">
              <PotIcon value={4} color="white" />
            </ToggleButton>
            <ToggleButton value={"7L"} aria-label="right aligned">
              <PotIcon value={7} color="white" />
            </ToggleButton>
          </ToggleButtonGroup>
        
        <Button variant="filled" onClick={handleClick} sx={{ width: '100%' }}>
          ok
        </Button>
        <Button variant="filled" onClick={() => setOpen(false)} sx={{ width: '100%'}}>
          cancel
        </Button>
        </Stack>
      </Popover>
    </>
  );
};

const FastRelocationButton = ({ address }) => {
  const [addAction, { isSuccess }] = useAddActionMutation();
  const { data } = useGetTrayQuery({
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
    refetchOnMount: true,
  });
  const { setSnack } = useContext(SnackbarContext);
  const handleClick = async () => {
    const action = {
      id: data.map((item) => item._id),
      action: {
        address,
        actionType: "Relocation",
      },
    };
    addAction(action);
    okSnd();
  };
  useEffect(() => {
    if (isSuccess) {
      setSnack({ open: true, severity: "success", message: "Relocated" });
    }
  }, [isSuccess]);

  return (
    <>
      {data?.length > 0 && (
        <IconButton
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
          }}
        >
          <ArrowForwardIcon fontSize="40" />
        </IconButton>
      )}
    </>
  );
};
FastRelocationButton.propTypes = {
  address: PropTypes.object,
};

export default function Scanner({ output }) {
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
      okSnd();
    } else {
      console.error("setOutput is not a function");
      errorSnd();
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
        errorSnd();
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
                <FastPickButton />
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
                <FastRelocationButton
                  plants={Array.from(store)}
                  address={addressRes}
                />
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
