import { useRef, useState, useEffect} from "react";
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

var audioCtx = new (window.AudioContext || window.webkitAudioContext || window.audioContext);

//All arguments are optional:

//duration of the tone in milliseconds. Default is 500
//frequency of the tone in hertz. default is 440
//volume of the tone. Default is 1, off is 0.
//type of tone. Possible values are sine, square, sawtooth, triangle, and custom. Default is sine.
//callback to use on end of tone
function beep(duration, frequency, volume, type, callback) {
    var oscillator = audioCtx.createOscillator();
    var gainNode = audioCtx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    if (volume){gainNode.gain.value = volume;}
    if (frequency){oscillator.frequency.value = frequency;}
    if (type){oscillator.type = type;}
    if (callback){oscillator.onended = callback;}
    
    oscillator.start(audioCtx.currentTime);
    oscillator.stop(audioCtx.currentTime + ((duration || 500) / 1000));
}

export default function Scanner() {
  const isSmall = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const [plant, setPlant] = useState(null);//
  const [open, setOpen] = useState(false);
  const video = useRef(null);
  const [qrScanner, setQrScanner] = useState(null);
  const navigate = useNavigate();
  const [scanResult, setScanResult] = useState("");
  const {isLoading,isError,error,data}=useGetPlantsQuery({_id:scanResult})
  const [addToTray] = useAddToTrayMutation();
  const store = new Set();
  const addToTrayHandler = () => {
    console.log(scanResult);
    addToTray([scanResult]);
    beep(120, 60, 0.4, "square")
    handlerNext();
  };

  function close() {
    qrScanner?.stop();
    qrScanner?.destroy();
    setScanResult(null);
    setQrScanner(null);
    setPlant(null);
    setOpen(false);
  }
  function handlerNext() {
    
    if(qrScanner){
      qrScanner?.start()
      console.log('start');
    }else initScanner();
    setPlant(null);
  }
  function handleScan(result) {
    const data = result.data;
    if (!store.has(data)) {
      setScanResult(data);
      store.add(result.data);
      console.log(store);
      beep(100, 580, 0.7, "sine", () => {
        console.log("beep");
      });
    }}
  const initScanner=()=> {
    
    if (Object.keys(video.current).length !== 0) {
      let target = video.current;
      const newQrScanner = new QrScanner(target, (result) => handleScan(result), {
        highlightScanRegion: true,
        highlightCodeOutline: true,
        maxScansPerSecond: 10,
      });
      setQrScanner(newQrScanner);
      newQrScanner.start();
    }
  };
     
  const toggleScan = () => {
    setOpen((prev) => !prev);
  };

  useEffect(() => {
    if(Array.isArray(data)&&data?.length>0){
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
        <Box component='div' style={{ position: "relative",height:"100%"}}>
          <video
            ref={video}
            style={{ width: "100%", height: "auto", display: "block" }}
          >
          </video>
          <Box sx={{
              left:30,
              position: "absolute",
              top: 0,
              zIndex: 1,
              width: "90%",
            }} >              
               <IconButton
              variant="outlined"
              onClick={close}
              size="small"
              sx={{
              right: 0,
              position: "absolute",
              borderColor: "red",
              borderWidth:"2px",
              borderBlockColor:"red",
               color: "red"
               }}
            >
              <CloseIcon fontSize="medium"/>
            </IconButton>
          {isError && <Typography variant="caption">{error.message}</Typography>}
          {isLoading && <Typography variant="caption">Loading...</Typography>}
          {plant && (
            <Card variant="outlined" sx={{backgroundColor: "transparent",border:"none"}}>
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
          </Box>
          <DialogActions
            sx={{
              left:30,
              position: "absolute",
              bottom: 0,
              zIndex: 1,
              width: "80%",
              justifyContent: "center",
            }}
          >
            <Button
              variant="outlined"
              sx={{ borderColor: "red",borderWidth:"2px",borderBlockColor:"red", color: "red" }}
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
              disabled={!scanResult}
              onClick={addToTrayHandler}
              sx={{ borderColor: "red",borderWidth:"2px",borderBlockColor:"red", color: "red",
              height:"100px" ,width:"100px",borderRadius:"50%"}}
            >
              ADD
            </Button>
            <Button
              variant="outlined"
              onClick={handlerNext}
              sx={{ borderColor: "red",borderWidth:"2px",borderBlockColor:"red", color: "red" }}
            >
              Next
            </Button>


          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
}
