import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../config/config";

const photoApi = createApi({
  reducerPath: "photo/api",
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl + "/photos",
    refetchOnFocus: true,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (build) => ({
    uploadPhotos: build.mutation({
      query: (files) => {
        const formData = new FormData();
        formData.append("file", files); // your frontend and backend file name "file" might have to be the same
        return { url: "/upload", method: "POST", body: formData };
      },
    }),
  }),
});

export const { useUploadPhotosMutation } = photoApi;
