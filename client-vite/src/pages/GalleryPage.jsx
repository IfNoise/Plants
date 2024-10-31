import { useLocation } from "react-router-dom";
import { useGetPhotosQuery } from "../store/galleryApi";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  FormControl,
  IconButton,
  ImageList,
  ImageListItem,
  //ImageListItemBar,
  InputLabel,
  Link,
  MenuItem,
  Select,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import PropTypes from "prop-types";
import { useEffect, useState, useContext, useRef } from "react";
import CloseIcon from "@mui/icons-material/Close";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import DownloadIcon from "@mui/icons-material/Download";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import { AppBarContext } from "../context/AppBarContext";
import { ThemeContext } from "@emotion/react";
const buttonStyle = {
  marginRight: "auto",
  size: "large",

};

const DownloadButton = ({ photo }) => {
  const { src, strain, pheno } = photo;
  return (
    <Link href={`https://ddweed.org/${src}`} download>
      <Tooltip title={`Download ${strain} ${pheno}`}>
        <IconButton>
          <DownloadIcon />
        </IconButton>
      </Tooltip>
    </Link>
  );
};
DownloadButton.propTypes = {
  photo: PropTypes.object,
};

const ImageView = ({ photo, open, onClose, next, prev }) => {
  const { src, strain, pheno, state, ageOfState, plantId } = photo;
  const [touchStart, setTouchStart] = useState(null);
  const imgNode = useRef(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [zoom, setZoom] = useState(1);
  const minSwipe = 100;
  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };
  const handleZoomIn = () => {
    const { width, height } = imgNode.current;
    setZoom((prevZoom) => Math.min(prevZoom + 0.2, 2)); // Максимальный зум 3x
  };

  const handleZoomOut = () => {
    const { width, height } = imgNode.current;
    setZoom((prevZoom) => Math.max(prevZoom - 0.2, 0)); // Минимальный зум 1x
  };
  const href = src.includes("gallery/") ? src.split("/")[1] : src;
  const handleTouchMove = (e) => {
    setTouchEnd(e.touches[0].clientX);
  };
  const handleTouchEnd = () => {
    if (touchStart - touchEnd > minSwipe) {
      next();
    }
    if (touchStart - touchEnd < -minSwipe) {
      prev();
    }
  };

  return (
    <Dialog
      sx={{
        display: "flex",
        backgroundColor: "black",
        alignContent: "center",
        alignItems: "center",
        justifyContent: "center",
      }}
      fullScreen
      open={open}
    >
      <Box
        sx={{
          position: "relative",
          width: "100vw",
          height: "100vh",
          overflow: "hidden",
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <Box
         sx={{
          position: "relative",
          height: '100%',
          width: "100%",
          overflow: "auto",
         }}>
        <img
          ref={imgNode}
          style={{
            height: 'auto',
            width:  'auto',
            objectFit: "contain", // Change to 'contain' to prevent cropping
            transform: `scale(${zoom})`,
            transformPosition: "center",
            transition: "transform 0.3s ease",
          }}
          src={`https://ddweed.org/gallery/${href}`}
          alt={strain}
        />
        </Box>
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            p: 2,
            backgroundColor: "rgba(255,255,255,0.5)",
            color: "black",
          }}
        >
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
        <Box
          sx={{
            position: "absolute",
            bottom: {
              xs: "calc(50% - 24px)",
              sm: "calc(50% - 32px)",
              md: 0,
              lg: 0,
              xl: 0,
            },
            left: 0,
            p: 2,
            backgroundColor: "tranparent",
            width: "100%",
            color: "black",
            justifyContent: "center",
            display: "flex",
          }}
        >
          <Tooltip title="Previous">
            <IconButton onClick={prev} sx={buttonStyle}>
              <NavigateBeforeIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Next">
            <IconButton onClick={next}>
              <NavigateNextIcon />
            </IconButton>
          </Tooltip>
        </Box>
        <Box
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            p: 2,
            backgroundColor: "transparent",
            color: "black",
          }}
        >

          <Tooltip title="Close">
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Tooltip>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Tooltip title="Zoom In">
            
            <IconButton size="large" onClick={handleZoomIn}>
              <ZoomInIcon fontSize="large" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Zoom Out">
            <IconButton size="large" onClick={handleZoomOut}>
              <ZoomOutIcon fontSize="large" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Download">
            <DownloadButton photo={photo} />
          </Tooltip>
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
};

ImageView.propTypes = {
  photo: PropTypes.object,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  next: PropTypes.func,
  prev: PropTypes.func,
};

export const GalleryPage = () => {
  const location = useLocation();
  const theme = useContext(ThemeContext);
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const appBar = useContext(AppBarContext);
  const params = new URLSearchParams(location.search);
  const pFilter = Object.fromEntries(params);
  const [open, setOpen] = useState(false);
  const [photoView, setPhotoView] = useState(null);
  const [filter, setFilter] = useState(pFilter || {});
  const [strains, setStrains] = useState([]);
  const [phenos, setPhenos] = useState([]);
  const [states, setStates] = useState([]);
  const {
    data: photos,
    isLoading,
    isError,
    error,
  } = useGetPhotosQuery(filter, {
    refetchOnMountOrArgChange: true,
  });

  const next = () => {
    const max = photos.length - 1;
    if (photoView === max) {
      setPhotoView(0);
      return;
    }
    setPhotoView(photoView + 1);
  };

  const prev = () => {
    const min = 0;
    if (photoView === min) {
      setPhotoView(photos.length - 1);
      return;
    }
    setPhotoView(photoView - 1);
  };

  const handleClose = () => {
    setOpen(false);
    setPhotoView(null);
  };
  useEffect(() => {
    appBar.setAppBar({ title: "Gallery" });
  }, []);
  useEffect(() => {
    if (photos?.length > 0) {
      const str = photos.map((photo) => photo.strain);
      setStrains([...new Set(str)]);
      const sts = photos.map((photo) => photo.state);
      setStates([...new Set(sts)]);
    }
  }, [photos]);
  useEffect(() => {
    if (filter.strain) {
      const phn = photos
        .filter((photo) => photo.strain === filter.strain)
        .map((photo) => photo.pheno);
      setPhenos([...new Set(phn)]);
    }
  }, [filter.strain]);

  return (
    <Box>
      {isError && <Alert severity="error">{error.message}</Alert>}
      {isLoading && <CircularProgress />}
      <Box>
        {strains?.length > 0 && (
          <FormControl>
            <InputLabel>Strain</InputLabel>
            <Select
              sx={{ margin: "2px", width: "200px" }}
              label="Strain"
              value={filter.strain || ""}
              onChange={(e) => setFilter({ ...filter, strain: e.target.value })}
            >
              {strains.map((strain, index) => {
                return (
                  <MenuItem key={index} value={strain}>
                    {strain}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        )}
        {phenos?.length > 0 && (
          <FormControl>
            <InputLabel>Pheno</InputLabel>
            <Select
              sx={{ margin: "2px", width: "200px" }}
              label="Pheno"
              value={filter.pheno || ""}
              onChange={(e) => setFilter({ ...filter, pheno: e.target.value })}
            >
              {phenos.map((pheno, index) => {
                return (
                  <MenuItem key={index} value={pheno}>
                    {pheno}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        )}
        {states?.length > 0 && (
          <FormControl>
            <InputLabel>State</InputLabel>
            <Select
              sx={{ margin: "2px", width: "200px" }}
              label="State"
              value={filter.state || ""}
              onChange={(e) => setFilter({ ...filter, state: e.target.value })}
            >
              {states.map((state, index) => {
                return (
                  <MenuItem key={index} value={state}>
                    {state}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        )}
        <Button sx={{ margin: "auto" }} onClick={() => setFilter({})}>
          Clear
        </Button>
      </Box>

      {photos && (
        <ImageList
          cols={isSmall ? 3 : 6}
          rowHeight="200px"
          sx={{ width: "100%" }}
          variant="standard"
        >
          {photos.map((photo, index) => {
            const { src, strain } = photo;
            const thumbnail =
              "thumbnails/" +
              (src?.includes("gallery/") ? src.split("gallery/")[1] : src);
            return (
              <ImageListItem
                onClick={() => {
                  setPhotoView(index);
                  setOpen(true);
                }}
                key={index}
              >
                <img
                  src={`https://ddweed.org/gallery/${thumbnail}`}
                  alt={strain}
                />
              </ImageListItem>
            );
          })}
        </ImageList>
      )}
      {photoView !== null && (
        <ImageView
          photo={photos[photoView]}
          open={open}
          onClose={handleClose}
          next={next}
          prev={prev}
        />
      )}
    </Box>
  );
};
