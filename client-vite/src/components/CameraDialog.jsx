import { Box,Dialog, IconButton } from "@mui/material"
import { useState } from "react"
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import Camera from "react-html5-camera-photo"
import "react-html5-camera-photo/build/css/index.css"
import CloseIcon from '@mui/icons-material/Close';

export default function CameraDialog({ onTakePhoto}) {
  const [open, setOpen] = useState(false)
  const onClose = () => setOpen(false)

  return (
  <>
    <IconButton onClick={() => setOpen(true)}  >
      <PhotoCameraIcon />
    </IconButton>
    <Dialog 
    sx={{m:0,p:0}}  
    fullScreen open={open} onClose={onClose}>
        <Box sx={{m:0,p:0,position:"relative" }}>
        <Camera
          isFullscreen={true}
          idealFacingMode="environment"
          isMaxResolution={true}

          imageType="jpg"
          onCameraError={(error) => {
            console.error('onCameraError', error)
          }}

          onTakePhoto={(dataUri) => {
            onTakePhoto(dataUri)
          }}
        />
        <IconButton 
        sx={{position: 'absolute',
          top: 10,
          right: 10,
          zIndex: 1000,
          color:"red",
          backgroundColor: 'rgba(255, 255, 255, 0.7)',}}
        onClick={onClose}><CloseIcon/></IconButton>
        </Box>
    </Dialog>
    </>
  )
}

