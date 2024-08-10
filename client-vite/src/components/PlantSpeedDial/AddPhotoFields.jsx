
import { useState } from "react";
import CameraDialog from "../CameraDialog";
import { Button, IconButton, ImageList, ImageListItem, ImageListItemBar } from "@mui/material";
import { addPhotos} from "../../store/newActionSlice";
import { useDispatch } from "react-redux";
import { useUploadPhotosMutation } from "../../store/photoApi";
import CancelIcon from '@mui/icons-material/Cancel';

export const AddPhotoFields = () => {
  const [photos, setPhotos] = useState([])
  const dispatch = useDispatch()
  const [uploadPhotos] = useUploadPhotosMutation()

  const handleTakePhoto = (dataUri) => {
    setPhotos([...photos,dataUri]);
  };

  const handleSendPhotos = async () => {
    try {
      const res=await uploadPhotos(photos).unwrap();
      dispatch(addPhotos(res.files.map(file=>file.filename)));
      console.log('Photos uploaded successfully');
    } catch (error) {
      console.error('Error uploading photos:', error);
    }
  };

  return(
    <>
    <CameraDialog  onTakePhoto={handleTakePhoto} />
    {photos.length>0&&<ImageList
      cols={4}
      rowHeight={160}
      style={{width:"100%"}}
    >
      {photos.map((photo,index)=>(
        <ImageListItem key={index}>
        <ImageListItemBar 
        title={"Photo "+(index+1)} 
        actionIcon={
          <IconButton onClick={()=>setPhotos(photos.filter((_,i)=>i!==index))}><CancelIcon/></IconButton>
        }
        actionPosition="top"
        />
        <img src={photo} key={index} />
        </ImageListItem>
      ))}
    </ImageList>}
    <Button onClick={handleSendPhotos}>Send Photos</Button>
    </>
  )
}