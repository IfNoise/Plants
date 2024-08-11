
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
  const [uploadPhotos,{isLoading,isSuccess,isError,error}] = useUploadPhotosMutation()

  const handleTakePhoto = (dataUri) => {
    setPhotos([...photos,dataUri]);
  };

  const handleSendPhotos = async () => {
    try {
      if(photos.length===0){
        throw new Error('No photos to upload');
      }
      const res=await uploadPhotos(photos);
      console.log(res);
      if (res.error) {  
        throw new Error(res.error.message);
      }
      if(res.files?.length>0){ 
      dispatch(addPhotos(res.files.map(file=>file.filename)));
      console.log('Photos uploaded successfully');
      setPhotos([]);
      }
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
    {isError&&<pre>{JSON.stringify(error)}</pre>}
    <Button disabled={!photos?.length>0 } onClick={handleSendPhotos}>Send Photos</Button>
    </>
  )
}