
import { useState } from "react";
import CameraDialog from "../CameraDialog";
import { ImageList, ImageListItem, ImageListItemBar } from "@mui/material";
import { addPhotos} from "../../store/newActionSlice";
import { useDispatch } from "react-redux";

export const AddPhotoFields = () => {
  const [photo, setPhoto] = useState(null)
  const dispatch = useDispatch()

  const handleTakePhoto = (dataUri) => {
    setPhoto(dataUri)
    dispatch(addPhotos(photo))
  }

  return(
    <>
    <CameraDialog  onTakePhoto={handleTakePhoto} />
    {[photo].length>0&&<ImageList
      cols={4}
      rowHeight={160}
      style={{width:"100%"}}
    >
      {[photo].map((photo,index)=>(
        <ImageListItem key={index}>
        <ImageListItemBar title={"Photo "+(index+1)} />
        <img src={photo} key={index} />
        </ImageListItem>
      ))}
    </ImageList>}
    </>
  )
}