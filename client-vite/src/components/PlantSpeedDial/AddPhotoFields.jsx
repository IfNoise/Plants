
import { useState } from "react";
import CameraDialog from "../DeviceSettingsList/CameraDialog";
import { ImageList, ImageListItem, ImageListItemBar } from "@mui/material";
import { addPhotos} from "../../store/newActionSlice";
import { useDispatch } from "react-redux";

export const AddPhotoFields = () => {
  const [photoList, setPhotoList] = useState([])
  const dispatch = useDispatch()

  const handleTakePhoto = (dataUri) => {
    setPhotoList([...photoList, dataUri])
    dispatch(addPhotos(photoList))
  }

  return(
    <>
    <CameraDialog onTakePhoto={handleTakePhoto} />
    {photoList.length>0&&<ImageList
      cols={4}
      rowHeight={160}
      style={{width:"100%"}}
    >
      {photoList.map((photo,index)=>(
        <ImageListItem key={index}>
        <ImageListItemBar title={"Photo "+(index+1)} />
        <img src={photo} key={index} />
        </ImageListItem>
      ))}
    </ImageList>}
    </>
  )
}