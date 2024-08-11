import { useLocation } from "react-router-dom";
import { useGetPhotosQuery } from "../store/galleryApi";
import { Alert, Box, CircularProgress, Dialog,FormControl,IconButton,ImageList, ImageListItem, ImageListItemBar, InputLabel, Link, MenuItem, Select, Tooltip, Typography } from "@mui/material";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import DownloadIcon from '@mui/icons-material/Download';

const DownloadButton = ({photo})=>{
  const {src,strain,pheno}=photo;
  return (
    <Link href={`https://ddweed.org/${src}`} download>
      <Tooltip title={`Download ${strain} ${pheno}`}>
        <IconButton>
          <DownloadIcon/>
        </IconButton>
      </Tooltip>
    </Link>
  )
}
DownloadButton.propTypes = {
  photo: PropTypes.object,
}

const ImageView = ({ photo,open ,onClose,next,prev}) => {
  const { src, strain, pheno,state,ageOfState,plantId } = photo;

  return (
    <Dialog 
    sx={{display:"flex",
          backgroundColor:"black",alignContent:"center",alignItems:"center",justifyContent:"center"}}
    fullScreen 
    open={open}>

        <Box sx={{
          position:"relative",
          width: "100%",
          height: "100%",
          overflow: "hidden",
          alignContent:"center",
          }}>
        <img 
        style={{height:"100%",width:"100%",objectFit:"cover"}}
        
        src={`https://ddweed.org/${src}`} 
        alt={strain} />
        <Box sx={{position:"absolute",top:0,left:0,p:2,backgroundColor:"rgba(255,255,255,0.5)",color:"black"}}>
        <Typography variant="h6" component="h6" gutterBottom>
          {strain}
        </Typography>
        <Typography variant="h6" component="h6" gutterBottom>
          {pheno}
        </Typography>
        <Typography variant="body1" component="p" gutterBottom>
          {`${ageOfState} days of ${state}`}
        </Typography>
        <Link href={`/plant/${plantId}`}>Plant</Link>
        </Box>
        <Box sx={{position:"absolute",bottom:0,p:2,backgroundColor:"tranparent",width:"100%",color:"black",justifyContent:"center",display:"flex",}}>
        <Tooltip title="Previous">
        <IconButton onClick={prev}><NavigateBeforeIcon/></IconButton>
        </Tooltip>
        <Tooltip title="Next">
        <IconButton onClick={next}><NavigateNextIcon/></IconButton>
        </Tooltip>
        <DownloadButton photo={photo}/>
        </Box>
        <Box sx={{position:"absolute",top:0,right:0,p:2,backgroundColor:"transparent",color:"black"}}>  
        <Tooltip title="Close">
        <IconButton onClick={onClose}><CloseIcon/></IconButton>
        </Tooltip>
        
        </Box>
        
        </Box>

    </Dialog>
  )

}

ImageView.propTypes = {
  photo: PropTypes.object,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  next: PropTypes.func,
  prev: PropTypes.func,
}



export const GalleryPage = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const pFilter = Object.fromEntries(params);
  const [open, setOpen] = useState(false);
  const [photoView, setPhotoView] = useState(null);
  const [filter, setFilter] = useState(pFilter||{});
  const [strains, setStrains] = useState([]);
  const [phenos, setPhenos] = useState([]);
  const { data: photos, isLoading, isError, error } = useGetPhotosQuery(filter, {
    refetchOnMountOrArgChange: true,
  })
  const next=()=>{
    const max=photos.length-1;
    if(photoView===max){
      setPhotoView(0);
      return;
    }
    setPhotoView(photoView+1);
  }

  const prev=()=>{
    const min=0;
    if(photoView===min){
      setPhotoView(photos.length-1);
      return;
    }
    setPhotoView(photoView-1);
  }

  const handleClose=()=>{
    setOpen(false);
    setPhotoView(null);
  }
  useEffect(() => {
    if (photos?.length>0) {
      const str = photos.map((photo) => photo.strain);
      setStrains([...new Set(str)]);
    }
  }, [photos]);
  useEffect(() => {
    if(filter.strain){
      const phn = photos.filter(photo=>photo.strain===filter.strain).map(photo=>photo.pheno);
      setPhenos([...new Set(phn)]);
    }
    }, [filter.strain])

  return (
    <Box>
      <Typography variant="h4" component="h4" gutterBottom>
        Gallery
      </Typography>
      {isError && <Alert severity="error">{error.message}</Alert>}
      {isLoading && <CircularProgress />}
      <Box>
        {strains?.length>0 && (
          <FormControl>
            <InputLabel>Strain</InputLabel>
          <Select
          sx={{margin:"2px",width:"200px"}}
            label="Strain"
            value={filter.strain || ""}
            onChange={(e) => setFilter({ ...filter, strain: e.target.value })}
          >
            {strains.map((strain, index) => {
              return <MenuItem key={index} value={strain}>{strain}</MenuItem>;
            }

        )}
          </Select>
          </FormControl>
        )}
        {phenos?.length>0 && (
          <FormControl>
          <InputLabel>Pheno</InputLabel>
          <Select
          sx={{margin:"2px",width:"200px"}}
            label="Pheno"
            value={filter.pheno || ""}
            onChange={(e) => setFilter({ ...filter, pheno: e.target.value })}
          >
            {phenos.map((pheno, index) => {
              return <MenuItem key={index} value={pheno}>{pheno}</MenuItem>;
            }

        )}
          </Select>
          </FormControl>
        )}

      </Box>

      {photos && (
        <ImageList cols={4} rowHeight={200} style={{ width: "100%" } } variant={'quilted'}>
          {photos.map((photo, index) => {
            const {src,strain,pheno,date}=photo;
            return (<ImageListItem 
            onClick={()=>{setPhotoView(index);setOpen(true)}}
            key={index}>
              <img src={`https://ddweed.org/${src}`} alt={strain} />
              <ImageListItemBar title={`${pheno} `} subtitle={new Date(date).toLocaleDateString()} position="below"/>
            </ImageListItem>)
          })}
        </ImageList>
      )}
      {photoView&&<ImageView photo={photos[photoView]} open={open} onClose={handleClose} next={next} prev={prev} />}
    </Box>
  );

}
