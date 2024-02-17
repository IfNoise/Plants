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
          {isError && <Typography variant="caption">{error.message}</Typography>}
          {isLoading && <Typography variant="caption">Loading...</Typography>}
          {plant && (
            <Card variant="outlined" sx={{backgroundColor: "transparent",border:"none"}}>
            <Typography variant="h5">
              {plant.strain} 
              </Typography>
              <Typography variant="body2" >
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
              onClick={handlerNext}
              sx={{ borderColor: "red",borderWidth:"2px",borderBlockColor:"red", color: "red" }}
            >
              Next
            </Button>
            <Button
              variant="outlined"
              disabled={!scanResult}
              onClick={addToTrayHandler}
              sx={{ borderColor: "red",borderWidth:"2px",borderBlockColor:"red", color: "red" }}
            >
              ADD
            </Button>
            <Button
              variant="outlined"
              onClick={close}
              sx={{ borderColor: "red",borderWidth:"2px",borderBlockColor:"red", color: "red" }}
            >
              <CloseIcon />
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
}
