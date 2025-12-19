import { createContext, useContext, useReducer, useCallback } from "react";
import PropTypes from "prop-types";
import { useAddActionMutation } from "../store/plantsApi";
import { useUploadPhotosMutation } from "../store/photoApi";

// Создаем контекст
const NewActionContext = createContext(null);

// Начальное состояние
const initialState = {};

// Reducer для управления состоянием
const newActionReducer = (state, action) => {
  switch (action.type) {
    case "ADD_DATE":
      return { ...state, date: action.payload };
    
    case "ADD_PHOTOS":
      if (!state.photos || state.photos.length === 0) {
        return { ...state, photos: [...action.payload] };
      }
      return { ...state, photos: [...state.photos, ...action.payload] };
    
    case "ADD_TYPE":
      return { ...state, actionType: action.payload };
    
    case "ADD_AUTHOR":
      return { ...state, author: action.payload };
    
    case "ADD_POT_SIZE":
      return { ...state, potSize: action.payload };
    
    case "ADD_ADDRESS":
      return { ...state, address: action.payload };
    
    case "ADD_BUILDING":
      return { 
        ...state, 
        address: { ...(state.address || {}), building: action.payload } 
      };
    
    case "ADD_ROOM":
      return { 
        ...state, 
        address: { ...state.address, room: action.payload } 
      };
    
    case "ADD_ROW":
      return { 
        ...state, 
        address: { ...state.address, row: action.payload } 
      };
    
    case "ADD_RACK":
      return { 
        ...state, 
        address: { ...state.address, rack: action.payload } 
      };
    
    case "ADD_SHELF":
      return { 
        ...state, 
        address: { ...state.address, shelf: action.payload } 
      };
    
    case "ADD_TRAY":
      return { 
        ...state, 
        address: { ...state.address, tray: action.payload } 
      };
    
    case "ADD_NUMBER":
      return { 
        ...state, 
        address: { ...state.address, number: action.payload } 
      };
    
    case "ADD_REASON":
      return { ...state, reason: action.payload };
    
    case "ADD_USER_REASON":
      return { ...state, userReason: action.payload };
    
    case "ADD_GENDER":
      return { ...state, gender: action.payload };
    
    case "ADD_CLONES_NUMBER":
      return { ...state, clonesNumber: action.payload };
    
    case "ADD_NOTE":
      return { ...state, note: action.payload };
    
    case "ADD_NEW_STATE":
      return { ...state, newState: action.payload };
    
    case "CLEAR":
      return {};
    
    default:
      return state;
  }
};

// Provider компонент
export const NewActionProvider = ({ children }) => {
  const [state, dispatch] = useReducer(newActionReducer, initialState);
  
  // Подключаем API mutations
  const [addAction, { isSuccess, isError, error }] = useAddActionMutation();
  const [uploadPhotos, { 
    isLoading: isUploadingPhotos, 
    isSuccess: isPhotosUploaded, 
    isError: isPhotosError, 
    error: photosError 
  }] = useUploadPhotosMutation();

  // Создаем мемоизированные action creators
  const addDate = useCallback((date) => {
    dispatch({ type: "ADD_DATE", payload: date });
  }, []);

  const addPhotos = useCallback((photos) => {
    dispatch({ type: "ADD_PHOTOS", payload: photos });
  }, []);

  const addType = useCallback((type) => {
    dispatch({ type: "ADD_TYPE", payload: type });
  }, []);

  const addAuthor = useCallback((author) => {
    dispatch({ type: "ADD_AUTHOR", payload: author });
  }, []);

  const addPotSize = useCallback((potSize) => {
    dispatch({ type: "ADD_POT_SIZE", payload: potSize });
  }, []);

  const addAddress = useCallback((address) => {
    dispatch({ type: "ADD_ADDRESS", payload: address });
  }, []);

  const addBuilding = useCallback((building) => {
    dispatch({ type: "ADD_BUILDING", payload: building });
  }, []);

  const addRoom = useCallback((room) => {
    dispatch({ type: "ADD_ROOM", payload: room });
  }, []);

  const addRow = useCallback((row) => {
    dispatch({ type: "ADD_ROW", payload: row });
  }, []);

  const addRack = useCallback((rack) => {
    dispatch({ type: "ADD_RACK", payload: rack });
  }, []);

  const addShelf = useCallback((shelf) => {
    dispatch({ type: "ADD_SHELF", payload: shelf });
  }, []);

  const addTray = useCallback((tray) => {
    dispatch({ type: "ADD_TRAY", payload: tray });
  }, []);

  const addNumber = useCallback((number) => {
    dispatch({ type: "ADD_NUMBER", payload: number });
  }, []);

  const addReason = useCallback((reason) => {
    dispatch({ type: "ADD_REASON", payload: reason });
  }, []);

  const addUserReason = useCallback((userReason) => {
    dispatch({ type: "ADD_USER_REASON", payload: userReason });
  }, []);

  const addGender = useCallback((gender) => {
    dispatch({ type: "ADD_GENDER", payload: gender });
  }, []);

  const addClonesNumber = useCallback((clonesNumber) => {
    dispatch({ type: "ADD_CLONES_NUMBER", payload: clonesNumber });
  }, []);

  const addNote = useCallback((note) => {
    dispatch({ type: "ADD_NOTE", payload: note });
  }, []);

  const addNewState = useCallback((newState) => {
    dispatch({ type: "ADD_NEW_STATE", payload: newState });
  }, []);

  const clear = useCallback(() => {
    dispatch({ type: "CLEAR" });
  }, []);

  // Функция для загрузки фотографий
  const uploadPhotosToServer = useCallback(async (photoDataUris) => {
    if (!photoDataUris || photoDataUris.length === 0) {
      return [];
    }
    
    try {
      const result = await uploadPhotos(photoDataUris).unwrap();
      if (result?.files?.length > 0) {
        const filenames = result.files.map(file => file.filename);
        return filenames;
      }
      return [];
    } catch (err) {
      console.error('Error uploading photos:', err);
      throw err;
    }
  }, [uploadPhotos]);

  // Функция для отправки действия на сервер (с загрузкой фотографий если нужно)
  const submitAction = useCallback(async (plantIds, pendingPhotos = []) => {
    console.log('submitAction called with photos:', pendingPhotos.length);
    try {
      // Если есть фотографии для загрузки, загружаем их сначала
      let uploadedFilenames = [];
      if (pendingPhotos && pendingPhotos.length > 0) {
        console.log('Uploading photos to server...');
        uploadedFilenames = await uploadPhotosToServer(pendingPhotos);
        console.log('Uploaded filenames:', uploadedFilenames);
        
        // Добавляем загруженные файлы в состояние действия
        if (uploadedFilenames.length > 0) {
          dispatch({ type: "ADD_PHOTOS", payload: uploadedFilenames });
        }
      }
      
      // Формируем финальное действие с загруженными фотографиями
      const finalAction = {
        ...state,
        photos: [...(state.photos || []), ...uploadedFilenames]
      };
      
      console.log('Submitting final action:', finalAction);
      const body = { id: plantIds, action: finalAction };
      return addAction(body);
    } catch (err) {
      console.error('Error submitting action:', err);
      throw err;
    }
  }, [state, addAction, uploadPhotosToServer]);

  const value = {
    newAction: state,
    addDate,
    addPhotos,
    addType,
    addAuthor,
    addPotSize,
    addAddress,
    addBuilding,
    addRoom,
    addRow,
    addRack,
    addShelf,
    addTray,
    addNumber,
    addReason,
    addUserReason,
    addGender,
    addClonesNumber,
    addNote,
    addNewState,
    clear,
    // API состояния и функции
    submitAction,
    uploadPhotosToServer,
    isSuccess,
    isError,
    error,
    isUploadingPhotos,
    isPhotosUploaded,
    isPhotosError,
    photosError,
  };

  return (
    <NewActionContext.Provider value={value}>
      {children}
    </NewActionContext.Provider>
  );
};

NewActionProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Custom hook для использования контекста
export const useNewAction = () => {
  const context = useContext(NewActionContext);
  if (!context) {
    throw new Error("useNewAction must be used within a NewActionProvider");
  }
  return context;
};

export default NewActionContext;
