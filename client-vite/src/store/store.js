import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from '@reduxjs/toolkit/query'
import { plantsApi } from "./plantsApi";
import { authApi } from "./authApi";
import newActionSliceReducer from "./newActionSlice";
import filterSliceReducer from "./filterSlice";
import authReducer from "./authSlice";
import { trayApi } from "./trayApi"; 
import { localStorageMiddleware, reHydrateStore } from "./localStoreMiddleware";
import { strainApi } from "./strainApi";
import { printApi } from "./printApi";
import { cycleApi } from "./cycleApi";
import { deviceApi } from "./deviceApi";
import { photoApi } from "./photoApi";
import { lightApi } from "./lightApi";
import { galleryApi } from "./galleryApi";

const reducer = {
  [plantsApi.reducerPath]: plantsApi.reducer,
  [authApi.reducerPath]: authApi.reducer,
  [trayApi.reducerPath]:trayApi.reducer,
  [strainApi.reducerPath]:strainApi.reducer,
  [printApi.reducerPath]:printApi.reducer,
  [cycleApi.reducerPath]:cycleApi.reducer,
  [lightApi.reducerPath]:lightApi.reducer,
  [deviceApi.reducerPath]:deviceApi.reducer,
  [photoApi.reducerPath]:photoApi.reducer,
  [galleryApi.reducerPath]:galleryApi.reducer, 
  newAction: newActionSliceReducer,
  filter: filterSliceReducer,
  auth: authReducer,
};

export const store = configureStore({
  reducer,
  preloadedState: reHydrateStore(),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([plantsApi.middleware,deviceApi.middleware,photoApi.middleware, authApi.middleware,lightApi.middleware, trayApi.middleware,strainApi.middleware,cycleApi.middleware,printApi.middleware,localStorageMiddleware,galleryApi.middleware]),
});

setupListeners(store.dispatch)
