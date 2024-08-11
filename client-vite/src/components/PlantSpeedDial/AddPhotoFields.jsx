
import { useState } from "react";
import CameraDialog from "../CameraDialog";
import { Button, CircularProgress, IconButton, ImageList, ImageListItem, ImageListItemBar } from "@mui/material";
import { addPhotos} from "../../store/newActionSlice";
import { useDispatch } from "react-redux";
import { useUploadPhotosMutation } from "../../store/photoApi";
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export const AddPhotoFields = () => {
  const [photos, setPhotos] = useState([])
  const dispatch = useDispatch()
  const [uploadPhotos,{isLoading,isSuccess,isError}] = useUploadPhotosMutation()

  const handleTakePhoto = (dataUri) => {
    setPhotos([...photos,dataUri]);
  };

  const handleSendPhotos = async () => {
    try {
      const res=await uploadPhotos(photos);
      console.log(res);
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
    {isLoading&&<CircularProgress />}
    {isSuccess&&<CheckCircleIcon color="success"/>}
    {isError&&<CancelIcon color="error"/>}
    <Button disabled={!photos?.length>0 } onClick={handleSendPhotos}>Send Photos</Button>
    </>
  )
}