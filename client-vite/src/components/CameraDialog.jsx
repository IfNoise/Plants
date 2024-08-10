import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Icon, IconButton } from "@mui/material"
import { useState } from "react"
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import Camera from "react-html5-camera-photo"
import "react-html5-camera-photo/build/css/index.css"

export default function CameraDialog({ onTakePhoto}) {
  const [open, setOpen] = useState(false)
  const onClose = () => setOpen(false)

  return (
  <>
    <IconButton onClick={() => setOpen(true)}  >
      <PhotoCameraIcon />
    </IconButton>
    <Dialog fullScreen open={open} onClose={onClose}>
      <DialogTitle>Take a photo</DialogTitle>
      <DialogContent>
        <Camera
          idealFacingMode="environment"
          isMaxResolution
          imageType="jpg"
          onCameraError={(error) => {
            console.error('onCameraError', error)
          }}

          onTakePhoto={(dataUri) => {
            onTakePhoto(dataUri)
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
    </>
  )
}

