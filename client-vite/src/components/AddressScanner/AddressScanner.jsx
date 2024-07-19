import { useRef, useState} from "react";
import PropTypes from "prop-types";
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

var audioCtx = new (window.AudioContext || window.webkitAudioContext || window.audioContext);

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

export default function AddressScanner({setOutput}) {
  const isSmall = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const [address, setAddress] = useState(null);//
  const [open, setOpen] = useState(false);
  const video = useRef(null);
  const [qrScanner, setQrScanner] = useState(null);
  let tempAddress = null;
  
  function close() {
    qrScanner?.stop();
    qrScanner?.destroy();
    setQrScanner(null);
    setAddress(null);
    setOpen(false);
  }
  function handlerNext() {
    
    if(qrScanner){
      qrScanner?.start()
      console.log('start');
    }else initScanner();
    setAddress(null);
  }
  function handleScan(result) {
    const data = JSON.parse(result.data);
    if(JSON.stringify(tempAddress) === JSON.stringify(data)) return;
    if (data?.building) {
      tempAddress = data;
      setAddress(data);
      beep(100, 580, 0.7, "sine");
    }else{
      beep(120, 60, 0.4, "square")
    }
  }
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

  const style = {
    width: "100%",
    bottom: 0,
  };
  return (
    <>
      <IconButton onClick={toggleScan} size="large">
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
              size="large"
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
          {address && (
            <Card variant="outlined" sx={{backgroundColor: "transparent",border:"none"}}>
            <Typography variant="h2" color="yellow">
              {address?.building}
            </Typography>
              <Typography variant="h5" color="yellow">
              {address?.room}
            </Typography>
            <Typography variant="h7" color="fuchsia">
              {address?.row}
            </Typography>
            <Typography variant="h7" color="fuchsia">
              {address?.tray}
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
              disabled={!address}
              onClick={
                () => {
                  setOutput(address);
                  close();
                }
              }
              sx={{ borderColor: "red",borderWidth:"2px",borderBlockColor:"red", color: "red",
              height:"100px" ,width:"100px",borderRadius:"50%"}}
            >
              OK
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
AddressScanner.propTypes = {
  setOutput: PropTypes.func.isRequired,
};

