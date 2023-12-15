import { configureStore } from "@reduxjs/toolkit";
import { plantsApi } from "./plantsApi";
import { authApi } from "./authApi";
import newActionSliceReducer from "./newActionSlice";
import authReducer from "./authSlice";
import { trayApi } from "./trayApi"; 
import { localStorageMiddleware, reHydrateStore } from "./localStoreMiddleware";

const reducer = {
  [plantsApi.reducerPath]: plantsApi.reducer,
  [authApi.reducerPath]: authApi.reducer,
  [trayApi.reducerPath]:trayApi.reducer,
  newAction: newActionSliceReducer,
  auth: authReducer,
};

export const store = configureStore({
  reducer,
  preloadedState: reHydrateStore(),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([plantsApi.middleware, authApi.middleware,trayApi.middleware,localStorageMiddleware]),
});
