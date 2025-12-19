
import { useState } from "react";
import CameraDialog from "../CameraDialog";
import { Button, IconButton, ImageList, ImageListItem, ImageListItemBar, Input } from "@mui/material";
import CancelIcon from '@mui/icons-material/Cancel';
import PhotoIcon from '@mui/icons-material/Photo';
import PropTypes from "prop-types";

export const AddPhotoFields = ({ onPhotosChange }) => {
  const [photos, setPhotos] = useState([]);

  const handleTakePhoto = (dataUri) => {
    const newPhotos = [...photos, dataUri];
    setPhotos(newPhotos);
    onPhotosChange(newPhotos);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const newPhotos = [...photos, e.target.result];
      setPhotos(newPhotos);
      onPhotosChange(newPhotos);
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = (index) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    setPhotos(newPhotos);
    onPhotosChange(newPhotos);
  };

  return(
    <>
    <CameraDialog onTakePhoto={handleTakePhoto} />
    <Button 
    sx={{m:2}}
    component="label"
    role={undefined}
    variant="contained"
    tabIndex={-1}
    startIcon={<PhotoIcon/>}>
      Select Photos
    <Input 
    sx={{
      clip: 'rect(0 0 0 0)',
      clipPath: 'inset(50%)',
      height: 1,
      overflow: 'hidden',
      position: 'absolute',
      bottom: 0,
      left: 0,
      whiteSpace: 'nowrap',
      width: 1,
    }}
    type="file" 
    accept="image/*" 
    onChange={handleFileSelect}
    /></Button>
    
    {photos.length > 0 && (
      <ImageList
        cols={4}
        rowHeight={160}
        style={{width:"100%"}}
      >
        {photos.map((photo, index) => (
          <ImageListItem key={index}>
            <ImageListItemBar 
              title={"Photo " + (index + 1)} 
              actionIcon={
                <IconButton onClick={() => handleRemovePhoto(index)}>
                  <CancelIcon/>
                </IconButton>
              }
              actionPosition="top"
            />
            <img src={photo} alt={`Preview ${index + 1}`} />
          </ImageListItem>
        ))}
      </ImageList>
    )}
    </>
  );
};

AddPhotoFields.propTypes = {
  onPhotosChange: PropTypes.func.isRequired,
};