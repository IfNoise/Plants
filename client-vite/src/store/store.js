import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { plantsApi } from "./plantsApi";
import { authApi } from "./authApi";
import newActionSliceReducer from "./newActionSlice";
import filterSliceReducer from "./filterSlice";
import nutrientsSliceReducer from "./nutrientsSlice";

import authReducer from "./authSlice";
import deviceStatusReducer from "./deviceStatusSlice";
import channelsReducer from "./channelsSlice";
import { trayApi } from "./trayApi";
import { localStorageMiddleware, reHydrateStore } from "./localStoreMiddleware";
import { strainApi } from "./strainApi";
import { printApi } from "./printApi";
import { cycleApi } from "./cycleApi";
import { deviceApi } from "./deviceApi";
import { photoApi } from "./photoApi";
import { lightApi } from "./lightApi";
import { galleryApi } from "./galleryApi";
import { feedingApi } from "./feedingApi";

const reducer = {
  [plantsApi.reducerPath]: plantsApi.reducer,
  [authApi.reducerPath]: authApi.reducer,
  [trayApi.reducerPath]: trayApi.reducer,
  [strainApi.reducerPath]: strainApi.reducer,
  [printApi.reducerPath]: printApi.reducer,
  [cycleApi.reducerPath]: cycleApi.reducer,
  [lightApi.reducerPath]: lightApi.reducer,
  [deviceApi.reducerPath]: deviceApi.reducer,
  [photoApi.reducerPath]: photoApi.reducer,
  [galleryApi.reducerPath]: galleryApi.reducer,
  [feedingApi.reducerPath]: feedingApi.reducer,
  newAction: newActionSliceReducer,
  filter: filterSliceReducer,
  nutrients: nutrientsSliceReducer,
  auth: authReducer,
  deviceStatus: deviceStatusReducer,
  channels: channelsReducer,
};

export const store = configureStore({
  reducer,
  preloadedState: reHydrateStore(),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Игнорируем проверки для больших объектов
        ignoredActions: ["plants/api/executeQuery/fulfilled"],
        ignoredPaths: ["plants.api", "gallery.api"],
      },
    }).concat([
      localStorageMiddleware,
      plantsApi.middleware,
      deviceApi.middleware,
      photoApi.middleware,
      authApi.middleware,
      lightApi.middleware,
      trayApi.middleware,
      strainApi.middleware,
      cycleApi.middleware,
      printApi.middleware,
      galleryApi.middleware,
      feedingApi.middleware,
    ]),
  devTools: process.env.NODE_ENV !== "production" && {
    maxAge: 50, // Ограничиваем количество действий в истории
    trace: false, // Отключаем stack traces
    traceLimit: 25,
  },
});

setupListeners(store.dispatch);
