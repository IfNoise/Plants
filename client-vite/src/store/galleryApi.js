import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../config/config";


export const galleryApi = createApi({
  reducerPath: "gallery/api",
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl + "/api/gallery",

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
      query: (filter) => {
        return {
          url: "/",
          method: "GET",
          params: {
            filter: JSON.stringify(filter),
          },
        };
      },
    }),
    getPhenoPhotos: build.query({
      query: (pheno) => {
        return {
          url: `/${pheno}`,
          method: "GET",
        };
      },
    }),
    deletePhoto: build.mutation({
      query: (id) => {
        return {
          url: `/${id}`,
          method: "DELETE",
        };
      },
    }),
  }),
});

export const { useGetPhotosQuery } = galleryApi;