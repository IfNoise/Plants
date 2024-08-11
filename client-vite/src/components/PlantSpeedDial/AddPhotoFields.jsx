
import { useEffect, useState } from "react";
import CameraDialog from "../CameraDialog";
import { Button, CircularProgress, Divider, IconButton, ImageList, ImageListItem, ImageListItemBar, Input } from "@mui/material";
import { addPhotos} from "../../store/newActionSlice";
import { useDispatch } from "react-redux";
import { useUploadPhotosMutation } from "../../store/photoApi";
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PhotoIcon from '@mui/icons-material/Photo';

export const AddPhotoFields = () => {
  const [photos, setPhotos] = useState([])
  const dispatch = useDispatch()
  const [uploadPhotos,{isLoading,isSuccess,isError,error,data:res}] = useUploadPhotosMutation()

  const handleTakePhoto = (dataUri) => {
    setPhotos([...photos,dataUri]);
  };

  const handleSendPhotos = () => {
    try {
      if(photos.length===0){
        throw new Error('No photos to upload');
      }
      uploadPhotos(photos);  
    } catch (error) {
      console.error('Error uploading photos:', error);
    }
  };
  useEffect(() => {
    if(res?.files?.length>0){
      console.log('Files uploaded:',res.files);
      const files=res.files.map(file=>file.filename);
      dispatch(addPhotos(files));
      console.log('Photos uploaded successfully');
      setPhotos([]);
    }
  }, [res])


  return(
    <>
    <CameraDialog  onTakePhoto={handleTakePhoto} />
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
    type="file" accept="image/*" onChange={(e)=>{
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
          setPhotos([...photos,e.target.result]);
        }
        reader.readAsDataURL(file);
      }
      }/></Button>
    
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
    <Divider />
    <Button disabled={!photos?.length>0 } onClick={handleSendPhotos}>Send Photos</Button>
    </>
  )
}