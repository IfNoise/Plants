import { createRef,useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAddToTrayMutation } from "../../store/trayApi";
import QrScanner from "qr-scanner";
import { Button,IconButton,Popover,Stack, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import QrCode2Icon from '@mui/icons-material/QrCode2';

export default function Scanner() {
  const [open,setOpen]=useState(false)
  const video = createRef(null);
  const [qrScanner, setQrScanner] = useState(null);
  const navigate = useNavigate();
  const [scanResult, setScanResult] = useState(null);
  const [addToTray] = useAddToTrayMutation();
  const store =new Set()
  const addToTrayHandler = () => {
    console.log(scanResult);
    addToTray([scanResult]);
    handlerNext()
  };
  
  function close() {
    setOpen(false)
    qrScanner?.stop();
    qrScanner?.destroy();
    setQrScanner(undefined);
  }
  function handlerNext(){
    if(!qrScanner){
      initScanner()
    }
    setScanResult(null)
  }
  function initScanner(){
    if (video.current) {
      let target = video.current
      const qrScanner = new QrScanner(target, (result) => handleScan(result), {
        highlightScanRegion: true,
        highlightCodeOutline: true,
        maxScansPerSecond:10,
      });
      qrScanner.start();
      setQrScanner(qrScanner);
    }
  }
  function handleScan(result) {
    const data=result.data
    if(!store.has(data)){
    setScanResult(data);
    store.add(result.data)
    console.log(store);}
  }
  const toggleScan=()=>{
    setOpen((prev)=>(!prev))
  }

  useEffect(() => {
    initScanner()
  }, []);

  return (
    <>
      <IconButton onClick={toggleScan}><QrCode2Icon/></IconButton>
      <Popover open={open} onClose={close} sx={{
        width: '500px',
        pt: '100%',
    }}>
        <video  ref={video} style={{width:"100%",height:"auto"}}></video>
        <Typography variant="caption">{scanResult??""}</Typography>
        <Stack sx={{m:1}} direction="row" spacing={1}>
        
        <Button
        variant="outlined"
          sx={{ color: "success" }}
          onClick={() => {
            close()
            navigate(`/plant/${scanResult}`);
          }}
          disabled={!scanResult}
        >
          Details
        </Button>

        <Button  variant="outlined" onClick={handlerNext}>Next</Button>
        <Button variant="outlined" disabled={!scanResult} onClick={addToTrayHandler}>ADD</Button>
        <Button variant="outlined" onClick={close}>
          <CloseIcon />
        </Button>
        </Stack>
      </Popover>
    </>
  );
}
