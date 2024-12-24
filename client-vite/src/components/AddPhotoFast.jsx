import { useEffect } from "react";
import { useUploadPhotosMutation } from "../store/photoApi";
import { useDispatch, useSelector } from "react-redux";
import { clear, addType, addPhotos } from "../store/newActionSlice";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PhotoIcon from "@mui/icons-material/Photo";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Input,
  Typography,
} from "@mui/material";
import { useState, useContext } from "react";
import CameraDialog from "./CameraDialog";
import { SnackbarContext } from "../context/SnackbarContext";
import { useAddActionMutation } from "../store/plantsApi";
import PropTypes from "prop-types";

export function AddPhotoFast({ open, onClose, plants }) {
  const [photos, setPhotos] = useState([]);
  const { setSnack } = useContext(SnackbarContext);
  const dispatch = useDispatch();
  const [
    uploadPhotos,
    {
      isLoading: isUploading,
      isSuccess: isUploadSuccess,
      isUploadError,
      uploadError,
      data: res,
    },
  ] = useUploadPhotosMutation();
  const newAction = useSelector((state) => state.newAction);
  const [addAction, { isSuccess, isError, error }] = useAddActionMutation();

  const handleTakePhoto = (dataUri) => {
    setPhotos([...photos, dataUri]);
  };

  const handleSendPhotos = () => {
    try {
      if (photos.length === 0) {
        throw new Error("No photos to upload");
      }
      uploadPhotos(photos)
        .unwrap()
        .then((res) => {
          console.log("Files uploaded:", res.files);
          const files = res.files.map((file) => file.filename);
          dispatch(addType("AddPhoto"));
          dispatch(addPhotos(files));
          console.log("Photos uploaded successfully");
          if (plants.length < 1) {
            setSnack({
              open: true,
              severity: "error",
              message: "No plants selected",
            });
            return;
          }
          const id = plants.map((plant) => plant._id);

          const body = { id, action: newAction };
          addAction(body);
        })
        .catch((error) => {
          console.error("Error uploading photos:", error);
        });
    } catch (error) {
      console.error("Error uploading photos:", error);
    }
  };

  useEffect(() => {
    if (res?.files?.length > 0) {
      console.log("Files uploaded:", res.files);
      const files = res.files.map((file) => file.filename);
      dispatch(addType("AddPhoto"));
      dispatch(addPhotos(files));
      console.log("Photos uploaded successfully");
      if (plants.length < 1) {
        setSnack({
          open: true,
          severity: "error",
          message: "No plants selected",
        });
        return;
      }
      const id = plants.map((plant) => plant._id);

      const body = { id, action: newAction };
      addAction(body);
    }
  }, [res]);

  useEffect(() => {
    if (isError) {
      setSnack({ open: true, severity: "error", message: error.data.message });
    }
  }, [isError]);
  useEffect(() => {
    if (isSuccess) {
      setSnack({ open: true, severity: "success", message: "Action is added" });
      dispatch(clear());
      setPhotos([]);
      onClose();
    }
  }, [isSuccess]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Add Photos</DialogTitle>
      <DialogContent>
        <CameraDialog onTakePhoto={handleTakePhoto} />
        <Button
          sx={{ m: 2 }}
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          startIcon={<PhotoIcon />}
        >
          Select Photos
          <Input
            sx={{
              clip: "rect(0 0 0 0)",
              clipPath: "inset(50%)",
              height: 1,
              overflow: "hidden",
              position: "absolute",
              bottom: 0,
              left: 0,
              whiteSpace: "nowrap",
              width: 1,
            }}
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              const reader = new FileReader();
              reader.onload = (e) => {
                setPhotos([...photos, e.target.result]);
              };
              reader.readAsDataURL(file);
            }}
          />
        </Button>

        {photos.length > 0 && (
          <ImageList cols={4} rowHeight={160} style={{ width: "100%" }}>
            {photos.map((photo, index) => (
              <ImageListItem key={index}>
                <ImageListItemBar
                  title={"Photo " + (index + 1)}
                  actionIcon={
                    <IconButton
                      onClick={() =>
                        setPhotos(photos.filter((_, i) => i !== index))
                      }
                    >
                      <CancelIcon />
                    </IconButton>
                  }
                  actionPosition="top"
                />
                <img src={photo} key={index} />
              </ImageListItem>
            ))}
          </ImageList>
        )}
        {isUploading && <CircularProgress />}
        {isUploadSuccess && <CheckCircleIcon color="success" />}
        {isUploadError && (
          <>
            <CancelIcon color="error" />
            <Typography variant="caption" color="error">
              {uploadError}
            </Typography>
          </>
        )}
        <Divider />
        {isSuccess && <CheckCircleIcon color="success" />}
        {isError && (
          <>
            <CancelIcon color="error" />
            <Typography variant="caption" color="error">
              {error.data.message}
            </Typography>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button disabled={!photos?.length > 0} onClick={handleSendPhotos}>
          Send Photos
        </Button>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}
AddPhotoFast.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  plants: PropTypes.arrayOf(PropTypes.object),
};
