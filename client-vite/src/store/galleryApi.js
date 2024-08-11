import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../config/config";


export const galleryApi = createApi({
  reducerPath: "gallery/api",
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl + "/api/gallery",
    refetchOnFocus: true,
    // prepareHeaders: (headers, { getState }) => {
    //   const token = getState().auth.token;
    //   if (token) {
    //     headers.set("authorization", `Bearer ${token}`);
    //   }
    //   return headers;
    // },
  }),
  endpoints: (build) => ({
    getPhotos: build.query({
      query: () => {
        return {
          url: "/",
          method: "GET",
        };
      },
    }),
  }),
});

export const { useGetPhotosQuery } = galleryApi;