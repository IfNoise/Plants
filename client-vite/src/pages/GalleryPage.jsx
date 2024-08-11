import { useLocation } from "react-router-dom";
import { useGetPhotosQuery } from "../store/galleryApi";
import { Alert, Box, CircularProgress, ImageList, ImageListItem, ImageListItemBar, Typography } from "@mui/material";
import { addPheno } from "../store/filterSlice";




export const GalleryPage = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const pFilter = Object.fromEntries(params);
  const { data: photos, isLoading, isError, error } = useGetPhotosQuery(pFilter)


  return (
    <Box>
      <Typography variant="h4" component="h4" gutterBottom>
        Gallery
      </Typography>
      {isError && <Alert severity="error">{error.message}</Alert>}
      {isLoading && <CircularProgress />}
      {photos && (
        <ImageList cols={4} rowHeight={160} style={{ width: "100%" }}>
          {photos.map((photo, index) => {
            const {src,strain,pheno,date}=photo;
            return (<ImageListItem key={index}>
              <img src={src} alt={strain} />
              <ImageListItemBar title={`${pheno}${date} `} />
            </ImageListItem>)
          })}
        </ImageList>
      )}
    </Box>
  );

}
