

export function AddPhotoFast({ open, onClose, plants }) {
  const [photos, setPhotos] = useState([]);
  const dispatch = useDispatch();
  const [uploadPhotos, { isLoading:isUploading, isSuccess:isUploadSuccess, isUploadError, uploadError, data: res }] = useUploadPhotosMutation();
  const newAction = useSelector((state) => state.newAction);
  const [addAction, { isSuccess, isError, error }] = useAddActionMutation();

  